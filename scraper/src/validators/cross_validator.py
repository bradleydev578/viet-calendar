"""
Cross-validator để so sánh data giữa nhiều nguồn:
- lichngaytot.com (primary scrape)
- xemngay.com (secondary scrape)
- lunar-javascript (calculated reference)
"""
import logging
from dataclasses import dataclass, field
from datetime import date
from typing import Optional

from ..models.day_data import DayData, XemNgayData

logger = logging.getLogger(__name__)


@dataclass
class DiscrepancyItem:
    """Một discrepancy giữa các nguồn."""
    field: str
    source1_value: str
    source2_value: str
    severity: str  # 'critical', 'warning', 'info'
    notes: Optional[str] = None


@dataclass
class CrossValidationResult:
    """Kết quả cross-validation cho một ngày."""
    solar_date: date
    source1: str
    source2: str
    is_consistent: bool
    discrepancies: list[DiscrepancyItem] = field(default_factory=list)

    @property
    def critical_count(self) -> int:
        return sum(1 for d in self.discrepancies if d.severity == 'critical')

    @property
    def warning_count(self) -> int:
        return sum(1 for d in self.discrepancies if d.severity == 'warning')

    @property
    def info_count(self) -> int:
        return sum(1 for d in self.discrepancies if d.severity == 'info')


