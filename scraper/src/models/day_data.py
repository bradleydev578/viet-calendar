"""
Pydantic models cho dữ liệu ngày âm lịch và phong thủy.
"""
from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class LunarDate(BaseModel):
    """Thông tin ngày âm lịch."""
    day: int = Field(..., ge=1, le=30, description="Ngày âm lịch")
    month: int = Field(..., ge=1, le=12, description="Tháng âm lịch")
    year: int = Field(..., description="Năm âm lịch")
    is_leap_month: bool = Field(default=False, description="Tháng nhuận")


class CanChi(BaseModel):
    """Can Chi (Thiên Can + Địa Chi)."""
    can: str = Field(..., description="Thiên Can (Giáp, Ất, ...)")
    chi: str = Field(..., description="Địa Chi (Tý, Sửu, ...)")

    @property
    def full(self) -> str:
        return f"{self.can} {self.chi}"


class CanChiInfo(BaseModel):
    """Thông tin Can Chi đầy đủ cho ngày."""
    year: CanChi = Field(..., description="Can Chi năm")
    month: CanChi = Field(..., description="Can Chi tháng")
    day: CanChi = Field(..., description="Can Chi ngày")
    ngu_hanh: str = Field(..., description="Ngũ hành của ngày (Kim, Mộc, Thủy, Hỏa, Thổ)")


class HourInfo(BaseModel):
    """Thông tin 1 giờ trong ngày."""
    chi: str = Field(..., description="Địa Chi của giờ")
    time_range: str = Field(..., description="Khoảng thời gian (vd: 23:00 - 01:00)")
    is_hoang_dao: bool = Field(default=False, description="Giờ hoàng đạo")
    is_hac_dao: bool = Field(default=False, description="Giờ hắc đạo")


class Star28Info(BaseModel):
    """Thông tin 28 Sao (Nhị thập bát tú)."""
    name: str = Field(..., description="Tên sao (Giác, Cang, Đê, ...)")
    is_good: bool = Field(..., description="Sao tốt hay xấu")
    meaning: Optional[str] = Field(default=None, description="Ý nghĩa")


class Star28DetailedInfo(BaseModel):
    """Thông tin 28 Sao chi tiết với ngũ hành và con vật (từ xemngay.com)."""
    name: str = Field(..., description="Tên sao (Giác, Cang, Đê, ...)")
    element: Optional[str] = Field(default=None, description="Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ, Nhật, Nguyệt)")
    animal: Optional[str] = Field(default=None, description="Con vật (Giao long, Hổ, ...)")
    is_good: bool = Field(default=True, description="Sao tốt hay xấu")


class Truc12Info(BaseModel):
    """Thông tin 12 Trực."""
    name: str = Field(..., description="Tên trực (Kiến, Trừ, Mãn, ...)")
    is_good: bool = Field(..., description="Trực tốt hay xấu")
    meaning: Optional[str] = Field(default=None, description="Ý nghĩa")


class DirectionInfo(BaseModel):
    """Thông tin phương hướng."""
    name: str = Field(..., description="Tên phương (Hỷ thần, Tài thần, ...)")
    direction: str = Field(..., description="Hướng (Đông, Tây, Nam, Bắc, ...)")
    rating: int = Field(default=3, ge=1, le=5, description="Đánh giá 1-5 sao")


class ActivityInfo(BaseModel):
    """Thông tin việc nên làm / không nên làm."""
    name: str = Field(..., description="Tên việc")
    category: str = Field(default="general", description="Danh mục")


class LyThuanPhongHour(BaseModel):
    """Giờ xuất hành theo Lý Thuần Phong."""
    time_range: str = Field(..., description="Khoảng thời gian (vd: 11h-13h, 23h-1h)")
    name: str = Field(..., description="Tên giờ (Tốc hỷ, Lưu niên, Xích khẩu, ...)")
    is_good: bool = Field(..., description="Giờ tốt hay xấu")
    description: Optional[str] = Field(default=None, description="Mô tả chi tiết")


class ConflictingAge(BaseModel):
    """Tuổi xung khắc."""
    xung_ngay: list[str] = Field(default_factory=list, description="Tuổi xung ngày")
    xung_thang: list[str] = Field(default_factory=list, description="Tuổi xung tháng")


