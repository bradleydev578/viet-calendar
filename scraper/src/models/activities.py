"""
Master list các hoạt động (việc nên làm / không nên làm) với aliases.

Dùng để chuẩn hóa tên hoạt động từ nhiều nguồn khác nhau.
"""
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum


class ActivityCategory(str, Enum):
    """Danh mục hoạt động."""
    SPIRITUAL = "spiritual"          # Tâm linh: cầu an, cúng tế, giải hạn
    CONSTRUCTION = "construction"    # Xây dựng: động thổ, xây nhà, sửa chữa
    BUSINESS = "business"            # Kinh doanh: khai trương, ký hợp đồng, giao dịch
    TRAVEL = "travel"                # Xuất hành: đi xa, du lịch
    FAMILY = "family"                # Gia đình: cưới hỏi, nhập trạch, sinh con
    HEALTH = "health"                # Sức khỏe: khám bệnh, chữa bệnh, châm cứu
    FUNERAL = "funeral"              # Tang lễ: an táng, cải táng
    AGRICULTURE = "agriculture"      # Nông nghiệp: trồng trọt, chăn nuôi
    EDUCATION = "education"          # Học tập: nhập học, thi cử
    LEGAL = "legal"                  # Pháp lý: kiện tụng, ký kết
    CLOTHING = "clothing"            # May mặc: cắt áo, may đồ
    WATER = "water"                  # Thủy: đào giếng, thuyền bè
    GENERAL = "general"              # Chung


class Activity(BaseModel):
    """Thông tin một hoạt động chuẩn."""
    id: str = Field(..., description="ID duy nhất (snake_case)")
    name: str = Field(..., description="Tên hiển thị chính")
    name_en: Optional[str] = Field(default=None, description="Tên tiếng Anh")
    category: ActivityCategory = Field(..., description="Danh mục")
    aliases: list[str] = Field(default_factory=list, description="Các tên gọi khác")
    keywords: list[str] = Field(default_factory=list, description="Từ khóa để match")
    description: Optional[str] = Field(default=None, description="Mô tả chi tiết")
    is_common: bool = Field(default=True, description="Hoạt động phổ biến")


# ============================================================
# MASTER LIST CÁC HOẠT ĐỘNG
# ============================================================