class CrossValidator:
    """Cross-validate data giữa nhiều nguồn."""

    # Fields và severity levels
    FIELD_SEVERITY = {
        'lunar_day': 'critical',
        'lunar_month': 'critical',
        'day_can_chi': 'critical',
        'year_can_chi': 'critical',
        'month_can_chi': 'warning',  # May differ due to Jie Qi calculation
        'star28_name': 'warning',
        'truc12_name': 'warning',
        'direction': 'info',
    }

    def validate(
        self,
        lichngaytot_data: DayData,
        xemngay_data: Optional[XemNgayData] = None,
        calculated_data: Optional[dict] = None,
    ) -> CrossValidationResult:
        """
        So sánh data từ lichngaytot với xemngay và/hoặc calculated reference.

        Args:
            lichngaytot_data: Data từ nguồn chính
            xemngay_data: Data từ nguồn phụ (có thể None)
            calculated_data: Data từ lunar-javascript (optional)

        Returns:
            CrossValidationResult với list discrepancies
        """
        discrepancies = []

        if xemngay_data:
            discrepancies.extend(
                self._compare_with_xemngay(lichngaytot_data, xemngay_data)
            )

        if calculated_data:
            discrepancies.extend(
                self._compare_with_calculated(lichngaytot_data, calculated_data)
            )

        # Determine overall consistency (no critical errors)
        has_critical = any(d.severity == 'critical' for d in discrepancies)

        return CrossValidationResult(
            solar_date=lichngaytot_data.solar_date,
            source1="lichngaytot.com",
            source2="xemngay.com" if xemngay_data else "lunar-javascript",
            is_consistent=not has_critical,
            discrepancies=discrepancies,
        )

    def _compare_with_xemngay(
        self,
        primary: DayData,
        secondary: XemNgayData,
    ) -> list[DiscrepancyItem]:
        """So sánh lichngaytot data với xemngay data."""
        items = []

        # Compare lunar date
        if secondary.lunar_date:
            if primary.lunar_date.day != secondary.lunar_date.day:
                items.append(DiscrepancyItem(
                    field='lunar_day',
                    source1_value=str(primary.lunar_date.day),
                    source2_value=str(secondary.lunar_date.day),
                    severity='critical',
                    notes='Lunar day mismatch between sources',
                ))

            if primary.lunar_date.month != secondary.lunar_date.month:
                items.append(DiscrepancyItem(
                    field='lunar_month',
                    source1_value=str(primary.lunar_date.month),
                    source2_value=str(secondary.lunar_date.month),
                    severity='critical',
                    notes='Lunar month mismatch between sources',
                ))

        # Compare Can Chi
        if secondary.can_chi:
            primary_day_cc = f"{primary.can_chi.day.can} {primary.can_chi.day.chi}"
            secondary_day_cc = f"{secondary.can_chi.day.can} {secondary.can_chi.day.chi}"

            if not self._compare_can_chi(primary_day_cc, secondary_day_cc):
                items.append(DiscrepancyItem(
                    field='day_can_chi',
                    source1_value=primary_day_cc,
                    source2_value=secondary_day_cc,
                    severity='critical',
                    notes='Day Can Chi mismatch',
                ))

            primary_year_cc = f"{primary.can_chi.year.can} {primary.can_chi.year.chi}"
            secondary_year_cc = f"{secondary.can_chi.year.can} {secondary.can_chi.year.chi}"

            if not self._compare_can_chi(primary_year_cc, secondary_year_cc):
                items.append(DiscrepancyItem(
                    field='year_can_chi',
                    source1_value=primary_year_cc,
                    source2_value=secondary_year_cc,
                    severity='critical',
                    notes='Year Can Chi mismatch',
                ))

        # Compare 28 Sao
        if secondary.star28 and primary.star28:
            if not self._compare_star_name(primary.star28.name, secondary.star28.name):
                items.append(DiscrepancyItem(
                    field='star28_name',
                    source1_value=primary.star28.name,
                    source2_value=secondary.star28.name,
                    severity='warning',
                    notes='28 Sao name differs between sources',
                ))

        # Compare 12 Trực
        if secondary.truc12 and primary.truc12:
            if not self._compare_truc_name(primary.truc12.name, secondary.truc12.name):
                items.append(DiscrepancyItem(
                    field='truc12_name',
                    source1_value=primary.truc12.name,
                    source2_value=secondary.truc12.name,
                    severity='warning',
                    notes='12 Trực name differs between sources',
                ))

        return items

    def _compare_with_calculated(
        self,
        primary: DayData,
        calculated: dict,
    ) -> list[DiscrepancyItem]:
        """So sánh lichngaytot data với lunar-javascript calculated data."""
        items = []

        # Compare lunar day
        calc_lunar_day = calculated.get('lunar_day')
        if calc_lunar_day is not None and primary.lunar_date.day != calc_lunar_day:
            items.append(DiscrepancyItem(
                field='lunar_day',
                source1_value=str(primary.lunar_date.day),
                source2_value=str(calc_lunar_day),
                severity='critical',
                notes='Lunar day differs from calculated',
            ))

        # Compare lunar month
        calc_lunar_month = calculated.get('lunar_month')
        if calc_lunar_month is not None and primary.lunar_date.month != calc_lunar_month:
            items.append(DiscrepancyItem(
                field='lunar_month',
                source1_value=str(primary.lunar_date.month),
                source2_value=str(calc_lunar_month),
                severity='critical',
                notes='Lunar month differs from calculated',
            ))

        # Compare Can Chi (Vietnamese vs Chinese characters need mapping)
        calc_day_cc = calculated.get('day_gan_zhi_vn')  # Vietnamese version
        if calc_day_cc:
            primary_day_cc = f"{primary.can_chi.day.can} {primary.can_chi.day.chi}"
            if not self._compare_can_chi(primary_day_cc, calc_day_cc):
                items.append(DiscrepancyItem(
                    field='day_can_chi',
                    source1_value=primary_day_cc,
                    source2_value=calc_day_cc,
                    severity='critical',
                    notes='Day Can Chi differs from calculated',
                ))

        return items

    def _compare_can_chi(self, val1: str, val2: str) -> bool:
        """Compare Can Chi với normalization."""
        if not val1 or not val2:
            return True  # Skip if missing

        # Normalize: remove spaces, lowercase, handle Tỵ/Tị variation
        def normalize(s: str) -> str:
            s = s.lower().replace(' ', '')
            s = s.replace('tị', 'tỵ')
            return s

        return normalize(val1) == normalize(val2)

    def _compare_star_name(self, name1: str, name2: str) -> bool:
        """Compare 28 Sao names."""
        if not name1 or not name2:
            return True
        return name1.lower().strip() == name2.lower().strip()

    def _compare_truc_name(self, name1: str, name2: str) -> bool:
        """Compare 12 Trực names."""
        if not name1 or not name2:
            return True
        return name1.lower().strip() == name2.lower().strip()

    def validate_batch(
        self,
        primary_days: list[DayData],
        secondary_days: dict[date, XemNgayData],
        calculated_days: Optional[dict[date, dict]] = None,
    ) -> dict:
        """
        Validate batch của nhiều ngày và trả về summary.

        Returns:
            {
                'total': int,
                'consistent': int,
                'inconsistent': int,
                'critical_errors': [...],
                'warnings': [...],
            }
        """
        results = []
        calculated_days = calculated_days or {}

        for day in primary_days:
            secondary = secondary_days.get(day.solar_date)
            calculated = calculated_days.get(day.solar_date)
            result = self.validate(day, secondary, calculated)
            results.append(result)

        # Build summary
        critical_errors = []
        warnings = []

        for r in results:
            if r.critical_count > 0:
                critical_errors.append({
                    'date': r.solar_date.isoformat(),
                    'discrepancies': [
                        {
                            'field': d.field,
                            'source1': d.source1_value,
                            'source2': d.source2_value,
                            'notes': d.notes,
                        }
                        for d in r.discrepancies if d.severity == 'critical'
                    ]
                })
            elif r.warning_count > 0:
                warnings.append({
                    'date': r.solar_date.isoformat(),
                    'discrepancies': [
                        {
                            'field': d.field,
                            'source1': d.source1_value,
                            'source2': d.source2_value,
                            'notes': d.notes,
                        }
                        for d in r.discrepancies if d.severity == 'warning'
                    ]
                })

        return {
            'total': len(results),
            'consistent': sum(1 for r in results if r.is_consistent),
            'inconsistent': sum(1 for r in results if not r.is_consistent),
            'critical_count': len(critical_errors),
            'warning_count': len(warnings),
            'critical_errors': critical_errors,
            'warnings': warnings[:10],  # Limit to first 10 warnings
        }

    def print_summary(self, summary: dict) -> None:
        """Print validation summary to console."""
        print("\n" + "=" * 50)
        print("CROSS-VALIDATION SUMMARY")
        print("=" * 50)
        print(f"Total days: {summary['total']}")
        print(f"Consistent: {summary['consistent']}")
        print(f"Inconsistent: {summary['inconsistent']}")
        print(f"Critical errors: {summary['critical_count']}")
        print(f"Warnings: {summary['warning_count']}")

        if summary['critical_errors']:
            print("\nCRITICAL ERRORS:")
            for error in summary['critical_errors'][:5]:  # Show first 5
                print(f"  {error['date']}:")
                for d in error['discrepancies']:
                    print(f"    - {d['field']}: {d['source1']} vs {d['source2']}")

        print("=" * 50)
