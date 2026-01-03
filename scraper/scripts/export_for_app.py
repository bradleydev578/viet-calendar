#!/usr/bin/env python3
"""
Export feng shui data cho mobile app.

Usage:
    python scripts/export_for_app.py 2025
    python scripts/export_for_app.py 2025 --gzip
    python scripts/export_for_app.py 2024 2025 2026 --output mobile/assets/data
    python scripts/export_for_app.py 2025 --source sqlite --source-path data/fengshui.db
"""
import argparse
import gzip
import json
import logging
import sys
from datetime import date
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.storage.json_exporter import JSONExporter
from src.models.day_data import DayData, YearData

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_from_json_files(json_dir: Path, year: int) -> list[DayData]:
    """
    Load data từ individual JSON files trong directory.

    Args:
        json_dir: Directory chứa day_YYYY-MM-DD.json files
        year: Năm cần load

    Returns:
        List of DayData objects
    """
    days = []
    pattern = f"day_{year}-*.json"

    json_files = sorted(json_dir.glob(pattern))
    logger.info(f"Found {len(json_files)} JSON files for year {year}")

    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            day = DayData.model_validate(data)
            days.append(day)
        except Exception as e:
            logger.warning(f"Failed to load {json_file}: {e}")

    return days


def load_from_year_json(json_path: Path) -> list[DayData]:
    """
    Load data từ year JSON file (fengshui_YYYY.json).

    Args:
        json_path: Path to fengshui_YYYY.json or fengshui_YYYY.pretty.json

    Returns:
        List of DayData objects
    """
    logger.info(f"Loading from {json_path}")

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    days = []
    for day_data in data.get('days', []):
        try:
            # Handle compact format (short keys)
            if 'd' in day_data:
                day = _expand_compact_day(day_data)
            else:
                day = DayData.model_validate(day_data)
            days.append(day)
        except Exception as e:
            logger.warning(f"Failed to parse day: {e}")

    return days


def _expand_compact_day(compact: dict) -> DayData:
    """
    Expand compact format (short keys) back to full DayData.
    This is a simplified expansion - may not restore all fields.
    """
    from src.models.day_data import (
        LunarDate, CanChi, CanChiInfo, HourInfo, Star28Info, Truc12Info,
        DirectionInfo, ActivityInfo
    )

    # Parse Can Chi from compact format "Giáp Tý"
    def parse_gan_zhi(gz_str: str) -> CanChi:
        parts = gz_str.split() if gz_str else ['Giáp', 'Tý']
        return CanChi(can=parts[0], chi=parts[1] if len(parts) > 1 else 'Tý')

    return DayData(
        solar_date=date.fromisoformat(compact['d']),
        lunar_date=LunarDate(
            day=compact.get('ld', 1),
            month=compact.get('lm', 1),
            year=compact.get('ly', 2025),
            is_leap_month=bool(compact.get('lp', 0)),
        ),
        can_chi=CanChiInfo(
            day=parse_gan_zhi(compact.get('dgz', '')),
            month=parse_gan_zhi(compact.get('mgz', '')),
            year=parse_gan_zhi(compact.get('ygz', '')),
            ngu_hanh=compact.get('nh', 'Mộc'),
        ),
        tiet_khi=compact.get('tk'),
        star28=Star28Info(
            name=compact.get('s28', ''),
            is_good=bool(compact.get('s28g', 1)),
        ) if compact.get('s28') else None,
        truc12=Truc12Info(
            name=compact.get('t12', ''),
            is_good=bool(compact.get('t12g', 1)),
        ) if compact.get('t12') else None,
        hoang_dao_hours=[
            HourInfo(chi=chi, time_range='', is_hoang_dao=True, is_hac_dao=False)
            for chi in compact.get('hd', [])
        ],
        directions=[
            DirectionInfo(name=d.get('n', ''), direction=d.get('d', ''), rating=d.get('r', 3))
            for d in compact.get('dir', [])
        ],
        good_activities=[
            ActivityInfo(name=a, category='general')
            for a in compact.get('ga', [])
        ],
        bad_activities=[
            ActivityInfo(name=a, category='general')
            for a in compact.get('ba', [])
        ],
        good_stars=compact.get('gs', []),
        bad_stars=compact.get('bs', []),
        day_score=compact.get('sc'),
        source='exported',
    )


