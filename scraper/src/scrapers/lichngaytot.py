"""
Scraper cho lichngaytot.com - nguồn chính.
Scraper cho xemngay.com - nguồn phụ cho cross-validation.
"""
import logging
from datetime import date
from typing import Optional

from .base import BaseScraper
from ..models.day_data import DayData, XemNgayData
from ..parsers.lichngaytot_parser import LichNgayTotParser
from ..parsers.xemngay_parser import XemNgayParser

logger = logging.getLogger(__name__)


class LichNgayTotScraper(BaseScraper):
    """Scraper cho lichngaytot.com"""

    BASE_URL = "https://lichngaytot.com"

    def __init__(
        self,
        delay_range: tuple[float, float] = (1.0, 2.0),
        timeout: int = 30,
        max_retries: int = 3,
    ):
        super().__init__(
            base_url=self.BASE_URL,
            delay_range=delay_range,
            timeout=timeout,
            max_retries=max_retries,
        )
        self.parser = LichNgayTotParser()

    def build_url(self, target_date: date) -> str:
        """
        Xây dựng URL cho ngày cụ thể.
        Format: https://lichngaytot.com/xem-ngay-tot-xau-DD-MM-YYYY
        """
        return f"{self.base_url}/xem-ngay-tot-xau-{target_date.strftime('%d-%m-%Y')}"

    def parse_day(self, html: str, target_date: date) -> Optional[DayData]:
        """
        Parse HTML và trả về DayData.
        """
        return self.parser.parse(html, target_date)


class XemNgayScraper(BaseScraper):
    """Scraper cho xemngay.com - nguồn phụ cho cross-validation."""

    BASE_URL = "https://xemngay.com"

    def __init__(
        self,
        delay_range: tuple[float, float] = (1.5, 2.5),
        timeout: int = 30,
        max_retries: int = 3,
    ):
        super().__init__(
            base_url=self.BASE_URL,
            delay_range=delay_range,
            timeout=timeout,
            max_retries=max_retries,
        )
        self.parser = XemNgayParser()

    def build_url(self, target_date: date) -> str:
        """
        Xây dựng URL cho ngày cụ thể.
        Format: https://xemngay.com/?blog=xngay&d=DDMMYYYY
        """
        return f"{self.base_url}/?blog=xngay&d={target_date.strftime('%d%m%Y')}"

    def parse_day(self, html: str, target_date: date) -> Optional[XemNgayData]:
        """
        Parse HTML và trả về XemNgayData.
        Cung cấp thông tin 28 Sao chi tiết với ngũ hành và con vật.
        """
        return self.parser.parse(html, target_date)
