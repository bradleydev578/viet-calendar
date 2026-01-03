#!/usr/bin/env python3
"""
Validate dữ liệu đã scrape với lunar-javascript.

Usage:
    python scripts/validate_data.py --dir data/export
    python scripts/validate_data.py --file data/export/day_2025-12-12.json
    python scripts/validate_data.py --year 2025
"""
import argparse
import json
import logging
import sys
from datetime import date
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.models.day_data import DayData
from src.validators.lunar_validator import LunarValidator, validate_scraped_data
from src.storage.sqlite_storage import SQLiteStorage

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def load_json_files(directory: Path) -> list[DayData]:
    """Load all JSON files from directory."""
    days = []
    json_files = sorted(directory.glob("day_*.json"))

    for f in json_files:
        try:
            with open(f, 'r', encoding='utf-8') as file:
                data = json.load(file)
                day = DayData.model_validate(data)
                days.append(day)
        except Exception as e:
            logger.warning(f"Error loading {f.name}: {e}")

    return days


def load_single_file(filepath: Path) -> list[DayData]:
    """Load single JSON file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            day = DayData.model_validate(data)
            return [day]
    except Exception as e:
        logger.error(f"Error loading {filepath}: {e}")
        return []


def load_from_db(db_path: Path, year: int) -> list[DayData]:
    """Load days from SQLite database."""
    storage = SQLiteStorage(db_path)
    start = date(year, 1, 1)
    end = date(year, 12, 31)
    return storage.get_days_range(start, end)


def print_results(summary: dict) -> None:
    """Print validation results."""
    print("\n" + "=" * 60)
    print("VALIDATION RESULTS")
    print("=" * 60)

    print(f"\nTotal days validated: {summary['total']}")
    print(f"Valid: {summary['valid']} ({summary['accuracy']:.1f}%)")
    print(f"Invalid: {summary['invalid']}")
    print(f"Warnings: {summary.get('warnings_count', 0)}")

    if summary['errors']:
        print("\n" + "-" * 40)
        print("ERRORS:")
        print("-" * 40)

        for error in summary['errors'][:10]:  # Show first 10 errors
            print(f"\n{error['date']}:")
            for e in error['errors']:
                print(f"  - {e}")
            if error.get('expected'):
                print(f"  Expected: {error['expected'].get('day_can')}{error['expected'].get('day_chi')}")
            if error.get('actual'):
                print(f"  Actual: {error['actual'].get('day_can')}{error['actual'].get('day_chi')}")

        if len(summary['errors']) > 10:
            print(f"\n... and {len(summary['errors']) - 10} more errors")

    if summary.get('warnings'):
        print("\n" + "-" * 40)
        print("WARNINGS (Month Can Chi differences due to calculation method):")
        print("-" * 40)

        for warning in summary['warnings'][:5]:  # Show first 5 warnings
            print(f"\n{warning['date']}:")
            for w in warning['warnings']:
                print(f"  - {w}")

        if len(summary['warnings']) > 5:
            print(f"\n... and {len(summary['warnings']) - 5} more warnings")

    print("\n" + "=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Validate scraped feng shui data"
    )
    parser.add_argument(
        "--dir",
        type=Path,
        help="Directory containing JSON files to validate",
    )
    parser.add_argument(
        "--file",
        type=Path,
        help="Single JSON file to validate",
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=Path("data/fengshui.db"),
        help="SQLite database path",
    )
    parser.add_argument(
        "--year",
        type=int,
        help="Year to validate from database",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Output file for validation results (JSON)",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Verbose output",
    )

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Load data
    days = []

    if args.file:
        logger.info(f"Loading from file: {args.file}")
        days = load_single_file(args.file)
    elif args.dir:
        logger.info(f"Loading from directory: {args.dir}")
        days = load_json_files(args.dir)
    elif args.year:
        logger.info(f"Loading year {args.year} from database: {args.db}")
        days = load_from_db(args.db, args.year)
    else:
        # Default: load from data/export
        default_dir = Path("data/export")
        if default_dir.exists():
            logger.info(f"Loading from default directory: {default_dir}")
            days = load_json_files(default_dir)
        else:
            parser.print_help()
            sys.exit(1)

    if not days:
        logger.error("No data to validate")
        sys.exit(1)

    logger.info(f"Loaded {len(days)} days for validation")

    # Validate
    try:
        validator = LunarValidator()

        def progress(current, total):
            if current % 10 == 0 or current == total:
                print(f"\rValidating... {current}/{total}", end="", flush=True)

        summary = validator.validate_batch(days, progress_callback=progress)
        print()  # New line after progress

    except Exception as e:
        logger.error(f"Validation failed: {e}")
        logger.info("Make sure Node.js and lunar-javascript are installed:")
        logger.info("  npm install lunar-javascript")
        sys.exit(1)

    # Print results
    print_results(summary)

    # Save to file if requested
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2, default=str)
        logger.info(f"Results saved to {args.output}")

    # Exit code based on results
    if summary['invalid'] > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
