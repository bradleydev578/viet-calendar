"""
Parser cho xemngay.com - nguồn phụ cho cross-validation.
Cung cấp thông tin 28 Sao chi tiết với ngũ hành và con vật.
"""
import re
import logging
from typing import Optional
from datetime import date
from bs4 import BeautifulSoup

from ..models.day_data import (
    XemNgayData,
    LunarDate,
    CanChi,
    CanChiInfo,
    Star28DetailedInfo,
    Truc12Info,
    DirectionInfo,
)

logger = logging.getLogger(__name__)


class XemNgayParser:
    """Parser HTML từ xemngay.com"""

    # 12 Trực với đánh giá tốt/xấu
    TRUC_12_RATING = {
        'Kiến': True, 'Trừ': True, 'Mãn': True, 'Bình': True,
        'Định': True, 'Chấp': True, 'Phá': False, 'Nguy': False,
        'Thành': True, 'Thu': True, 'Khai': True, 'Bế': False,
    }

    # 28 Sao với đánh giá
    STAR_28_RATING = {
        'Giác': True, 'Cang': False, 'Đê': False, 'Phòng': True,
        'Tâm': False, 'Vĩ': True, 'Cơ': True, 'Đẩu': True,
        'Ngưu': False, 'Nữ': False, 'Hư': False, 'Nguy': False,
        'Thất': True, 'Bích': True, 'Khuê': False, 'Lâu': True,
        'Vị': True, 'Mão': False, 'Tất': True, 'Chủy': False,
        'Sâm': False, 'Tỉnh': True, 'Quỷ': False, 'Liễu': False,
        'Tinh': False, 'Trương': True, 'Dực': False, 'Chẩn': True,
    }

    def parse(self, html: str, target_date: date) -> Optional[XemNgayData]:
        """
        Parse HTML và trả về XemNgayData.

        Args:
            html: HTML content từ xemngay.com
            target_date: Ngày đang parse

        Returns:
            XemNgayData object hoặc None nếu parse fail
        """
        try:
            soup = BeautifulSoup(html, 'lxml')

            # Parse từng phần
            lunar_date = self._parse_lunar_date(soup, target_date)
            can_chi = self._parse_can_chi(soup)
            star28 = self._parse_star28_detailed(soup)
            truc12 = self._parse_truc12(soup)
            directions = self._parse_directions(soup)
            good_activities = self._parse_activities(soup, 'good')
            bad_activities = self._parse_activities(soup, 'bad')

            return XemNgayData(
                solar_date=target_date,
                lunar_date=lunar_date,
                can_chi=can_chi,
                star28=star28,
                truc12=truc12,
                directions=directions,
                good_activities=good_activities,
                bad_activities=bad_activities,
                source="xemngay.com",
            )

        except Exception as e:
            logger.error(f"Error parsing xemngay.com for {target_date}: {e}")
            return None

    def _parse_lunar_date(self, soup: BeautifulSoup, target_date: date) -> Optional[LunarDate]:
        """
        Parse ngày âm lịch.
        Pattern: "Ngày âm lịch: 26/10/2025"
        """
        text = soup.get_text()

        # Pattern: "Ngày âm lịch: DD/MM/YYYY" hoặc "DD/MM âm lịch"
        patterns = [
            r'[Nn]gày\s+[Ââ]m\s+lịch[:\s]*(\d{1,2})[/-](\d{1,2})[/-]?(\d{4})?',
            r'(\d{1,2})[/-](\d{1,2})\s*[Ââ]m\s*lịch',
            r'[Ââ]m\s+lịch[:\s]*(\d{1,2})[/-](\d{1,2})',
        ]

        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                lunar_day = int(match.group(1))
                lunar_month = int(match.group(2))
                lunar_year = int(match.group(3)) if match.lastindex >= 3 and match.group(3) else target_date.year

                # Adjust year if lunar month is late and solar month is early
                if lunar_month > 10 and target_date.month < 3:
                    lunar_year = target_date.year - 1

                return LunarDate(
                    day=lunar_day,
                    month=lunar_month,
                    year=lunar_year,
                    is_leap_month=False,
                )

        return None

    def _parse_can_chi(self, soup: BeautifulSoup) -> Optional[CanChiInfo]:
        """
        Parse Can Chi ngày/tháng/năm.
        Pattern: "ngày: Mậu Ngọ, tháng: Đinh Hợi, năm: Ất Tỵ"
        """
        # Các thiên can và địa chi
        cans = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
        chis = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']
        can_pattern = '|'.join(cans)
        chi_pattern = '|'.join(chis)

        text = soup.get_text()

        def normalize_chi(chi: str) -> str:
            """Normalize chi - Tị -> Tỵ"""
            return 'Tỵ' if chi == 'Tị' else chi

        day_can, day_chi = None, None
        month_can, month_chi = None, None
        year_can, year_chi = None, None

        # Parse ngày - "ngày: Mậu Ngọ" hoặc "Ngày Mậu Ngọ"
        day_match = re.search(rf'[Nn]gày[:\s]*\*?\*?({can_pattern})\*?\*?\s*\*?\*?({chi_pattern})\*?\*?', text)
        if day_match:
            day_can = day_match.group(1)
            day_chi = normalize_chi(day_match.group(2))

        # Parse tháng - "tháng: Đinh Hợi"
        month_match = re.search(rf'[Tt]háng[:\s]*\*?\*?({can_pattern})\*?\*?\s*\*?\*?({chi_pattern})\*?\*?', text)
        if month_match:
            month_can = month_match.group(1)
            month_chi = normalize_chi(month_match.group(2))

        # Parse năm - "năm: Ất Tỵ"
        year_match = re.search(rf'[Nn]ăm[:\s]*\*?\*?({can_pattern})\*?\*?\s*\*?\*?({chi_pattern})\*?\*?', text)
        if year_match:
            year_can = year_match.group(1)
            year_chi = normalize_chi(year_match.group(2))

        if not (day_can and day_chi):
            return None

        # Xác định ngũ hành của ngày
        can_ngu_hanh = {
            'Giáp': 'Mộc', 'Ất': 'Mộc',
            'Bính': 'Hỏa', 'Đinh': 'Hỏa',
            'Mậu': 'Thổ', 'Kỷ': 'Thổ',
            'Canh': 'Kim', 'Tân': 'Kim',
            'Nhâm': 'Thủy', 'Quý': 'Thủy',
        }

        return CanChiInfo(
            year=CanChi(can=year_can or 'Giáp', chi=year_chi or 'Tý'),
            month=CanChi(can=month_can or 'Giáp', chi=month_chi or 'Tý'),
            day=CanChi(can=day_can, chi=day_chi),
            ngu_hanh=can_ngu_hanh.get(day_can, 'Mộc'),
        )

    def _parse_star28_detailed(self, soup: BeautifulSoup) -> Optional[Star28DetailedInfo]:
        """
        Parse 28 Sao với chi tiết ngũ hành và con vật.
        Pattern: "Sao: Tâm (Thuộc hành: Hoả, Con vật: Hồ)"
        """
        text = soup.get_text()

        # Primary pattern with element and animal
        # Pattern: "Sao: [Name] (Thuộc hành: [Element], Con vật: [Animal])"
        full_pattern = r'[Ss]ao[:\s]*\[?([A-Za-zÀ-ỹ]+)\]?\s*\([Tt]huộc\s*hành[:\s]*\*?\*?([A-Za-zÀ-ỹ]+)\*?\*?\s*,\s*[Cc]on\s*vật[:\s]*\*?\*?([A-Za-zÀ-ỹ\s]+?)\*?\*?\)'
        match = re.search(full_pattern, text)

        if match:
            name = match.group(1).strip()
            element = match.group(2).strip()
            animal = match.group(3).strip()

            return Star28DetailedInfo(
                name=name,
                element=element,
                animal=animal,
                is_good=self.STAR_28_RATING.get(name, True),
            )

        # Fallback: simpler patterns
        # Pattern 2: "Sao Tâm thuộc hành Hoả"
        alt_pattern = r'[Ss]ao\s*\[?([A-Za-zÀ-ỹ]+)\]?\s*thuộc\s*hành\s*([A-Za-zÀ-ỹ]+)'
        match2 = re.search(alt_pattern, text)
        if match2:
            name = match2.group(1).strip()
            element = match2.group(2).strip()
            return Star28DetailedInfo(
                name=name,
                element=element,
                is_good=self.STAR_28_RATING.get(name, True),
            )

        # Fallback: just star name
        # Pattern 3: "Sao: Tâm" or "Sao [Tâm]"
        simple_pattern = r'[Ss]ao[:\s]*\[?([A-Za-zÀ-ỹ]+)\]?'
        match3 = re.search(simple_pattern, text)
        if match3:
            name = match3.group(1).strip()
            # Filter out non-star words
            if name in self.STAR_28_RATING:
                return Star28DetailedInfo(
                    name=name,
                    is_good=self.STAR_28_RATING.get(name, True),
                )

        return None

    def _parse_truc12(self, soup: BeautifulSoup) -> Optional[Truc12Info]:
        """
        Parse 12 Trực.
        Pattern: "Trực: [Phá]" or "Trực: Phá"
        """
        text = soup.get_text()

        truc_names = list(self.TRUC_12_RATING.keys())
        # Pattern: "Trực: [Name]" or "Trực: Name"
        pattern = r'[Tt]rực[:\s]*\[?(' + '|'.join(truc_names) + r')\]?'

        match = re.search(pattern, text)
        if match:
            name = match.group(1).strip()
            return Truc12Info(
                name=name,
                is_good=self.TRUC_12_RATING.get(name, True),
            )

        return None

    def _parse_directions(self, soup: BeautifulSoup) -> list[DirectionInfo]:
        """
        Parse hướng xuất hành.
        Pattern: "Hướng tài lộc: [Bắc] | Nhân duyên: [Đông Nam] | Hướng bất lợi: [Đông]"
        """
        directions = []
        text = soup.get_text()

        # Valid direction names
        valid_directions = [
            'Chính Đông', 'Chính Tây', 'Chính Nam', 'Chính Bắc',
            'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam',
            'Đông', 'Tây', 'Nam', 'Bắc',
        ]
        direction_regex = '|'.join(re.escape(d) for d in valid_directions)

        # Patterns for different direction types from xemngay.com
        direction_patterns = [
            (rf'[Hh]ướng\s+tài\s+lộc[:\s]*\[?({direction_regex})\]?', 'Tài lộc', 5),
            (rf'[Tt]ài\s+lộc[:\s]*\[?({direction_regex})\]?', 'Tài lộc', 5),
            (rf'[Hh]ỷ\s+thần[:\s]*\[?({direction_regex})\]?', 'Hỷ thần', 5),
            (rf'[Nn]hân\s+duyên[:\s]*\[?({direction_regex})\]?', 'Nhân duyên', 4),
            (rf'[Hh]ướng\s+bất\s+lợi[:\s]*\[?({direction_regex})\]?', 'Bất lợi', 1),
            (rf'[Bb]ất\s+lợi[:\s]*\[?({direction_regex})\]?', 'Bất lợi', 1),
        ]

        seen_names = set()
        for pattern, name, rating in direction_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match and name not in seen_names:
                direction_text = match.group(1).strip()
                if direction_text:
                    directions.append(DirectionInfo(
                        name=name,
                        direction=direction_text,
                        rating=rating,
                    ))
                    seen_names.add(name)

        return directions

    def _parse_activities(self, soup: BeautifulSoup, activity_type: str) -> list[str]:
        """
        Parse việc nên làm / không nên làm.
        Returns list of activity strings (simplified format for xemngay).
        """
        activities = []
        text = soup.get_text()

        if activity_type == 'good':
            # Patterns for good activities
            patterns = [
                r'[Nn]ên\s+làm[:\s]*(.+?)(?=[Kk]hông\s+nên|[Kk]iêng|[Tt]ránh|$)',
                r'[Cc]ó\s+thể[:\s]*(.+?)(?=[Kk]hông\s+nên|[Kk]iêng|[Tt]ránh|$)',
                r'[Tt]hích\s+hợp[:\s]*(.+?)(?=[Kk]hông\s+nên|[Kk]iêng|[Tt]ránh|$)',
            ]
        else:
            # Patterns for bad activities
            patterns = [
                r'[Kk]hông\s+nên[:\s]*(.+?)(?=[Nn]ên\s+làm|[Cc]ó\s+thể|$)',
                r'[Kk]iêng[:\s]*(.+?)(?=[Nn]ên\s+làm|[Cc]ó\s+thể|$)',
                r'[Tt]ránh[:\s]*(.+?)(?=[Nn]ên\s+làm|[Cc]ó\s+thể|$)',
            ]

        for pattern in patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                activities_text = match.group(1).strip()
                # Clean up and limit length
                activities_text = re.sub(r'\s+', ' ', activities_text)
                # Split by comma if multiple activities
                items = [item.strip() for item in activities_text.split(',')]
                for item in items:
                    # Filter valid items
                    if item and 2 < len(item) < 200:
                        # Remove parenthetical notes for cleaner data
                        clean_item = re.sub(r'\s*\([^)]*\)\s*', ' ', item).strip()
                        if clean_item:
                            activities.append(clean_item)
                break  # Use first matching pattern

        return activities[:20]  # Limit to 20 activities
