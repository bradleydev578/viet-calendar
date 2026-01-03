"""
SQLite storage cho dữ liệu phong thủy.

Lưu trữ data đã scrape và validate để query nhanh và export.
"""
import json
import logging
import sqlite3
from datetime import date, datetime
from pathlib import Path
from typing import Optional

from ..models.day_data import DayData, LunarDate, CanChi, CanChiInfo

logger = logging.getLogger(__name__)


class SQLiteStorage:
    """SQLite storage cho dữ liệu ngày."""

    def __init__(self, db_path: Optional[Path] = None):
        """
        Khởi tạo storage.

        Args:
            db_path: Đường dẫn file SQLite, mặc định là data/fengshui.db
        """
        self.db_path = db_path or Path("data/fengshui.db")
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _init_db(self) -> None:
        """Tạo tables nếu chưa có."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()

            # Main table cho dữ liệu ngày
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS days (
                    solar_date TEXT PRIMARY KEY,
                    lunar_day INTEGER NOT NULL,
                    lunar_month INTEGER NOT NULL,
                    lunar_year INTEGER NOT NULL,
                    is_leap_month INTEGER DEFAULT 0,
                    day_can TEXT,
                    day_chi TEXT,
                    month_can TEXT,
                    month_chi TEXT,
                    year_can TEXT,
                    year_chi TEXT,
                    ngu_hanh TEXT,
                    tiet_khi TEXT,
                    star28_name TEXT,
                    star28_is_good INTEGER,
                    truc12_name TEXT,
                    truc12_is_good INTEGER,
                    day_score INTEGER,
                    source TEXT,
                    data_json TEXT,
                    created_at TEXT,
                    updated_at TEXT
                )
            """)

            # Index cho queries phổ biến
            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_lunar_date
                ON days(lunar_year, lunar_month, lunar_day)
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_day_score
                ON days(day_score)
            """)

            # Table cho metadata
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS metadata (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    updated_at TEXT
                )
            """)

            conn.commit()
            logger.info(f"Database initialized at {self.db_path}")

    def save_day(self, day_data: DayData) -> bool:
        """
        Lưu dữ liệu 1 ngày.

        Args:
            day_data: DayData object

        Returns:
            True nếu thành công
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()

                now = datetime.now().isoformat()

                # Convert full data to JSON for storage
                data_json = day_data.model_dump_json()

                cursor.execute("""
                    INSERT OR REPLACE INTO days (
                        solar_date, lunar_day, lunar_month, lunar_year, is_leap_month,
                        day_can, day_chi, month_can, month_chi, year_can, year_chi,
                        ngu_hanh, tiet_khi, star28_name, star28_is_good,
                        truc12_name, truc12_is_good, day_score, source,
                        data_json, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    day_data.solar_date.isoformat(),
                    day_data.lunar_date.day,
                    day_data.lunar_date.month,
                    day_data.lunar_date.year,
                    1 if day_data.lunar_date.is_leap_month else 0,
                    day_data.can_chi.day.can,
                    day_data.can_chi.day.chi,
                    day_data.can_chi.month.can,
                    day_data.can_chi.month.chi,
                    day_data.can_chi.year.can,
                    day_data.can_chi.year.chi,
                    day_data.can_chi.ngu_hanh,
                    day_data.tiet_khi,
                    day_data.star28.name if day_data.star28 else None,
                    1 if day_data.star28 and day_data.star28.is_good else 0,
                    day_data.truc12.name if day_data.truc12 else None,
                    1 if day_data.truc12 and day_data.truc12.is_good else 0,
                    day_data.day_score,
                    day_data.source,
                    data_json,
                    now,
                    now,
                ))

                conn.commit()
                return True

        except Exception as e:
            logger.error(f"Error saving day {day_data.solar_date}: {e}")
            return False

    def save_days(self, days: list[DayData]) -> int:
        """
        Lưu nhiều ngày.

        Args:
            days: List of DayData

        Returns:
            Số ngày đã lưu thành công
        """
        saved = 0
        for day in days:
            if self.save_day(day):
                saved += 1
        logger.info(f"Saved {saved}/{len(days)} days to database")
        return saved

    def get_day(self, solar_date: date) -> Optional[DayData]:
        """
        Lấy dữ liệu 1 ngày theo ngày dương.

        Args:
            solar_date: Ngày dương lịch

        Returns:
            DayData hoặc None
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT data_json FROM days WHERE solar_date = ?",
                    (solar_date.isoformat(),)
                )
                row = cursor.fetchone()

                if row:
                    return DayData.model_validate_json(row[0])
                return None

        except Exception as e:
            logger.error(f"Error getting day {solar_date}: {e}")
            return None

    def get_days_range(self, start: date, end: date) -> list[DayData]:
        """
        Lấy dữ liệu trong khoảng ngày.

        Args:
            start: Ngày bắt đầu
            end: Ngày kết thúc

        Returns:
            List of DayData
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT data_json FROM days
                    WHERE solar_date >= ? AND solar_date <= ?
                    ORDER BY solar_date
                """, (start.isoformat(), end.isoformat()))

                return [
                    DayData.model_validate_json(row[0])
                    for row in cursor.fetchall()
                ]

        except Exception as e:
            logger.error(f"Error getting days range: {e}")
            return []

    def get_days_by_lunar_month(self, year: int, month: int) -> list[DayData]:
        """
        Lấy dữ liệu theo tháng âm lịch.

        Args:
            year: Năm âm lịch
            month: Tháng âm lịch

        Returns:
            List of DayData
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT data_json FROM days
                    WHERE lunar_year = ? AND lunar_month = ?
                    ORDER BY lunar_day
                """, (year, month))

                return [
                    DayData.model_validate_json(row[0])
                    for row in cursor.fetchall()
                ]

        except Exception as e:
            logger.error(f"Error getting lunar month {year}/{month}: {e}")
            return []

    def get_good_days(
        self,
        start: date,
        end: date,
        min_score: int = 70
    ) -> list[DayData]:
        """
        Lấy các ngày tốt trong khoảng.

        Args:
            start: Ngày bắt đầu
            end: Ngày kết thúc
            min_score: Điểm tối thiểu (default 70)

        Returns:
            List of DayData có điểm >= min_score
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT data_json FROM days
                    WHERE solar_date >= ? AND solar_date <= ?
                    AND day_score >= ?
                    ORDER BY day_score DESC
                """, (start.isoformat(), end.isoformat(), min_score))

                return [
                    DayData.model_validate_json(row[0])
                    for row in cursor.fetchall()
                ]

        except Exception as e:
            logger.error(f"Error getting good days: {e}")
            return []

    def search_by_can_chi(self, can: str, chi: str) -> list[DayData]:
        """
        Tìm các ngày theo Can Chi.

        Args:
            can: Thiên Can (Giáp, Ất, ...)
            chi: Địa Chi (Tý, Sửu, ...)

        Returns:
            List of DayData có Can Chi trùng
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT data_json FROM days
                    WHERE day_can = ? AND day_chi = ?
                    ORDER BY solar_date
                """, (can, chi))

                return [
                    DayData.model_validate_json(row[0])
                    for row in cursor.fetchall()
                ]

        except Exception as e:
            logger.error(f"Error searching by can chi: {e}")
            return []

    def count_days(self) -> int:
        """Đếm tổng số ngày trong database."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT COUNT(*) FROM days")
                return cursor.fetchone()[0]
        except Exception:
            return 0

    def get_date_range(self) -> tuple[Optional[date], Optional[date]]:
        """
        Lấy khoảng ngày có trong database.

        Returns:
            (min_date, max_date) hoặc (None, None)
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT MIN(solar_date), MAX(solar_date) FROM days
                """)
                row = cursor.fetchone()
                if row and row[0]:
                    return (
                        date.fromisoformat(row[0]),
                        date.fromisoformat(row[1])
                    )
                return (None, None)
        except Exception:
            return (None, None)

    def delete_day(self, solar_date: date) -> bool:
        """Xóa dữ liệu 1 ngày."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "DELETE FROM days WHERE solar_date = ?",
                    (solar_date.isoformat(),)
                )
                conn.commit()
                return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error deleting day {solar_date}: {e}")
            return False

    def set_metadata(self, key: str, value: str) -> None:
        """Lưu metadata."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO metadata (key, value, updated_at)
                    VALUES (?, ?, ?)
                """, (key, value, datetime.now().isoformat()))
                conn.commit()
        except Exception as e:
            logger.error(f"Error setting metadata {key}: {e}")

    def get_metadata(self, key: str) -> Optional[str]:
        """Lấy metadata."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT value FROM metadata WHERE key = ?",
                    (key,)
                )
                row = cursor.fetchone()
                return row[0] if row else None
        except Exception:
            return None

    def get_stats(self) -> dict:
        """Lấy thống kê database."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()

                # Total days
                cursor.execute("SELECT COUNT(*) FROM days")
                total = cursor.fetchone()[0]

                # Date range
                cursor.execute("""
                    SELECT MIN(solar_date), MAX(solar_date) FROM days
                """)
                date_range = cursor.fetchone()

                # Score distribution
                cursor.execute("""
                    SELECT
                        SUM(CASE WHEN day_score >= 80 THEN 1 ELSE 0 END) as excellent,
                        SUM(CASE WHEN day_score >= 60 AND day_score < 80 THEN 1 ELSE 0 END) as good,
                        SUM(CASE WHEN day_score >= 40 AND day_score < 60 THEN 1 ELSE 0 END) as average,
                        SUM(CASE WHEN day_score < 40 THEN 1 ELSE 0 END) as poor
                    FROM days WHERE day_score IS NOT NULL
                """)
                scores = cursor.fetchone()

                return {
                    "total_days": total,
                    "date_range": {
                        "start": date_range[0],
                        "end": date_range[1],
                    } if date_range[0] else None,
                    "score_distribution": {
                        "excellent": scores[0] or 0,
                        "good": scores[1] or 0,
                        "average": scores[2] or 0,
                        "poor": scores[3] or 0,
                    } if scores else None,
                    "db_size_kb": self.db_path.stat().st_size // 1024,
                }

        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {}

    def close(self) -> None:
        """Close any open connections (no-op for sqlite3)."""
        pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