ACTIVITIES_MASTER_LIST: list[Activity] = [
    # === SPIRITUAL (Tâm linh) ===
    Activity(
        id="cau_an",
        name="Cầu an",
        name_en="Pray for peace",
        category=ActivityCategory.SPIRITUAL,
        aliases=["cầu an giải hạn", "cầu bình an"],
        keywords=["cầu an", "cầu bình an"],
    ),
    Activity(
        id="cau_tu",
        name="Cầu tự",
        name_en="Pray for children",
        category=ActivityCategory.SPIRITUAL,
        aliases=["cầu con", "cầu tự tử tôn"],
        keywords=["cầu tự", "cầu con"],
    ),
    Activity(
        id="giai_han",
        name="Giải hạn",
        name_en="Remove bad luck",
        category=ActivityCategory.SPIRITUAL,
        aliases=["giải hạn sao", "tống hạn"],
        keywords=["giải hạn", "tống hạn"],
    ),
    Activity(
        id="cung_te",
        name="Cúng tế",
        name_en="Worship",
        category=ActivityCategory.SPIRITUAL,
        aliases=["cúng lễ", "tế lễ", "cúng bái"],
        keywords=["cúng", "tế", "lễ bái"],
    ),
    Activity(
        id="cau_phuc",
        name="Cầu phúc",
        name_en="Pray for blessing",
        category=ActivityCategory.SPIRITUAL,
        aliases=["cầu phước", "cầu lộc"],
        keywords=["cầu phúc", "cầu phước"],
    ),
    Activity(
        id="cau_tai",
        name="Cầu tài",
        name_en="Pray for wealth",
        category=ActivityCategory.SPIRITUAL,
        aliases=["cầu tài lộc", "cầu lộc"],
        keywords=["cầu tài", "cầu lộc"],
    ),

    # === CONSTRUCTION (Xây dựng) ===
    Activity(
        id="dong_tho",
        name="Động thổ",
        name_en="Break ground",
        category=ActivityCategory.CONSTRUCTION,
        aliases=["khởi công", "động đất", "đào móng"],
        keywords=["động thổ", "khởi công", "đào móng"],
    ),
    Activity(
        id="xay_nha",
        name="Xây nhà",
        name_en="Build house",
        category=ActivityCategory.CONSTRUCTION,
        aliases=["xây cất", "xây dựng nhà", "cất nhà", "khởi tạo"],
        keywords=["xây nhà", "xây cất", "cất nhà", "khởi tạo"],
    ),
    Activity(
        id="sua_chua",
        name="Sửa chữa",
        name_en="Repair",
        category=ActivityCategory.CONSTRUCTION,
        aliases=["sửa nhà", "tu sửa", "tu bổ"],
        keywords=["sửa chữa", "sửa nhà", "tu sửa"],
    ),
    Activity(
        id="lop_mai",
        name="Lợp mái",
        name_en="Roof",
        category=ActivityCategory.CONSTRUCTION,
        aliases=["che mái", "dựng hiên", "cất nóc"],
        keywords=["lợp mái", "che mái", "cất nóc"],
    ),
    Activity(
        id="tro_cua",
        name="Trổ cửa",
        name_en="Make door",
        category=ActivityCategory.CONSTRUCTION,
        aliases=["dựng cửa", "gắn cửa", "làm cửa"],
        keywords=["trổ cửa", "dựng cửa", "gắn cửa"],
    ),
    Activity(
        id="xay_lau_gac",
        name="Xây lầu gác",
        name_en="Build tower",
        category=ActivityCategory.CONSTRUCTION,
        aliases=["xây gác", "xây lầu"],
        keywords=["lầu gác", "xây gác"],
    ),

    # === BUSINESS (Kinh doanh) ===
    Activity(
        id="khai_truong",
        name="Khai trương",
        name_en="Grand opening",
        category=ActivityCategory.BUSINESS,
        aliases=["khai nghiệp", "mở cửa hàng", "khai thị"],
        keywords=["khai trương", "khai nghiệp", "mở cửa"],
    ),
    Activity(
        id="ky_hop_dong",
        name="Ký hợp đồng",
        name_en="Sign contract",
        category=ActivityCategory.BUSINESS,
        aliases=["ký kết", "giao ước", "lập văn tự"],
        keywords=["ký hợp đồng", "ký kết", "giao ước"],
    ),
    Activity(
        id="giao_dich",
        name="Giao dịch",
        name_en="Transaction",
        category=ActivityCategory.BUSINESS,
        aliases=["mua bán", "buôn bán", "thương mại"],
        keywords=["giao dịch", "mua bán", "buôn bán"],
    ),
    Activity(
        id="mo_kho",
        name="Mở kho",
        name_en="Open warehouse",
        category=ActivityCategory.BUSINESS,
        aliases=["xuất kho", "nhập kho"],
        keywords=["mở kho", "xuất kho", "nhập kho"],
    ),

    # === TRAVEL (Xuất hành) ===
    Activity(
        id="xuat_hanh",
        name="Xuất hành",
        name_en="Travel",
        category=ActivityCategory.TRAVEL,
        aliases=["đi xa", "du hành", "lên đường"],
        keywords=["xuất hành", "đi xa", "lên đường"],
    ),
    Activity(
        id="di_thuyen",
        name="Đi thuyền",
        name_en="Boat travel",
        category=ActivityCategory.TRAVEL,
        aliases=["đi ghe", "đi tàu thủy"],
        keywords=["đi thuyền", "đi ghe", "thuyền bè"],
    ),

    # === FAMILY (Gia đình) ===
    Activity(
        id="cuoi_hoi",
        name="Cưới hỏi",
        name_en="Wedding",
        category=ActivityCategory.FAMILY,
        aliases=["cưới gả", "hôn nhân", "thành hôn", "giá thú"],
        keywords=["cưới", "hỏi", "hôn nhân", "giá thú"],
    ),
    Activity(
        id="an_hoi",
        name="Ăn hỏi",
        name_en="Engagement",
        category=ActivityCategory.FAMILY,
        aliases=["lễ hỏi", "đính hôn", "dạm ngõ"],
        keywords=["ăn hỏi", "lễ hỏi", "đính hôn"],
    ),
    Activity(
        id="nhap_trach",
        name="Nhập trạch",
        name_en="Move in",
        category=ActivityCategory.FAMILY,
        aliases=["dọn nhà", "về nhà mới", "tân gia"],
        keywords=["nhập trạch", "dọn nhà", "tân gia"],
    ),
    Activity(
        id="sinh_con",
        name="Sinh con",
        name_en="Give birth",
        category=ActivityCategory.FAMILY,
        aliases=["sanh con", "đẻ con"],
        keywords=["sinh con", "sanh con"],
    ),

    # === HEALTH (Sức khỏe) ===
    Activity(
        id="kham_benh",
        name="Khám bệnh",
        name_en="Medical checkup",
        category=ActivityCategory.HEALTH,
        aliases=["đi bác sĩ", "chữa bệnh", "trị bệnh"],
        keywords=["khám bệnh", "chữa bệnh", "trị bệnh"],
    ),
    Activity(
        id="cham_cuu",
        name="Châm cứu",
        name_en="Acupuncture",
        category=ActivityCategory.HEALTH,
        aliases=["châm chích", "bấm huyệt"],
        keywords=["châm cứu", "châm chích"],
    ),
    Activity(
        id="uong_thuoc",
        name="Uống thuốc",
        name_en="Take medicine",
        category=ActivityCategory.HEALTH,
        aliases=["dùng thuốc", "uống thuốc lần đầu"],
        keywords=["uống thuốc", "dùng thuốc"],
    ),

    # === FUNERAL (Tang lễ) ===
    Activity(
        id="an_tang",
        name="An táng",
        name_en="Burial",
        category=ActivityCategory.FUNERAL,
        aliases=["chôn cất", "hạ huyệt", "mai táng"],
        keywords=["an táng", "chôn cất", "mai táng"],
    ),
    Activity(
        id="cai_tang",
        name="Cải táng",
        name_en="Reburial",
        category=ActivityCategory.FUNERAL,
        aliases=["bốc mộ", "di dời mộ"],
        keywords=["cải táng", "bốc mộ"],
    ),
    Activity(
        id="lam_mo",
        name="Làm mộ",
        name_en="Build tomb",
        category=ActivityCategory.FUNERAL,
        aliases=["xây mộ", "đắp mộ", "sửa mộ"],
        keywords=["làm mộ", "xây mộ", "đắp mộ"],
    ),

    # === AGRICULTURE (Nông nghiệp) ===
    Activity(
        id="trong_trot",
        name="Trồng trọt",
        name_en="Planting",
        category=ActivityCategory.AGRICULTURE,
        aliases=["gieo trồng", "gieo hạt", "cấy lúa"],
        keywords=["trồng trọt", "gieo trồng", "gieo hạt"],
    ),
    Activity(
        id="chan_nuoi",
        name="Chăn nuôi",
        name_en="Livestock",
        category=ActivityCategory.AGRICULTURE,
        aliases=["nuôi gia súc", "nuôi gia cầm"],
        keywords=["chăn nuôi", "nuôi"],
    ),
    Activity(
        id="thu_hoach",
        name="Thu hoạch",
        name_en="Harvest",
        category=ActivityCategory.AGRICULTURE,
        aliases=["gặt hái", "thu gom"],
        keywords=["thu hoạch", "gặt hái"],
    ),

    # === EDUCATION (Học tập) ===
    Activity(
        id="nhap_hoc",
        name="Nhập học",
        name_en="Enroll",
        category=ActivityCategory.EDUCATION,
        aliases=["vào học", "bái sư"],
        keywords=["nhập học", "vào học", "bái sư"],
    ),
    Activity(
        id="thi_cu",
        name="Thi cử",
        name_en="Examination",
        category=ActivityCategory.EDUCATION,
        aliases=["đi thi", "ứng thí", "khoa cử"],
        keywords=["thi cử", "đi thi", "khoa cử"],
    ),

    # === LEGAL (Pháp lý) ===
    Activity(
        id="kien_tung",
        name="Kiện tụng",
        name_en="Lawsuit",
        category=ActivityCategory.LEGAL,
        aliases=["ra tòa", "tranh tụng", "kiện cáo"],
        keywords=["kiện tụng", "kiện cáo", "tranh tụng"],
    ),

    # === CLOTHING (May mặc) ===
    Activity(
        id="cat_ao",
        name="Cắt áo",
        name_en="Cut cloth",
        category=ActivityCategory.CLOTHING,
        aliases=["cắt may", "may áo", "may đồ", "cắt vải"],
        keywords=["cắt áo", "cắt may", "may áo"],
    ),

    # === WATER (Thủy) ===
    Activity(
        id="dao_gieng",
        name="Đào giếng",
        name_en="Dig well",
        category=ActivityCategory.WATER,
        aliases=["khoan giếng", "đào ao"],
        keywords=["đào giếng", "khoan giếng"],
    ),
    Activity(
        id="thuy_loi",
        name="Thủy lợi",
        name_en="Irrigation",
        category=ActivityCategory.WATER,
        aliases=["làm kênh", "đắp đê"],
        keywords=["thủy lợi", "kênh mương"],
    ),
    Activity(
        id="lam_thuyen",
        name="Làm thuyền",
        name_en="Build boat",
        category=ActivityCategory.WATER,
        aliases=["đóng thuyền", "sửa thuyền", "hạ thủy"],
        keywords=["làm thuyền", "đóng thuyền", "hạ thủy"],
    ),
]


