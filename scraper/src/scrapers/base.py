"""
Base scraper class với retry logic và rate limiting.
"""
import time
import random
import logging
from abc import ABC, abstractmethod
from typing import Optional
from datetime import date

import requests
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from ..models.day_data import DayData

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Base class cho tất cả scrapers."""

    # Default headers giả lập browser
    # Note: Removed Accept-Encoding to avoid Brotli compression issues
    # requests library doesn't handle 'br' (Brotli) compression automatically
    DEFAULT_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
        "Cache-Control": "max-age=0",
    }

    def __init__(
        self,
        base_url: str,
        delay_range: tuple[float, float] = (1.0, 3.0),
        timeout: int = 30,
        max_retries: int = 3,
    ):
        """
        Khởi tạo scraper.

        Args:
            base_url: URL gốc của website
            delay_range: Khoảng delay ngẫu nhiên giữa các request (min, max) seconds
            timeout: Timeout cho mỗi request (seconds)
            max_retries: Số lần retry tối đa khi request fail
        """
        self.base_url = base_url.rstrip("/")
        self.delay_range = delay_range
        self.timeout = timeout
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update(self.DEFAULT_HEADERS)

    def _random_delay(self) -> None:
        """Delay ngẫu nhiên để tránh bị block."""
        delay = random.uniform(*self.delay_range)
        logger.debug(f"Sleeping for {delay:.2f} seconds...")
        time.sleep(delay)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((requests.RequestException, ConnectionError)),
    )
    def _fetch_url(self, url: str) -> str:
        """
        Fetch HTML content từ URL với retry logic.

        Args:
            url: URL cần fetch

        Returns:
            HTML content as string

        Raises:
            requests.RequestException: Nếu request fail sau max retries
        """
        logger.info(f"Fetching: {url}")
        response = self.session.get(url, timeout=self.timeout)
        response.raise_for_status()
        response.encoding = "utf-8"
        return response.text

    def fetch_with_delay(self, url: str) -> str:
        """
        Fetch URL với random delay.

        Args:
            url: URL cần fetch

        Returns:
            HTML content
        """
        self._random_delay()
        return self._fetch_url(url)

    @abstractmethod
    def build_url(self, target_date: date) -> str:
        """
        Xây dựng URL cho ngày cụ thể.

        Args:
            target_date: Ngày cần scrape

        Returns:
            Full URL
        """
        pass

    @abstractmethod
    def parse_day(self, html: str, target_date: date) -> Optional[DayData]:
        """
        Parse HTML và trả về DayData.

        Args:
            html: HTML content
            target_date: Ngày đang parse

        Returns:
            DayData object hoặc None nếu parse fail
        """
        pass

    def scrape_day(self, target_date: date) -> Optional[DayData]:
        """
        Scrape dữ liệu cho 1 ngày.

        Args:
            target_date: Ngày cần scrape

        Returns:
            DayData hoặc None nếu fail
        """
        try:
            url = self.build_url(target_date)
            html = self.fetch_with_delay(url)
            return self.parse_day(html, target_date)
        except Exception as e:
            logger.error(f"Failed to scrape {target_date}: {e}")
            return None

    def scrape_date_range(
        self,
        start_date: date,
        end_date: date,
        progress_callback: Optional[callable] = None,
    ) -> list[DayData]:
        """
        Scrape dữ liệu cho khoảng ngày.

        Args:
            start_date: Ngày bắt đầu
            end_date: Ngày kết thúc
            progress_callback: Callback function (current, total)

        Returns:
            List of DayData
        """
        from datetime import timedelta

        results = []
        current = start_date
        total_days = (end_date - start_date).days + 1
        day_count = 0

        while current <= end_date:
            day_count += 1
            logger.info(f"Scraping day {day_count}/{total_days}: {current}")

            day_data = self.scrape_day(current)
            if day_data:
                results.append(day_data)

            if progress_callback:
                progress_callback(day_count, total_days)

            current += timedelta(days=1)

        logger.info(f"Scraped {len(results)}/{total_days} days successfully")
        return results

    def close(self) -> None:
        """Đóng session."""
        self.session.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
