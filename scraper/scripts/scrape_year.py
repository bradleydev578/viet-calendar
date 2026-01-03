#!/usr/bin/env python3
"""
Script để scrape data phong thủy cho cả năm.

Usage:
    python scripts/scrape_year.py 2025
    python scripts/scrape_year.py 2025 --output data/export
    python scripts/scrape_year.py 2025 --start-month 6 --end-month 12
"""
import argparse
import logging
import sys
from datetime import date, timedelta
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.scrapers.lichngaytot import LichNgayTotScraper
from src.storage.json_exporter import JSONExporter
from src.models.day_data import DayData

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('scrape.log'),
    ]
)
logger = logging.getLogger(__name__)


def progress_callback(current: int, total: int) -> None:
    """Callback để hiển thị progress."""
    percent = (current / total) * 100
    bar_length = 40
    filled = int(bar_length * current // total)
    bar = '█' * filled + '░' * (bar_length - filled)
    print(f'\r[{bar}] {percent:.1f}% ({current}/{total})', end='', flush=True)


def scrape_year(
    year: int,
    output_dir: Path,
    start_month: int = 1,
    end_month: int = 12,
    delay_range: tuple[float, float] = (1.0, 2.0),
) -> None:
    """
    Scrape data cho 1 năm hoặc range tháng.

    Args:
        year: Năm cần scrape
        output_dir: Thư mục output
        start_month: Tháng bắt đầu (1-12)
        end_month: Tháng kết thúc (1-12)
        delay_range: Khoảng delay giữa các request
    """
    logger.info(f"Starting scrape for year {year}, months {start_month}-{end_month}")

    # Tính ngày bắt đầu và kết thúc
    start_date = date(year, start_month, 1)
    if end_month == 12:
        end_date = date(year, 12, 31)
    else:
        # Ngày cuối của tháng end_month
        next_month = date(year, end_month + 1, 1)
        end_date = next_month - timedelta(days=1)

    total_days = (end_date - start_date).days + 1
    logger.info(f"Will scrape {total_days} days from {start_date} to {end_date}")

    # Initialize scraper
    scraper = LichNgayTotScraper(delay_range=delay_range)

    # Stats
    success_count = 0
    error_count = 0
    results: list[DayData] = []

    try:
        # Scrape từng ngày
        current = start_date
        day_num = 0

        while current <= end_date:
            day_num += 1
            progress_callback(day_num, total_days)

            try:
                day_data = scraper.scrape_day(current)
                if day_data:
                    results.append(day_data)
                    success_count += 1
                else:
                    error_count += 1
                    logger.warning(f"No data returned for {current}")
            except Exception as e:
                error_count += 1
                logger.error(f"Error scraping {current}: {e}")

            current += timedelta(days=1)

        print()  # New line after progress bar

    finally:
        scraper.close()

    # Export results
    if results:
        logger.info(f"Exporting {len(results)} days to JSON...")
        exporter = JSONExporter(output_dir)
        output_path = exporter.export_days_list(results, year)
        logger.info(f"Exported to {output_path}")

    # Summary
    print("\n" + "=" * 50)
    print("SCRAPE COMPLETE")
    print("=" * 50)
    print(f"Year: {year}")
    print(f"Date range: {start_date} to {end_date}")
    print(f"Total days: {total_days}")
    print(f"Successful: {success_count}")
    print(f"Errors: {error_count}")
    print(f"Success rate: {(success_count / total_days) * 100:.1f}%")
    print(f"Output: {output_dir}")
    print("=" * 50)


def scrape_single_day(target_date: date, output_dir: Path) -> None:
    """Scrape data cho 1 ngày để test."""
    logger.info(f"Scraping single day: {target_date}")

    scraper = LichNgayTotScraper(delay_range=(0.5, 1.0))

    try:
        day_data = scraper.scrape_day(target_date)
        if day_data:
            exporter = JSONExporter(output_dir)
            output_path = exporter.export_day(day_data)
            print(f"Exported to {output_path}")

            # Print summary
            print("\n" + "=" * 50)
            print(f"Date: {day_data.solar_date}")
            print(f"Lunar: {day_data.lunar_date.day}/{day_data.lunar_date.month}/{day_data.lunar_date.year}")
            print(f"Can Chi Day: {day_data.can_chi.day.full}")
            print(f"Star 28: {day_data.star28.name if day_data.star28 else 'N/A'}")
            print(f"Truc 12: {day_data.truc12.name if day_data.truc12 else 'N/A'}")
            print(f"Good activities: {len(day_data.good_activities)}")
            print(f"Bad activities: {len(day_data.bad_activities)}")
            print("=" * 50)
        else:
            print("Failed to scrape data")
    finally:
        scraper.close()


def main():
    parser = argparse.ArgumentParser(
        description='Scrape feng shui data from lichngaytot.com'
    )
    parser.add_argument(
        'year',
        type=int,
        help='Year to scrape (e.g., 2025)'
    )
    parser.add_argument(
        '--output', '-o',
        type=Path,
        default=Path('data/export'),
        help='Output directory (default: data/export)'
    )
    parser.add_argument(
        '--start-month',
        type=int,
        default=1,
        choices=range(1, 13),
        help='Start month (1-12, default: 1)'
    )
    parser.add_argument(
        '--end-month',
        type=int,
        default=12,
        choices=range(1, 13),
        help='End month (1-12, default: 12)'
    )
    parser.add_argument(
        '--single-day',
        type=str,
        help='Scrape single day for testing (format: YYYY-MM-DD)'
    )
    parser.add_argument(
        '--delay-min',
        type=float,
        default=1.0,
        help='Minimum delay between requests in seconds (default: 1.0)'
    )
    parser.add_argument(
        '--delay-max',
        type=float,
        default=2.0,
        help='Maximum delay between requests in seconds (default: 2.0)'
    )

    args = parser.parse_args()

    # Create output directory
    args.output.mkdir(parents=True, exist_ok=True)

    if args.single_day:
        # Test mode: scrape single day
        target_date = date.fromisoformat(args.single_day)
        scrape_single_day(target_date, args.output)
    else:
        # Full scrape
        scrape_year(
            year=args.year,
            output_dir=args.output,
            start_month=args.start_month,
            end_month=args.end_month,
            delay_range=(args.delay_min, args.delay_max),
        )


if __name__ == '__main__':
    main()
