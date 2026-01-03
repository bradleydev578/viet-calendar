"""
Data merger để kết hợp data từ nhiều nguồn với priority rules.

Priority:
1. lunar-javascript (calculated) - cho lunar date, can chi
2. lichngaytot.com (primary) - cho activities, stars, directions
3. xemngay.com (secondary) - cho 28 sao details (element, animal)
"""
import logging
from datetime import date, datetime
from typing import Optional

from ..models.day_data import (
    DayData,
    XemNgayData,
    LunarDate,
    CanChi,
    CanChiInfo,
    Star28Info,
    Truc12Info,
)

logger = logging.getLogger(__name__)


class DataMerger:
    """Merge data từ nhiều nguồn với priority rules."""

    def merge(
        self,
        lichngaytot_data: DayData,
        xemngay_data: Optional[XemNgayData] = None,
        calculated_data: Optional[dict] = None,
    ) -> DayData:
        """
        Merge data từ 3 nguồn thành final DayData.

        Priority:
        1. calculated_data (lunar-javascript) cho core lunar info
        2. lichngaytot_data cho feng shui activities và details
        3. xemngay_data cho 28 Sao element/animal only

        Args:
            lichngaytot_data: Data từ nguồn chính
            xemngay_data: Data từ nguồn phụ (có thể None)
            calculated_data: Data từ lunar-javascript (optional)

        Returns:
            Merged DayData với best available data từ tất cả sources
        """
        calculated_data = calculated_data or {}

        # Start with lichngaytot as base (deep copy)
        merged = lichngaytot_data.model_copy(deep=True)

        # Override lunar date with calculated (most reliable)
        if calculated_data:
            merged.lunar_date = self._merge_lunar_date(
                lichngaytot_data.lunar_date,
                calculated_data,
            )

            # Override Can Chi with calculated
            merged.can_chi = self._merge_can_chi(
                lichngaytot_data.can_chi,
                calculated_data,
            )

            # Override Tiet khi from calculated if available
            calc_tiet_khi = calculated_data.get('tiet_khi')
            if calc_tiet_khi:
                merged.tiet_khi = calc_tiet_khi

            # Override Truc with calculated if available
            merged.truc12 = self._merge_truc12(
                lichngaytot_data.truc12,
                calculated_data,
            )

        # Merge 28 Sao (add element/animal from xemngay if available)
        merged.star28 = self._merge_star28(
            lichngaytot_data.star28,
            xemngay_data,
            calculated_data,
        )

        # Update metadata
        sources = ["lichngaytot.com"]
        if xemngay_data:
            sources.append("xemngay.com")
        if calculated_data:
            sources.append("lunar-javascript")

        merged.source = ",".join(sources)
        merged.scraped_at = datetime.now().isoformat()

        return merged

    def _merge_lunar_date(
        self,
        scraped: LunarDate,
        calculated: dict,
    ) -> LunarDate:
        """Merge lunar date, ưu tiên calculated."""
        return LunarDate(
            day=calculated.get('lunar_day', scraped.day),
            month=calculated.get('lunar_month', scraped.month),
            year=calculated.get('lunar_year', scraped.year),
            is_leap_month=calculated.get('is_leap_month', scraped.is_leap_month),
        )

    def _merge_can_chi(
        self,
        scraped: CanChiInfo,
        calculated: dict,
    ) -> CanChiInfo:
        """
        Merge Can Chi, ưu tiên calculated cho day/year.

        Note: lunar-javascript trả về Hán tự (甲乙丙...), cần convert sang tiếng Việt.
        """
        # Mapping Hán tự -> tiếng Việt cho Thiên Can
        can_map = {
            '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
            '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
        }

        # Mapping Hán tự -> tiếng Việt cho Địa Chi
        chi_map = {
            '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
            '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
        }

        def convert_gan_zhi(gan_zhi: str) -> tuple[str, str]:
            """Convert Hán tự GanZhi sang tiếng Việt."""
            if not gan_zhi or len(gan_zhi) < 2:
                return None, None

            # Nếu đã là tiếng Việt
            if gan_zhi[0] in ['G', 'Ấ', 'B', 'Đ', 'M', 'K', 'C', 'T', 'N', 'Q']:
                parts = gan_zhi.split()
                if len(parts) == 2:
                    return parts[0], parts[1]
                return None, None

            # Convert từ Hán tự
            can = can_map.get(gan_zhi[0])
            chi = chi_map.get(gan_zhi[1])
            return can, chi

        # Get calculated Can Chi
        day_gan_zhi = calculated.get('day_gan_zhi', '')
        month_gan_zhi = calculated.get('month_gan_zhi', '')
        year_gan_zhi = calculated.get('year_gan_zhi', '')

        day_can, day_chi = convert_gan_zhi(day_gan_zhi)
        month_can, month_chi = convert_gan_zhi(month_gan_zhi)
        year_can, year_chi = convert_gan_zhi(year_gan_zhi)

        return CanChiInfo(
            day=CanChi(
                can=day_can or scraped.day.can,
                chi=day_chi or scraped.day.chi,
            ),
            month=CanChi(
                can=month_can or scraped.month.can,
                chi=month_chi or scraped.month.chi,
            ),
            year=CanChi(
                can=year_can or scraped.year.can,
                chi=year_chi or scraped.year.chi,
            ),
            ngu_hanh=scraped.ngu_hanh,
        )

    def _merge_star28(
        self,
        lichngaytot_star: Optional[Star28Info],
        xemngay_data: Optional[XemNgayData],
        calculated: dict,
    ) -> Optional[Star28Info]:
        """
        Merge 28 Sao information.
        - Name: prefer calculated, then lichngaytot
        - Element/Animal: from xemngay (unique data) - stored in meaning field
        """
        if not lichngaytot_star:
            return None

        # Get element and animal from xemngay
        element = None
        animal = None
        if xemngay_data and xemngay_data.star28:
            element = xemngay_data.star28.element
            animal = xemngay_data.star28.animal

        # Build meaning with element/animal info
        meaning_parts = []
        if element:
            meaning_parts.append(f"Hành: {element}")
        if animal:
            meaning_parts.append(f"Con vật: {animal}")

        meaning = ", ".join(meaning_parts) if meaning_parts else lichngaytot_star.meaning

        # Determine name (prefer calculated if available)
        calc_star = calculated.get('star_28')
        name = calc_star if calc_star else lichngaytot_star.name

        return Star28Info(
            name=name,
            is_good=lichngaytot_star.is_good,
            meaning=meaning,
        )

    def _merge_truc12(
        self,
        scraped: Optional[Truc12Info],
        calculated: dict,
    ) -> Optional[Truc12Info]:
        """Merge 12 Trực, ưu tiên calculated."""
        calc_truc = calculated.get('truc_12')

        if calc_truc and scraped:
            return Truc12Info(
                name=calc_truc,
                is_good=scraped.is_good,
                meaning=scraped.meaning,
            )

        return scraped

    def merge_batch(
        self,
        lichngaytot_days: list[DayData],
        xemngay_days: Optional[dict[date, XemNgayData]] = None,
        calculated_days: Optional[dict[date, dict]] = None,
    ) -> list[DayData]:
        """
        Merge batch của nhiều ngày.

        Args:
            lichngaytot_days: List DayData từ lichngaytot
            xemngay_days: Dict mapping date -> XemNgayData
            calculated_days: Dict mapping date -> calculated data dict

        Returns:
            List merged DayData
        """
        xemngay_days = xemngay_days or {}
        calculated_days = calculated_days or {}

        merged = []
        for day in lichngaytot_days:
            xemngay = xemngay_days.get(day.solar_date)
            calculated = calculated_days.get(day.solar_date)

            merged_day = self.merge(day, xemngay, calculated)
            merged.append(merged_day)

            logger.debug(f"Merged data for {day.solar_date}")

        logger.info(f"Merged {len(merged)} days")
        return merged


def merge_day_data(
    lichngaytot_data: DayData,
    xemngay_data: Optional[XemNgayData] = None,
    calculated_data: Optional[dict] = None,
) -> DayData:
    """
    Convenience function để merge data cho một ngày.

    Args:
        lichngaytot_data: Data từ nguồn chính
        xemngay_data: Data từ nguồn phụ
        calculated_data: Data từ lunar-javascript

    Returns:
        Merged DayData
    """
    merger = DataMerger()
    return merger.merge(lichngaytot_data, xemngay_data, calculated_data)