# ============================================================
# LOOKUP FUNCTIONS
# ============================================================

def get_activity_by_id(activity_id: str) -> Optional[Activity]:
    """Tìm activity theo ID."""
    for activity in ACTIVITIES_MASTER_LIST:
        if activity.id == activity_id:
            return activity
    return None


def get_activities_by_category(category: ActivityCategory) -> list[Activity]:
    """Lấy danh sách activities theo category."""
    return [a for a in ACTIVITIES_MASTER_LIST if a.category == category]


def match_activity(text: str) -> Optional[Activity]:
    """
    Match text với activity trong master list.

    Args:
        text: Văn bản cần match (ví dụ: "cưới gả", "xây nhà")

    Returns:
        Activity nếu tìm thấy, None nếu không
    """
    text_lower = text.lower().strip()

    # Exact match với name hoặc aliases
    for activity in ACTIVITIES_MASTER_LIST:
        if text_lower == activity.name.lower():
            return activity
        for alias in activity.aliases:
            if text_lower == alias.lower():
                return activity

    # Keyword match
    for activity in ACTIVITIES_MASTER_LIST:
        for keyword in activity.keywords:
            if keyword.lower() in text_lower:
                return activity

    return None


def extract_activities_from_text(text: str) -> list[Activity]:
    """
    Trích xuất tất cả activities từ văn bản mô tả.

    Args:
        text: Văn bản mô tả (ví dụ: "Tốt cho cưới hỏi, xây nhà, khai trương")

    Returns:
        Danh sách Activity được tìm thấy
    """
    found = []
    text_lower = text.lower()

    for activity in ACTIVITIES_MASTER_LIST:
        # Check keywords
        for keyword in activity.keywords:
            if keyword.lower() in text_lower:
                if activity not in found:
                    found.append(activity)
                break

    return found