def export_year(
    year: int,
    source_dir: Path,
    output_dir: Path,
    gzip_output: bool = False,
) -> dict:
    """
    Export data cho một năm.

    Args:
        year: Năm cần export
        source_dir: Directory chứa source data
        output_dir: Directory để output
        gzip_output: Có tạo file .gz không

    Returns:
        Export stats dict
    """
    logger.info(f"Exporting year {year}...")

    # Try to load from different sources
    days = []

    # Try 1: Load from individual day files
    day_files = list(source_dir.glob(f"day_{year}-*.json"))
    if day_files:
        days = load_from_json_files(source_dir, year)

    # Try 2: Load from year file
    if not days:
        year_file = source_dir / f"fengshui_{year}.json"
        if year_file.exists():
            days = load_from_year_json(year_file)

        # Try pretty version
        if not days:
            pretty_file = source_dir / f"fengshui_{year}.pretty.json"
            if pretty_file.exists():
                days = load_from_year_json(pretty_file)

    if not days:
        logger.warning(f"No data found for year {year}")
        return {'year': year, 'days': 0, 'status': 'no_data'}

    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)

    # Export using JSONExporter
    exporter = JSONExporter(output_dir)
    year_data = YearData(year=year, days=days, total_days=len(days))

    # Export to year file
    output_path = output_dir / f"fengshui_{year}.json"
    filepath = exporter.export_year(year_data, output_path)

    file_size = filepath.stat().st_size

    # Create gzipped version if requested
    gz_size = None
    if gzip_output:
        gz_path = filepath.with_suffix('.json.gz')
        with open(filepath, 'rb') as f_in:
            with gzip.open(gz_path, 'wb') as f_out:
                f_out.writelines(f_in)

        gz_size = gz_path.stat().st_size
        ratio = (1 - gz_size / file_size) * 100
        logger.info(f"Gzipped: {file_size/1024:.1f}KB -> {gz_size/1024:.1f}KB ({ratio:.1f}% reduction)")

    return {
        'year': year,
        'days': len(days),
        'output': str(filepath),
        'size_kb': file_size / 1024,
        'gz_size_kb': gz_size / 1024 if gz_size else None,
        'status': 'success',
    }


def main():
    parser = argparse.ArgumentParser(
        description='Export feng shui data for mobile app'
    )
    parser.add_argument(
        'years',
        type=int,
        nargs='+',
        help='Years to export (e.g., 2025 or 2024 2025 2026)'
    )
    parser.add_argument(
        '--source-path',
        type=Path,
        default=Path('data/export'),
        help='Path to source data directory (default: data/export)'
    )
    parser.add_argument(
        '--output', '-o',
        type=Path,
        default=Path('data/mobile'),
        help='Output directory (default: data/mobile)'
    )
    parser.add_argument(
        '--gzip',
        action='store_true',
        help='Create gzipped output files'
    )

    args = parser.parse_args()

    # Ensure output directory exists
    args.output.mkdir(parents=True, exist_ok=True)

    # Export each year
    results = []
    for year in args.years:
        result = export_year(
            year=year,
            source_dir=args.source_path,
            output_dir=args.output,
            gzip_output=args.gzip,
        )
        results.append(result)

    # Print summary
    print("\n" + "=" * 50)
    print("EXPORT COMPLETE")
    print("=" * 50)

    total_days = 0
    total_size = 0

    for r in results:
        status_icon = "✓" if r['status'] == 'success' else "✗"
        size_str = f"{r.get('size_kb', 0):.1f} KB"
        if r.get('gz_size_kb'):
            size_str += f" (gz: {r['gz_size_kb']:.1f} KB)"

        print(f"[{status_icon}] {r['year']}: {r.get('days', 0)} days, {size_str}")
        total_days += r.get('days', 0)
        total_size += r.get('size_kb', 0)

    print("-" * 50)
    print(f"Total: {total_days} days, {total_size:.1f} KB")
    print(f"Output: {args.output}")
    print("=" * 50)

    # Return exit code
    failed = sum(1 for r in results if r['status'] != 'success')
    return 1 if failed == len(results) else 0


if __name__ == '__main__':
    sys.exit(main())
