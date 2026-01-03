"""
Lunar date validator - Validate dữ liệu âm lịch với lunar-javascript (Node.js).

Sử dụng subprocess để gọi Node.js script với lunar-javascript library.
"""
import json
import logging
import subprocess
from datetime import date
from pathlib import Path
from typing import Optional

from ..models.day_data import DayData, LunarDate, CanChi

logger = logging.getLogger(__name__)

# Node.js script để validate
LUNAR_SCRIPT = """
const Lunar = require('lunar-javascript').Lunar;
const Solar = require('lunar-javascript').Solar;

// Read input from stdin
let input = '';
process.stdin.on('data', (chunk) => {
    input += chunk;
});

process.stdin.on('end', () => {
    try {
        const data = JSON.parse(input);
        const results = [];

        for (const item of data) {
            const { year, month, day } = item;
            const solar = Solar.fromYmd(year, month, day);
            const lunar = solar.getLunar();

            // Get Can Chi
            const yearGanZhi = lunar.getYearInGanZhi();
            const monthGanZhi = lunar.getMonthInGanZhi();
            const dayGanZhi = lunar.getDayInGanZhi();

            // Get solar term (tiết khí)
            const jieQi = lunar.getJieQi();

            // Get lunar month - negative value means leap month
            const lunarMonth = lunar.getMonth();
            const isLeapMonth = lunarMonth < 0;
            const actualMonth = Math.abs(lunarMonth);

            results.push({
                solar_date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                lunar_day: lunar.getDay(),
                lunar_month: actualMonth,
                lunar_year: lunar.getYear(),
                is_leap_month: isLeapMonth,
                year_gan: yearGanZhi.substring(0, 1),
                year_zhi: yearGanZhi.substring(1),
                month_gan: monthGanZhi.substring(0, 1),
                month_zhi: monthGanZhi.substring(1),
                day_gan: dayGanZhi.substring(0, 1),
                day_zhi: dayGanZhi.substring(1),
                jie_qi: jieQi || null,
            });
        }

        console.log(JSON.stringify(results));
    } catch (e) {
        console.error(JSON.stringify({ error: e.message }));
        process.exit(1);
    }
});
"""

# Mapping Hán tự -> Việt
CAN_MAP = {
    '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
    '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
}

CHI_MAP = {
    '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
    '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
}

TIET_KHI_MAP = {
    '小寒': 'Tiểu hàn', '大寒': 'Đại hàn', '立春': 'Lập xuân', '雨水': 'Vũ thủy',
    '驚蟄': 'Kinh trập', '春分': 'Xuân phân', '清明': 'Thanh minh', '穀雨': 'Cốc vũ',
    '立夏': 'Lập hạ', '小滿': 'Tiểu mãn', '芒種': 'Mang chủng', '夏至': 'Hạ chí',
    '小暑': 'Tiểu thử', '大暑': 'Đại thử', '立秋': 'Lập thu', '處暑': 'Xử thử',
    '白露': 'Bạch lộ', '秋分': 'Thu phân', '寒露': 'Hàn lộ', '霜降': 'Sương giáng',
    '立冬': 'Lập đông', '小雪': 'Tiểu tuyết', '大雪': 'Đại tuyết', '冬至': 'Đông chí',
}


class LunarValidationResult:
    """Kết quả validation."""

    def __init__(
        self,
        solar_date: date,
        is_valid: bool,
        errors: list[str],
        warnings: list[str] = None,
        expected: Optional[dict] = None,
        actual: Optional[dict] = None,
    ):
        self.solar_date = solar_date
        self.is_valid = is_valid
        self.errors = errors
        self.warnings = warnings or []
        self.expected = expected  # From lunar-javascript
        self.actual = actual      # From scraped data

    def __repr__(self):
        status = "✓" if self.is_valid else "✗"
        return f"<LunarValidationResult {self.solar_date} {status} errors={len(self.errors)} warnings={len(self.warnings)}>"