def get_all_categories() -> list[dict]:
    """Lấy danh sách tất cả categories với thông tin."""
    categories = {}
    for activity in ACTIVITIES_MASTER_LIST:
        cat = activity.category
        if cat not in categories:
            categories[cat] = {
                "id": cat.value,
                "name": _get_category_name(cat),
                "count": 0,
            }
        categories[cat]["count"] += 1
    return list(categories.values())


def _get_category_name(category: ActivityCategory) -> str:
    """Lấy tên hiển thị của category."""
    names = {
        ActivityCategory.SPIRITUAL: "Tâm linh",
        ActivityCategory.CONSTRUCTION: "Xây dựng",
        ActivityCategory.BUSINESS: "Kinh doanh",
        ActivityCategory.TRAVEL: "Xuất hành",
        ActivityCategory.FAMILY: "Gia đình",
        ActivityCategory.HEALTH: "Sức khỏe",
        ActivityCategory.FUNERAL: "Tang lễ",
        ActivityCategory.AGRICULTURE: "Nông nghiệp",
        ActivityCategory.EDUCATION: "Học tập",
        ActivityCategory.LEGAL: "Pháp lý",
        ActivityCategory.CLOTHING: "May mặc",
        ActivityCategory.WATER: "Thủy",
        ActivityCategory.GENERAL: "Chung",
    }
    return names.get(category, "Khác")


# Export for easy access
ACTIVITY_IDS = [a.id for a in ACTIVITIES_MASTER_LIST]
ACTIVITY_NAMES = [a.name for a in ACTIVITIES_MASTER_LIST]