class DayData(BaseModel):
    """Dữ liệu đầy đủ cho 1 ngày."""
    # Ngày dương lịch
    solar_date: date = Field(..., description="Ngày dương lịch")

    # Ngày âm lịch
    lunar_date: LunarDate = Field(..., description="Ngày âm lịch")

    # Can Chi
    can_chi: CanChiInfo = Field(..., description="Thông tin Can Chi")

    # Tiết khí
    tiet_khi: Optional[str] = Field(default=None, description="Tiết khí (nếu có)")

    # 28 Sao
    star28: Optional[Star28Info] = Field(default=None, description="Sao trong 28 sao")

    # 12 Trực
    truc12: Optional[Truc12Info] = Field(default=None, description="Trực trong 12 trực")

    # Giờ hoàng đạo
    hoang_dao_hours: list[HourInfo] = Field(default_factory=list, description="Các giờ hoàng đạo")

    # Phương hướng
    directions: list[DirectionInfo] = Field(default_factory=list, description="Các phương hướng tốt")

    # Việc nên làm
    good_activities: list[ActivityInfo] = Field(default_factory=list, description="Việc nên làm")

    # Việc không nên làm
    bad_activities: list[ActivityInfo] = Field(default_factory=list, description="Việc không nên làm")

    # Cát tinh (sao tốt)
    good_stars: list[str] = Field(default_factory=list, description="Cát tinh")

    # Hung tinh (sao xấu)
    bad_stars: list[str] = Field(default_factory=list, description="Hung tinh")

    # Giờ xuất hành theo Lý Thuần Phong
    ly_thuan_phong_hours: list[LyThuanPhongHour] = Field(
        default_factory=list, description="Giờ xuất hành theo Lý Thuần Phong"
    )

    # Tuổi xung khắc
    conflicting_ages: Optional[ConflictingAge] = Field(
        default=None, description="Tuổi xung khắc với ngày"
    )

    # Điểm ngày (tính toán sau)
    day_score: Optional[int] = Field(default=None, ge=0, le=100, description="Điểm ngày 0-100")

    # Metadata
    source: str = Field(default="lichngaytot.com", description="Nguồn dữ liệu")
    scraped_at: Optional[str] = Field(default=None, description="Thời gian scrape")

    class Config:
        json_schema_extra = {
            "example": {
                "solar_date": "2025-01-01",
                "lunar_date": {
                    "day": 2,
                    "month": 12,
                    "year": 2024,
                    "is_leap_month": False
                },
                "can_chi": {
                    "year": {"can": "Giáp", "chi": "Thìn"},
                    "month": {"can": "Bính", "chi": "Tý"},
                    "day": {"can": "Kỷ", "chi": "Mùi"},
                    "ngu_hanh": "Hỏa"
                },
                "tiet_khi": "Tiểu Hàn",
                "day_score": 75
            }
        }


class YearData(BaseModel):
    """Dữ liệu cho cả năm."""
    year: int = Field(..., description="Năm dương lịch")
    days: list[DayData] = Field(default_factory=list, description="Danh sách ngày")
    total_days: int = Field(default=0, description="Tổng số ngày")

    def add_day(self, day_data: DayData) -> None:
        self.days.append(day_data)
        self.total_days = len(self.days)


class XemNgayData(BaseModel):
    """Dữ liệu từ xemngay.com (nguồn phụ cho cross-validation)."""
    solar_date: date = Field(..., description="Ngày dương lịch")
    lunar_date: Optional[LunarDate] = Field(default=None, description="Ngày âm lịch")
    can_chi: Optional[CanChiInfo] = Field(default=None, description="Thông tin Can Chi")
    star28: Optional[Star28DetailedInfo] = Field(default=None, description="28 Sao với chi tiết")
    truc12: Optional[Truc12Info] = Field(default=None, description="12 Trực")
    directions: list[DirectionInfo] = Field(default_factory=list, description="Phương hướng")
    good_activities: list[str] = Field(default_factory=list, description="Việc nên làm (text)")
    bad_activities: list[str] = Field(default_factory=list, description="Việc không nên (text)")
    source: str = Field(default="xemngay.com", description="Nguồn dữ liệu")
