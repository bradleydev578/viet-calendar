"""
JSON Exporter - xuất data ra file JSON cho mobile app.
"""
import json
import logging
from datetime import date, datetime
from pathlib import Path
from typing import Optional

from ..models.day_data import DayData, YearData

logger = logging.getLogger(__name__)


class JSONExporter:
    """Export data ra JSON format cho mobile app."""

    def __init__(self, output_dir: Optional[Path] = None):
        """
        Khởi tạo exporter.

        Args:
            output_dir: Thư mục output, mặc định là data/export
        """
        self.output_dir = output_dir or Path("data/export")
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def export_day(self, day_data: DayData, filepath: Optional[Path] = None) -> Path:
        """
        Export data 1 ngày ra JSON.

        Args:
            day_data: DayData object
            filepath: Đường dẫn file output

        Returns:
            Path của file đã tạo
        """
        if filepath is None:
            filepath = self.output_dir / f"day_{day_data.solar_date.isoformat()}.json"

        data = self._day_to_dict(day_data)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        logger.info(f"Exported day data to {filepath}")
        return filepath

    def export_year(self, year_data: YearData, filepath: Optional[Path] = None) -> Path:
        """
        Export data cả năm ra JSON.

        Args:
            year_data: YearData object
            filepath: Đường dẫn file output

        Returns:
            Path của file đã tạo
        """
        if filepath is None:
            filepath = self.output_dir / f"fengshui_{year_data.year}.json"

        data = {
            "version": "1.0",
            "year": year_data.year,
            "generated_at": datetime.now().isoformat(),
            "total_days": year_data.total_days,
            "days": [self._day_to_compact_dict(d) for d in year_data.days],
            "activities": self._get_activities_reference(),
        }

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)

        # Also create pretty version for debugging
        pretty_filepath = filepath.with_suffix('.pretty.json')
        with open(pretty_filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        logger.info(f"Exported year data to {filepath} ({year_data.total_days} days)")
        return filepath

    def export_days_list(self, days: list[DayData], year: int) -> Path:
        """
        Export list of DayData ra JSON.

        Args:
            days: List of DayData objects
            year: Năm

        Returns:
            Path của file đã tạo
        """
        year_data = YearData(year=year, days=days, total_days=len(days))
        return self.export_year(year_data)

    def _day_to_dict(self, day: DayData) -> dict:
        """Convert DayData to full dict."""
        return {
            "solar_date": day.solar_date.isoformat(),
            "lunar_date": {
                "day": day.lunar_date.day,
                "month": day.lunar_date.month,
                "year": day.lunar_date.year,
                "is_leap_month": day.lunar_date.is_leap_month,
            },
            "can_chi": {
                "year": {"can": day.can_chi.year.can, "chi": day.can_chi.year.chi},
                "month": {"can": day.can_chi.month.can, "chi": day.can_chi.month.chi},
                "day": {"can": day.can_chi.day.can, "chi": day.can_chi.day.chi},
                "ngu_hanh": day.can_chi.ngu_hanh,
            },
            "tiet_khi": day.tiet_khi,
            "star28": {
                "name": day.star28.name,
                "is_good": day.star28.is_good,
            } if day.star28 else None,
            "truc12": {
                "name": day.truc12.name,
                "is_good": day.truc12.is_good,
            } if day.truc12 else None,
            "hoang_dao_hours": [
                {
                    "chi": h.chi,
                    "time_range": h.time_range,
                    "is_hoang_dao": h.is_hoang_dao,
                }
                for h in day.hoang_dao_hours
            ],
            "directions": [
                {
                    "name": d.name,
                    "direction": d.direction,
                    "rating": d.rating,
                }
                for d in day.directions
            ],
            "good_activities": [
                {"name": a.name, "category": a.category}
                for a in day.good_activities
            ],
            "bad_activities": [
                {"name": a.name, "category": a.category}
                for a in day.bad_activities
            ],
            "good_stars": day.good_stars,
            "bad_stars": day.bad_stars,
            "ly_thuan_phong_hours": [
                {
                    "time_range": h.time_range,
                    "name": h.name,
                    "is_good": h.is_good,
                    "description": h.description,
                }
                for h in day.ly_thuan_phong_hours
            ],
            "conflicting_ages": {
                "xung_ngay": day.conflicting_ages.xung_ngay,
                "xung_thang": day.conflicting_ages.xung_thang,
            } if day.conflicting_ages else None,
            "day_score": day.day_score,
            "source": day.source,
            "scraped_at": day.scraped_at,
        }

    def _day_to_compact_dict(self, day: DayData) -> dict:
        """
        Convert DayData to compact dict for mobile app.
        Sử dụng keys ngắn để giảm file size.
        """
        return {
            "d": day.solar_date.isoformat(),  # solar_date
            "ld": day.lunar_date.day,  # lunar_day
            "lm": day.lunar_date.month,  # lunar_month
            "ly": day.lunar_date.year,  # lunar_year
            "lp": 1 if day.lunar_date.is_leap_month else 0,  # is_leap
            "dgz": f"{day.can_chi.day.can} {day.can_chi.day.chi}",  # day_gan_zhi
            "mgz": f"{day.can_chi.month.can} {day.can_chi.month.chi}",  # month_gan_zhi
            "ygz": f"{day.can_chi.year.can} {day.can_chi.year.chi}",  # year_gan_zhi
            "nh": day.can_chi.ngu_hanh,  # ngu_hanh
            "s28": day.star28.name if day.star28 else None,  # star_28
            "s28g": 1 if day.star28 and day.star28.is_good else 0,  # star_28_is_good
            "t12": day.truc12.name if day.truc12 else None,  # truc_12
            "t12g": 1 if day.truc12 and day.truc12.is_good else 0,  # truc_12_is_good
            "tk": day.tiet_khi,  # tiet_khi
            "hd": [h.chi for h in day.hoang_dao_hours if h.is_hoang_dao],  # hoang_dao_hours
            "dir": [
                {"n": d.name, "d": d.direction, "r": d.rating}
                for d in day.directions
            ],
            "ga": [a.name for a in day.good_activities],  # good_activities
            "ba": [a.name for a in day.bad_activities],  # bad_activities
            "gs": day.good_stars,  # good_stars
            "bs": day.bad_stars,  # bad_stars
            "sc": day.day_score,  # day_score
        }

    def _get_activities_reference(self) -> dict:
        """Get reference dictionary for activities."""
        # TODO: Load from activities master list
        return {
            "cau_an": {"n": "Cầu an", "c": "spiritual"},
            "cau_tu": {"n": "Cầu tự", "c": "spiritual"},
            "giai_han": {"n": "Giải hạn", "c": "spiritual"},
            "cung_te": {"n": "Cúng tế", "c": "spiritual"},
            "dong_tho": {"n": "Động thổ", "c": "construction"},
            "xay_nha": {"n": "Xây nhà", "c": "construction"},
            "sua_chua": {"n": "Sửa chữa", "c": "construction"},
            "khai_truong": {"n": "Khai trương", "c": "business"},
            "ky_hop_dong": {"n": "Ký hợp đồng", "c": "business"},
            "giao_dich": {"n": "Giao dịch", "c": "business"},
            "xuat_hanh": {"n": "Xuất hành", "c": "travel"},
            "cuoi_hoi": {"n": "Cưới hỏi", "c": "family"},
            "an_hoi": {"n": "Ăn hỏi", "c": "family"},
            "nhap_trach": {"n": "Nhập trạch", "c": "family"},
            "kham_benh": {"n": "Khám bệnh", "c": "health"},
            "an_tang": {"n": "An táng", "c": "funeral"},
            "cai_tang": {"n": "Cải táng", "c": "funeral"},
            "trong_trot": {"n": "Trồng trọt", "c": "agriculture"},
        }


def export_to_json(days: list[DayData], year: int, output_path: Optional[Path] = None) -> Path:
    """
    Convenience function để export data ra JSON.

    Args:
        days: List of DayData
        year: Năm
        output_path: Đường dẫn output (optional)

    Returns:
        Path của file đã tạo
    """
    exporter = JSONExporter()
    if output_path:
        return exporter.export_days_list(days, year)
    return exporter.export_days_list(days, year)
