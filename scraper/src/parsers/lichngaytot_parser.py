"""
Parser cho lichngaytot.com
"""
import re
import logging
from typing import Optional
from datetime import date
from bs4 import BeautifulSoup

from ..models.day_data import (
    DayData,
    LunarDate,
    CanChi,
    CanChiInfo,
    HourInfo,
    Star28Info,
    Truc12Info,
    DirectionInfo,
    ActivityInfo,
    LyThuanPhongHour,
    ConflictingAge,
)

logger = logging.getLogger(__name__)


class LichNgayTotParser:
    """Parser HTML từ lichngaytot.com"""

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

    def parse(self, html: str, target_date: date) -> Optional[DayData]:
        """
        Parse HTML và trả về DayData.

        Args:
            html: HTML content từ lichngaytot.com
            target_date: Ngày đang parse

        Returns:
            DayData object hoặc None nếu parse fail
        """
        try:
            soup = BeautifulSoup(html, 'lxml')

            # Parse từng phần
            lunar_date = self._parse_lunar_date(soup, target_date)
            can_chi = self._parse_can_chi(soup)
            tiet_khi = self._parse_tiet_khi(soup)
            star28 = self._parse_star28(soup)
            truc12 = self._parse_truc12(soup)
            hoang_dao_hours = self._parse_hoang_dao_hours(soup)
            directions = self._parse_directions(soup)
            good_activities = self._parse_activities(soup, 'good')
            bad_activities = self._parse_activities(soup, 'bad')
            good_stars, bad_stars = self._parse_stars(soup)
            ly_thuan_phong_hours = self._parse_ly_thuan_phong_hours(soup)
            conflicting_ages = self._parse_conflicting_ages(soup)

            return DayData(
                solar_date=target_date,
                lunar_date=lunar_date,
                can_chi=can_chi,
                tiet_khi=tiet_khi,
                star28=star28,
                truc12=truc12,
                hoang_dao_hours=hoang_dao_hours,
                directions=directions,
                good_activities=good_activities,
                bad_activities=bad_activities,
                good_stars=good_stars,
                bad_stars=bad_stars,
                ly_thuan_phong_hours=ly_thuan_phong_hours,
                conflicting_ages=conflicting_ages,
                source="lichngaytot.com",
            )

        except Exception as e:
            logger.error(f"Error parsing {target_date}: {e}")
            return None

    # Mapping tên tháng âm lịch sang số
    LUNAR_MONTH_MAP = {
        'giêng': 1, 'một': 1, 'nhất': 1,
        'hai': 2, 'nhị': 2,
        'ba': 3, 'tam': 3,
        'tư': 4, 'bốn': 4,
        'năm': 5,
        'sáu': 6,
        'bảy': 7, 'bẩy': 7,
        'tám': 8,
        'chín': 9,
        'mười': 10,
        'mười một': 11,
        'mười hai': 12, 'chạp': 12,
    }

    def _parse_lunar_date(self, soup: BeautifulSoup, target_date: date) -> LunarDate:
        """Parse ngày âm lịch."""
        lunar_day = 1
        lunar_month = 1
        is_leap = False

        # Method 1: Tìm trong title - "Lịch âm DD-MM-YYYY"
        title = soup.find('title')
        if title:
            title_text = title.get_text()
            # Pattern: "Lịch âm 22-10-2025" hoặc "Lịch âm 22/10/2025"
            match = re.search(r'[Ll]ịch\s+[Ââ]m\s+(\d{1,2})[-/](\d{1,2})[-/](\d{4})', title_text)
            if match:
                lunar_day = int(match.group(1))
                lunar_month = int(match.group(2))

        # Method 2: Tìm span.ngay-am cho ngày
        ngay_am = soup.find('span', class_='ngay-am')
        if ngay_am:
            try:
                lunar_day = int(ngay_am.get_text().strip())
            except ValueError:
                pass

        # Method 3: Tìm tháng từ div.calendar-info2 - "THÁNG MƯỜI"
        calendar_info2 = soup.find('div', class_='calendar-info2')
        if calendar_info2:
            info_text = calendar_info2.get_text().lower()
            # Tìm tháng
            for month_name, month_num in self.LUNAR_MONTH_MAP.items():
                if f'tháng {month_name}' in info_text:
                    lunar_month = month_num
                    break

        # Method 4: Fallback - tìm trong text
        if lunar_day == 1 and lunar_month == 1:
            text = soup.get_text()
            patterns = [
                r'[Ll]ịch\s+[Ââ]m\s+(\d{1,2})[-/](\d{1,2})',
                r'(\d{1,2})[-/](\d{1,2})\s*[Ââ]m',
                r'[Nn]gày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+[Ââ]m',
            ]
            for pattern in patterns:
                match = re.search(pattern, text)
                if match:
                    lunar_day = int(match.group(1))
                    lunar_month = int(match.group(2))
                    break

        # Check tháng nhuận
        text = soup.get_text()
        if re.search(r'tháng\s+nhuận|nhuận', text, re.I):
            is_leap = True

        # Năm âm lịch (có thể khác năm dương nếu trước Tết)
        lunar_year = target_date.year
        if lunar_month > 10 and target_date.month < 3:
            lunar_year = target_date.year - 1

        return LunarDate(
            day=lunar_day,
            month=lunar_month,
            year=lunar_year,
            is_leap_month=is_leap,
        )

    def _parse_can_chi(self, soup: BeautifulSoup) -> CanChiInfo:
        """Parse Can Chi ngày/tháng/năm."""
        # Các thiên can và địa chi (bao gồm cả biến thể Unicode)
        cans = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
        # Thêm cả 2 biến thể: Tỵ và Tị
        chis = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']
        can_pattern = '|'.join(cans)
        chi_pattern = '|'.join(chis)

        day_can, day_chi = 'Giáp', 'Tý'
        month_can, month_chi = 'Giáp', 'Tý'
        year_can, year_chi = 'Giáp', 'Thìn'

        def normalize_chi(chi: str) -> str:
            """Normalize chi - Tị -> Tỵ"""
            return 'Tỵ' if chi == 'Tị' else chi

        # Method 1: Tìm trong calendar-box2 - chứa "Năm Ất Tị", "Tháng Đinh Hợi", "Ngày Giáp Dần"
        calendar_box2 = soup.find('div', class_='calendar-box2')
        if calendar_box2:
            box_text = calendar_box2.get_text()

            # Parse năm - "Năm Ất Tị" hoặc "Năm Ất Tỵ"
            year_match = re.search(rf'[Nn]ăm\s*({can_pattern})\s*({chi_pattern})', box_text)
            if year_match:
                year_can = year_match.group(1)
                year_chi = normalize_chi(year_match.group(2))

            # Parse tháng - "Tháng Đinh Hợi"
            month_match = re.search(rf'[Tt]háng\s*({can_pattern})\s*({chi_pattern})', box_text)
            if month_match:
                month_can = month_match.group(1)
                month_chi = normalize_chi(month_match.group(2))

            # Parse ngày - "Ngày Giáp Dần"
            day_match = re.search(rf'[Nn]gày\s*({can_pattern})\s*({chi_pattern})', box_text)
            if day_match:
                day_can = day_match.group(1)
                day_chi = normalize_chi(day_match.group(2))

        # Method 2: Fallback - tìm trong toàn bộ text
        if day_can == 'Giáp' and day_chi == 'Tý':
            text = soup.get_text()

            day_match = re.search(rf'[Nn]gày[:\s]*({can_pattern})\s*({chi_pattern})', text)
            if day_match:
                day_can = day_match.group(1)
                day_chi = day_match.group(2)

            month_match = re.search(rf'[Tt]háng[:\s]*({can_pattern})\s*({chi_pattern})', text)
            if month_match:
                month_can = month_match.group(1)
                month_chi = month_match.group(2)

            year_match = re.search(rf'[Nn]ăm[:\s]*({can_pattern})\s*({chi_pattern})', text)
            if year_match:
                year_can = year_match.group(1)
                year_chi = year_match.group(2)

        # Xác định ngũ hành của ngày
        can_ngu_hanh = {
            'Giáp': 'Mộc', 'Ất': 'Mộc',
            'Bính': 'Hỏa', 'Đinh': 'Hỏa',
            'Mậu': 'Thổ', 'Kỷ': 'Thổ',
            'Canh': 'Kim', 'Tân': 'Kim',
            'Nhâm': 'Thủy', 'Quý': 'Thủy',
        }

        return CanChiInfo(
            year=CanChi(can=year_can, chi=year_chi),
            month=CanChi(can=month_can, chi=month_chi),
            day=CanChi(can=day_can, chi=day_chi),
            ngu_hanh=can_ngu_hanh.get(day_can, 'Mộc'),
        )

    def _parse_tiet_khi(self, soup: BeautifulSoup) -> Optional[str]:
        """Parse tiết khí."""
        tiet_khi_list = [
            'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy',
            'Kinh trập', 'Xuân phân', 'Thanh minh', 'Cốc vũ',
            'Lập hạ', 'Tiểu mãn', 'Mang chủng', 'Hạ chí',
            'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử',
            'Bạch lộ', 'Thu phân', 'Hàn lộ', 'Sương giáng',
            'Lập đông', 'Tiểu tuyết', 'Đại tuyết', 'Đông chí',
        ]

        # Method 1: Tìm trực tiếp tên tiết khí trong text (ưu tiên nhất vì chính xác)
        text = soup.get_text()
        for tk in tiet_khi_list:
            # Tìm với word boundary hoặc sau "Tiết khí:"
            if re.search(rf'[Tt]iết\s+khí[:\s]*{re.escape(tk)}', text, re.IGNORECASE):
                return tk

        # Method 2: Tìm trong calendar-box2 với list match
        calendar_box2 = soup.find('div', class_='calendar-box2')
        if calendar_box2:
            box_text = calendar_box2.get_text().lower()
            for tk in tiet_khi_list:
                if tk.lower() in box_text:
                    return tk

        # Method 3: Fallback - tìm tên tiết khí ở bất kỳ đâu
        text_lower = text.lower()
        for tk in tiet_khi_list:
            if tk.lower() in text_lower:
                return tk

        return None

    def _parse_star28(self, soup: BeautifulSoup) -> Optional[Star28Info]:
        """Parse 28 Sao."""
        text = soup.get_text()

        # Pattern: "Sao Giác", "Nhị thập bát tú: Giác"
        star_names = list(self.STAR_28_RATING.keys())
        pattern = r'[Ss]ao\s+(' + '|'.join(star_names) + ')'

        match = re.search(pattern, text)
        if match:
            name = match.group(1)
            return Star28Info(
                name=name,
                is_good=self.STAR_28_RATING.get(name, True),
            )

        return None

    def _parse_truc12(self, soup: BeautifulSoup) -> Optional[Truc12Info]:
        """Parse 12 Trực."""
        text = soup.get_text()

        truc_names = list(self.TRUC_12_RATING.keys())
        pattern = r'[Tt]rực[:\s]*(' + '|'.join(truc_names) + ')'

        match = re.search(pattern, text)
        if match:
            name = match.group(1)
            return Truc12Info(
                name=name,
                is_good=self.TRUC_12_RATING.get(name, True),
            )

        return None

    def _parse_hoang_dao_hours(self, soup: BeautifulSoup) -> list[HourInfo]:
        """Parse giờ hoàng đạo."""
        hours = []

        chi_hours = [
            ('Tý', '23:00 - 01:00'),
            ('Sửu', '01:00 - 03:00'),
            ('Dần', '03:00 - 05:00'),
            ('Mão', '05:00 - 07:00'),
            ('Thìn', '07:00 - 09:00'),
            ('Tỵ', '09:00 - 11:00'),
            ('Ngọ', '11:00 - 13:00'),
            ('Mùi', '13:00 - 15:00'),
            ('Thân', '15:00 - 17:00'),
            ('Dậu', '17:00 - 19:00'),
            ('Tuất', '19:00 - 21:00'),
            ('Hợi', '21:00 - 23:00'),
        ]

        hoang_dao_chis = set()

        # Method 1: Tìm trong calendar-col2 - chứa danh sách giờ hoàng đạo
        # Format: "Giáp Tý (23h-1h)", "Ất Sửu (1h-3h)"
        calendar_col2_list = soup.find_all('div', class_='calendar-col2')
        for col2 in calendar_col2_list:
            col2_text = col2.get_text()
            if 'Hoàng Đạo' in col2_text or 'hoàng đạo' in col2_text.lower():
                # Tìm tất cả địa chi trong section này
                for chi, _ in chi_hours:
                    # Match patterns like "Giáp Tý", "Ất Sửu" trong giờ hoàng đạo
                    if re.search(rf'\b\w+\s+{chi}\s*\(', col2_text):
                        hoang_dao_chis.add(chi)

        # Method 2: Tìm trong toàn bộ text với pattern cụ thể hơn
        if not hoang_dao_chis:
            text = soup.get_text()

            # Tìm section "Giờ Hoàng Đạo" và lấy các giờ sau đó
            hoang_dao_section = re.search(
                r'[Gg]iờ\s+[Hh]oàng\s+[Đđ]ạo[:\s]*(.*?)(?:[Gg]iờ\s+[Hh]ắc|$)',
                text,
                re.DOTALL
            )
            if hoang_dao_section:
                hoang_dao_text = hoang_dao_section.group(1)
                for chi, _ in chi_hours:
                    if chi in hoang_dao_text:
                        hoang_dao_chis.add(chi)

        # Method 3: Fallback - tìm pattern đơn giản
        if not hoang_dao_chis:
            text = soup.get_text()
            hoang_dao_match = re.search(r'[Hh]oàng\s+[Đđ]ạo[:\s]*([^\n]+)', text)
            if hoang_dao_match:
                hoang_dao_text = hoang_dao_match.group(1)
                for chi, _ in chi_hours:
                    if chi in hoang_dao_text:
                        hoang_dao_chis.add(chi)

        for chi, time_range in chi_hours:
            hours.append(HourInfo(
                chi=chi,
                time_range=time_range,
                is_hoang_dao=chi in hoang_dao_chis,
                is_hac_dao=chi not in hoang_dao_chis,
            ))

        return hours

    def _parse_directions(self, soup: BeautifulSoup) -> list[DirectionInfo]:
        """Parse hướng xuất hành."""
        directions = []
        text = soup.get_text()

        # Valid direction names in Vietnamese (ordered from longest to shortest for proper matching)
        valid_directions = [
            'Chính Đông', 'Chính Tây', 'Chính Nam', 'Chính Bắc',
            'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam',
            'Đông', 'Tây', 'Nam', 'Bắc',
        ]
        direction_regex = '|'.join(re.escape(d) for d in valid_directions)

        # Pattern: "Hỷ thần (hướng thần may mắn) - TỐT: Hướng Đông Bắc"
        direction_patterns = [
            (rf'[Hh]ỷ\s*thần[^:]*:\s*[Hh]ướng\s+({direction_regex})', 'Hỷ thần', 5),
            (rf'[Tt]ài\s*thần[^:]*:\s*[Hh]ướng\s+({direction_regex})', 'Tài thần', 5),
            (rf'[Hh]ắc\s*thần[^:]*:\s*[Hh]ướng\s+({direction_regex})', 'Hắc thần', 1),
        ]

        for pattern, name, rating in direction_patterns:
            match = re.search(pattern, text)
            if match:
                direction_text = match.group(1).strip()
                if direction_text:
                    directions.append(DirectionInfo(
                        name=name,
                        direction=direction_text,
                        rating=rating,
                    ))

        return directions

    def _parse_activities(self, soup: BeautifulSoup, activity_type: str) -> list[ActivityInfo]:
        """
        Parse việc nên làm / không nên làm.

        Format trên website:
        - Nên làm: Tạo tác mọi việc đều đặng vinh xương, tấn lợi...
        - Kỵ làm: Chôn cất hoạn nạn ba năm...
        """
        activities = []
        text = soup.get_text()

        if activity_type == 'good':
            # Pattern: "- Nên làm:" hoặc "Nên làm:" đến "Kỵ làm" / "Kiêng cữ" / "Ngoại lệ"
            match = re.search(
                r'-?\s*Nên làm[:\s]+(.+?)(?=-?\s*Kỵ\s*làm|-?\s*Kiêng\s*cữ|-?\s*Ngoại\s*lệ|$)',
                text,
                re.DOTALL
            )
        else:
            # Pattern: "Kỵ làm:" hoặc "Kiêng cữ:" đến "Ngoại lệ" hoặc section boundary
            match = re.search(
                r'-?\s*(?:Kỵ\s*làm|Kiêng\s*cữ)[:\s]+(.+?)(?=-?\s*Ngoại\s*lệ|Sao\s+\w+\s+trúng|Nhân thần|$)',
                text,
                re.DOTALL
            )

        if match:
            activities_text = match.group(1).strip()
            # Clean up text
            activities_text = re.sub(r'\s+', ' ', activities_text)  # Normalize whitespace

            # Add as single activity (text description)
            if activities_text and len(activities_text) > 5:
                activities.append(ActivityInfo(
                    name=activities_text[:500],  # Limit length
                    category='description',
                ))

        return activities

    def _categorize_activity(self, activity_name: str) -> str:
        """Phân loại activity theo category."""
        name_lower = activity_name.lower()

        categories = {
            'spiritual': ['cầu', 'cúng', 'tế', 'lễ', 'giải', 'an'],
            'construction': ['động thổ', 'xây', 'sửa', 'lắp', 'đào'],
            'business': ['khai trương', 'mở', 'ký', 'giao dịch', 'buôn'],
            'travel': ['xuất hành', 'di chuyển', 'đi', 'về'],
            'family': ['cưới', 'hỏi', 'nhập trạch', 'dọn'],
            'health': ['khám', 'chữa', 'châm'],
            'funeral': ['an táng', 'cải táng', 'tang', 'chôn'],
            'agriculture': ['trồng', 'cấy', 'gieo', 'nuôi'],
        }

        for category, keywords in categories.items():
            for keyword in keywords:
                if keyword in name_lower:
                    return category

        return 'general'

    def _parse_stars(self, soup: BeautifulSoup) -> tuple[list[str], list[str]]:
        """
        Parse cát tinh và hung tinh.

        Format: "sao tốt là Nguyệt Đức: Tốt mọi việc; Minh tinh: Tốt mọi việc;
                 Các sao xấu là Tiểu Hao: Xấu về giao dịch; Hoang vu: Xấu mọi việc;"
        """
        text = soup.get_text()
        good_stars = []
        bad_stars = []

        # Find stars section and limit scope to avoid footer noise
        stars_section = re.search(
            r'[Cc]át\s*tinh.*?[Hh]ung\s*tinh.*?(?=Hôm nay ngày gì|Hướng xuất hành|$)',
            text,
            re.DOTALL
        )
        if stars_section:
            section_text = stars_section.group(0)
        else:
            section_text = text[:5000]  # Limit to first 5000 chars as fallback

        # Cát tinh: extract star names before colon, after "sao tốt là"
        cat_match = re.search(r'sao tốt là\s*([^C]+?)(?:Các sao xấu|$)', section_text)
        if cat_match:
            stars_text = cat_match.group(1)
            # Pattern: "Nguyệt Đức: Tốt mọi việc;" -> extract "Nguyệt Đức"
            star_names = re.findall(r'([^;:]+):', stars_text)
            for name in star_names:
                name = name.strip()
                # Filter valid star names (short, no noise)
                if name and 2 <= len(name) <= 30 and not re.search(r'(Xem|ngày|năm|tháng)', name):
                    good_stars.append(name)

        # Hung tinh: extract after "sao xấu là" (more flexible pattern)
        hung_match = re.search(r'sao xấu là\s*(.+?)(?:Hôm nay ngày gì|$)', section_text, re.DOTALL)
        if hung_match:
            stars_text = hung_match.group(1)
            star_names = re.findall(r'([^;:]+):', stars_text)
            for name in star_names:
                name = name.strip()
                # Remove any parenthetical text like "(Cẩu Giảo)"
                name = re.sub(r'\([^)]*\)', '', name).strip()
                if name and 2 <= len(name) <= 20 and not re.search(r'(Xem|ngày|năm|tháng|cầu)', name, re.I):
                    bad_stars.append(name)

        return good_stars, bad_stars

    def _parse_ly_thuan_phong_hours(self, soup: BeautifulSoup) -> list[LyThuanPhongHour]:
        """
        Parse giờ xuất hành theo Lý Thuần Phong.

        Format: "11h-13h 23h-1h Tốc hỷ: TỐT ... description"
        Các giờ: Tốc hỷ (TỐT), Lưu niên (XẤU), Xích khẩu (XẤU),
                 Tiểu cát (TỐT), Không vong (XẤU), Đại an (TỐT)
        """
        hours = []
        text = soup.get_text()

        # Tìm section Lý Thuần Phong
        section_match = re.search(
            r'Giờ xuất hành theo Lý Thuần Phong(.+?)(?:Tuổi xung khắc|Hướng xuất hành|$)',
            text,
            re.DOTALL
        )
        if not section_match:
            return hours

        section_text = section_match.group(1)

        # Các giờ và đánh giá
        hour_types = {
            'Tốc hỷ': True,
            'Đại an': True,
            'Tiểu cát': True,
            'Lưu niên': False,
            'Xích khẩu': False,
            'Không vong': False,
        }

        # Pattern: "11h-13h 23h-1h Tốc hỷ: TỐT description..."
        for hour_name, is_good in hour_types.items():
            # Tìm pattern với time ranges trước tên giờ
            pattern = rf'((?:\d{{1,2}}h\s*-\s*\d{{1,2}}h\s*)+)\s*{re.escape(hour_name)}[:\s]*(TỐT|XẤU)\s*(.+?)(?=\d{{1,2}}h\s*-\s*\d{{1,2}}h\s+(?:Tốc|Đại|Tiểu|Lưu|Xích|Không)|$)'
            match = re.search(pattern, section_text, re.DOTALL)

            if match:
                time_ranges_str = match.group(1).strip()
                rating = match.group(2)
                description = match.group(3).strip()

                # Normalize time ranges
                time_ranges = re.findall(r'\d{1,2}h\s*-\s*\d{1,2}h', time_ranges_str)
                time_range = ', '.join(time_ranges)

                # Clean description - chỉ lấy phần chính
                description = re.sub(r'\s+', ' ', description)
                # Cắt ở dấu chấm đầu tiên hoặc giới hạn 300 ký tự
                if '.' in description:
                    first_sentences = description.split('.')[:2]
                    description = '.'.join(first_sentences) + '.'
                description = description[:300].strip()

                hours.append(LyThuanPhongHour(
                    time_range=time_range,
                    name=hour_name,
                    is_good=rating == 'TỐT',
                    description=description if description else None,
                ))

        return hours

    def _parse_conflicting_ages(self, soup: BeautifulSoup) -> Optional[ConflictingAge]:
        """
        Parse tuổi xung khắc.

        Format:
        Xung ngày: Kỷ Dậu, Đinh Dậu, Tân Mùi, Tân Sửu
        Xung tháng: Kỷ Tị, Quý Tị, Quý Mùi, Quý Sửu, Quý Hợi
        """
        text = soup.get_text()

        xung_ngay = []
        xung_thang = []

        # Parse xung ngày
        ngay_match = re.search(r'Xung ngày[:\s]*([^\n]+?)(?:Xung tháng|Sao tốt|$)', text)
        if ngay_match:
            ngay_text = ngay_match.group(1).strip()
            # Split by comma and clean
            items = [item.strip() for item in ngay_text.split(',')]
            xung_ngay = [item for item in items if item and len(item) <= 20]

        # Parse xung tháng
        thang_match = re.search(r'Xung tháng[:\s]*([^\n]+?)(?:Sao tốt|Ngày kỵ|$)', text)
        if thang_match:
            thang_text = thang_match.group(1).strip()
            items = [item.strip() for item in thang_text.split(',')]
            xung_thang = [item for item in items if item and len(item) <= 20]

        if xung_ngay or xung_thang:
            return ConflictingAge(
                xung_ngay=xung_ngay,
                xung_thang=xung_thang,
            )

        return None