class LunarValidator:
    """Validator cho dữ liệu âm lịch."""

    def __init__(self, node_path: str = "node"):
        """
        Khởi tạo validator.

        Args:
            node_path: Path tới Node.js executable
        """
        self.node_path = node_path
        self._check_dependencies()

    def _check_dependencies(self) -> bool:
        """Kiểm tra Node.js và lunar-javascript đã cài đặt."""
        try:
            # Check Node.js
            result = subprocess.run(
                [self.node_path, "--version"],
                capture_output=True,
                text=True,
            )
            if result.returncode != 0:
                logger.warning("Node.js not found")
                return False

            # Check lunar-javascript
            check_script = "try { require('lunar-javascript'); console.log('OK'); } catch(e) { console.log('NOT_FOUND'); }"
            result = subprocess.run(
                [self.node_path, "-e", check_script],
                capture_output=True,
                text=True,
            )
            if "NOT_FOUND" in result.stdout:
                logger.warning("lunar-javascript not installed. Run: npm install lunar-javascript")
                return False

            return True

        except FileNotFoundError:
            logger.warning("Node.js not found in PATH")
            return False

    def _get_lunar_data(self, dates: list[date]) -> list[dict]:
        """
        Gọi lunar-javascript để lấy dữ liệu chuẩn.

        Args:
            dates: List of dates to convert

        Returns:
            List of lunar data dicts
        """
        try:
            # Prepare input
            input_data = [
                {"year": d.year, "month": d.month, "day": d.day}
                for d in dates
            ]

            # Run Node.js script
            result = subprocess.run(
                [self.node_path, "-e", LUNAR_SCRIPT],
                input=json.dumps(input_data),
                capture_output=True,
                text=True,
                timeout=30,
            )

            if result.returncode != 0:
                logger.error(f"Node.js error: {result.stderr}")
                return []

            return json.loads(result.stdout)

        except subprocess.TimeoutExpired:
            logger.error("Lunar validation timeout")
            return []
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return []
        except Exception as e:
            logger.error(f"Error getting lunar data: {e}")
            return []

    def _convert_to_vietnamese(self, data: dict) -> dict:
        """Convert Hán tự sang tiếng Việt."""
        return {
            **data,
            "year_can": CAN_MAP.get(data.get("year_gan"), data.get("year_gan")),
            "year_chi": CHI_MAP.get(data.get("year_zhi"), data.get("year_zhi")),
            "month_can": CAN_MAP.get(data.get("month_gan"), data.get("month_gan")),
            "month_chi": CHI_MAP.get(data.get("month_zhi"), data.get("month_zhi")),
            "day_can": CAN_MAP.get(data.get("day_gan"), data.get("day_gan")),
            "day_chi": CHI_MAP.get(data.get("day_zhi"), data.get("day_zhi")),
            "tiet_khi": TIET_KHI_MAP.get(data.get("jie_qi"), data.get("jie_qi")),
        }

    def validate_day(self, day_data: DayData, strict_month: bool = False) -> LunarValidationResult:
        """
        Validate dữ liệu 1 ngày.

        Args:
            day_data: DayData từ scraper
            strict_month: Nếu True, coi khác biệt Month Can Chi là error.
                         Nếu False (default), chỉ coi là warning vì có thể
                         do khác biệt quy tắc tính (Tiết khí vs Tháng âm lịch)

        Returns:
            LunarValidationResult
        """
        errors = []
        warnings = []

        # Get expected data from lunar-javascript
        lunar_results = self._get_lunar_data([day_data.solar_date])
        if not lunar_results:
            return LunarValidationResult(
                solar_date=day_data.solar_date,
                is_valid=False,
                errors=["Failed to get reference lunar data"],
            )

        expected = self._convert_to_vietnamese(lunar_results[0])

        # Compare lunar date (critical - must match)
        if day_data.lunar_date.day != expected["lunar_day"]:
            errors.append(f"Lunar day: expected {expected['lunar_day']}, got {day_data.lunar_date.day}")

        if day_data.lunar_date.month != expected["lunar_month"]:
            errors.append(f"Lunar month: expected {expected['lunar_month']}, got {day_data.lunar_date.month}")

        if day_data.lunar_date.year != expected["lunar_year"]:
            errors.append(f"Lunar year: expected {expected['lunar_year']}, got {day_data.lunar_date.year}")

        # Compare Day Can Chi (critical - must match)
        if day_data.can_chi.day.can != expected["day_can"]:
            errors.append(f"Day Can: expected {expected['day_can']}, got {day_data.can_chi.day.can}")

        if day_data.can_chi.day.chi != expected["day_chi"]:
            errors.append(f"Day Chi: expected {expected['day_chi']}, got {day_data.can_chi.day.chi}")

        # Compare Month Can Chi (may differ due to calculation method)
        # lunar-javascript uses Jie Qi method, while some sources use lunar month
        if day_data.can_chi.month.can != expected["month_can"]:
            msg = f"Month Can: expected {expected['month_can']}, got {day_data.can_chi.month.can}"
            if strict_month:
                errors.append(msg)
            else:
                warnings.append(msg + " (may differ due to Jie Qi calculation)")

        if day_data.can_chi.month.chi != expected["month_chi"]:
            msg = f"Month Chi: expected {expected['month_chi']}, got {day_data.can_chi.month.chi}"
            if strict_month:
                errors.append(msg)
            else:
                warnings.append(msg + " (may differ due to Jie Qi calculation)")

        # Compare Year Can Chi (critical - must match)
        if day_data.can_chi.year.can != expected["year_can"]:
            errors.append(f"Year Can: expected {expected['year_can']}, got {day_data.can_chi.year.can}")

        if day_data.can_chi.year.chi != expected["year_chi"]:
            errors.append(f"Year Chi: expected {expected['year_chi']}, got {day_data.can_chi.year.chi}")

        # Build actual dict for comparison
        actual = {
            "lunar_day": day_data.lunar_date.day,
            "lunar_month": day_data.lunar_date.month,
            "lunar_year": day_data.lunar_date.year,
            "day_can": day_data.can_chi.day.can,
            "day_chi": day_data.can_chi.day.chi,
            "month_can": day_data.can_chi.month.can,
            "month_chi": day_data.can_chi.month.chi,
            "year_can": day_data.can_chi.year.can,
            "year_chi": day_data.can_chi.year.chi,
            "tiet_khi": day_data.tiet_khi,
        }

        return LunarValidationResult(
            solar_date=day_data.solar_date,
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            expected=expected,
            actual=actual,
        )

    def validate_days(self, days: list[DayData]) -> list[LunarValidationResult]:
        """
        Validate nhiều ngày.

        Args:
            days: List of DayData

        Returns:
            List of LunarValidationResult
        """
        results = []
        for day in days:
            result = self.validate_day(day)
            results.append(result)
        return results

    def validate_batch(
        self,
        days: list[DayData],
        progress_callback: Optional[callable] = None,
        strict_month: bool = False,
    ) -> dict:
        """
        Validate batch và trả về summary.

        Args:
            days: List of DayData
            progress_callback: Callback (current, total)
            strict_month: If True, month Can Chi differences are errors

        Returns:
            Summary dict với stats và errors
        """
        results = []
        total = len(days)

        for i, day in enumerate(days):
            result = self.validate_day(day, strict_month=strict_month)
            results.append(result)

            if progress_callback:
                progress_callback(i + 1, total)

        # Build summary
        valid_count = sum(1 for r in results if r.is_valid)
        invalid_results = [r for r in results if not r.is_valid]
        warning_results = [r for r in results if r.warnings]

        return {
            "total": total,
            "valid": valid_count,
            "invalid": total - valid_count,
            "warnings_count": len(warning_results),
            "accuracy": valid_count / total * 100 if total > 0 else 0,
            "errors": [
                {
                    "date": r.solar_date.isoformat(),
                    "errors": r.errors,
                    "expected": r.expected,
                    "actual": r.actual,
                }
                for r in invalid_results
            ],
            "warnings": [
                {
                    "date": r.solar_date.isoformat(),
                    "warnings": r.warnings,
                }
                for r in warning_results
            ],
        }


def validate_scraped_data(days: list[DayData]) -> dict:
    """
    Convenience function để validate danh sách ngày.

    Args:
        days: List of DayData từ scraper

    Returns:
        Validation summary
    """
    validator = LunarValidator()
    return validator.validate_batch(days)
