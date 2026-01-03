/**
 * InfoModal Component
 * Bottom sheet modal for displaying detailed information about feng shui concepts
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type InfoModalType = '28sao' | '12truc' | 'hoangdaogio' | 'danhgia' | null;

interface InfoModalProps {
  visible: boolean;
  type: InfoModalType;
  onClose: () => void;
}

export function InfoModal({ visible, type, onClose }: InfoModalProps) {
  const insets = useSafeAreaInsets();

  const content = getContentByType(type);

  if (!content) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View />
      </Pressable>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + spacing[4] }]}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: content.iconBgColor }]}>
            <Icon name={content.icon} size={24} color={content.iconColor} />
          </View>
          <Text style={styles.title}>{content.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Đóng"
            accessibilityRole="button"
          >
            <Icon name="close" size={24} color={colors.neutral[600]} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              {section.heading && (
                <Text style={styles.sectionHeading}>{section.heading}</Text>
              )}
              <Text style={styles.sectionText}>{section.text}</Text>
              {section.list && (
                <View style={styles.list}>
                  {section.list.map((item, i) => (
                    <View key={i} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Source */}
          {content.source && (
            <View style={styles.sourceContainer}>
              <Text style={styles.sourceLabel}>Nguồn tham khảo:</Text>
              <Text style={styles.sourceText}>{content.source}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

interface ContentSection {
  heading?: string;
  text: string;
  list?: string[];
}

interface ModalContent {
  title: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  sections: ContentSection[];
  source?: string;
}

function getContentByType(type: InfoModalType): ModalContent | null {
  switch (type) {
    case '28sao':
      return {
        title: '28 Sao (Nhị Thập Bát Tú)',
        icon: 'star-outline',
        iconColor: '#FFD700',
        iconBgColor: 'rgba(255, 215, 0, 0.15)',
        sections: [
          {
            heading: 'Nhị Thập Bát Tú là gì?',
            text: 'Nhị Thập Bát Tú là 28 chòm sao nằm gần hoàng đạo và xích đạo thiên cầu, được người xưa sử dụng để đo đạc vị trí các thiên thể và chọn ngày tốt xấu. Theo quan sát cổ đại, Mặt Trăng mất khoảng 27-28 ngày để đi hết một vòng quỹ đạo, mỗi ngày tương ứng với một sao.',
          },
          {
            heading: 'Phân chia theo Tứ Tượng',
            text: '28 sao được chia thành 4 nhóm, mỗi nhóm 7 sao tương ứng với 4 phương và 4 linh thú:',
            list: [
              'Phương Đông - Thanh Long (Rồng xanh): Giác, Cang, Đê, Phòng, Tâm, Vĩ, Cơ',
              'Phương Bắc - Huyền Vũ (Rùa đen): Đẩu, Ngưu, Nữ, Hư, Nguy, Thất, Bích',
              'Phương Tây - Bạch Hổ (Hổ trắng): Khuê, Lâu, Vị, Mão, Tất, Chuỷ, Sâm',
              'Phương Nam - Chu Tước (Chim sẻ đỏ): Tỉnh, Quỷ, Liễu, Tinh, Trương, Dực, Chẩn',
            ],
          },
          {
            heading: 'Ý nghĩa trong xem ngày',
            text: 'Mỗi sao mang ý nghĩa tốt hoặc xấu khác nhau cho các công việc cụ thể:',
            list: [
              'Sao tốt (Cát): Giác, Phòng, Vĩ, Cơ, Đẩu, Thất, Khuê, Tất, Sâm, Tỉnh, Trương, Chẩn... - tốt cho hôn nhân, khai trương, xây dựng',
              'Sao xấu (Hung): Ngưu, Hư, Nguy, Chuỷ, Quỷ... - nên tránh các việc quan trọng',
            ],
          },
          {
            heading: 'Cách tính',
            text: '28 sao luân chuyển theo chu kỳ 28 ngày. Mỗi năm có 365 ngày = 13 chu kỳ + 1 ngày dư (năm nhuận +2 ngày).',
          },
        ],
        source: 'Wikipedia, Lịch Sử Việt Nam, Phong Thủy Thăng Long',
      };

    case '12truc':
      return {
        title: '12 Trực (Thập Nhị Kiến Trừ)',
        icon: 'zodiac-sagittarius',
        iconColor: '#FF9800',
        iconBgColor: 'rgba(255, 152, 0, 0.15)',
        sections: [
          {
            heading: '12 Trực là gì?',
            text: 'Thập Nhị Kiến Trừ (12 Trực) là cách tính ngày tốt xấu theo Đổng Công Tuyển Nhật. 12 Trực biểu đạt cho 12 trạng thái Sinh - Trưởng - Thành - Hoại của vạn vật, tượng trưng cho một chu kỳ từ khi bắt đầu đến khi kết thúc.',
          },
          {
            heading: 'Thứ tự 12 Trực',
            text: '12 Trực theo thứ tự là: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế.',
          },
          {
            heading: 'Phân loại Cát - Hung',
            text: '12 Trực được phân thành 4 cấp độ:',
            list: [
              'Thượng Cát (Rất tốt): Thành, Khai - tốt cho hầu hết mọi việc',
              'Thứ Cát (Tốt vừa): Trừ, Định, Nguy, Mãn - tốt cho một số việc cụ thể',
              'Trung Bình: Kiến, Chấp, Bình - nửa tốt nửa xấu',
              'Hung (Xấu): Phá, Thu, Bế - nên tránh các việc quan trọng',
            ],
          },
          {
            heading: 'Ý nghĩa từng Trực',
            text: '',
            list: [
              'Kiến: Khởi đầu mới, tốt cho khai trương, nhậm chức, cưới hỏi',
              'Trừ: Trừ bỏ điều xấu, tốt cho dọn dẹp, chữa bệnh',
              'Mãn: Đầy đủ, tốt cho giao dịch, cầu tài, tế tự',
              'Bình: Bình hòa, cần cẩn thận trong mọi việc',
              'Định: Ổn định, tốt cho hôn nhân, an táng, xây dựng',
              'Chấp: Nắm giữ, tốt cho ký kết, thu hoạch',
              'Phá: Đại Hao, đại sự không nên làm',
              'Nguy: Nguy hiểm, chỉ tốt cho tế tự, cầu phúc',
              'Thành: Thành công, tốt cho hầu hết mọi việc',
              'Thu: Thu lại, tốt cho thu hoạch, không tốt cho khởi sự',
              'Khai: Mở ra, tốt cho khai trương, động thổ, xuất hành',
              'Bế: Bế tắc, chỉ tốt cho tế tự, tu sửa',
            ],
          },
        ],
        source: 'Đổng Công Tuyển Nhật, Vạn Sự, Tử Vi Khoa Học',
      };

    case 'hoangdaogio':
      return {
        title: 'Hoàng Đạo Giờ',
        icon: 'clock-outline',
        iconColor: '#9C27B0',
        iconBgColor: 'rgba(156, 39, 176, 0.15)',
        sections: [
          {
            heading: 'Giờ Hoàng Đạo là gì?',
            text: 'Giờ Hoàng Đạo là những khoảng thời gian tốt lành trong ngày theo phong thủy cổ truyền Việt Nam. Mỗi ngày có 6 giờ Hoàng Đạo (tốt) và 6 giờ Hắc Đạo (xấu), luân phiên nhau.',
          },
          {
            heading: '12 Giờ trong ngày',
            text: 'Một ngày đêm âm lịch được chia thành 12 giờ, mỗi giờ bằng 2 tiếng đồng hồ:',
            list: [
              'Tý (23:00 - 01:00): Giờ chuột',
              'Sửu (01:00 - 03:00): Giờ trâu',
              'Dần (03:00 - 05:00): Giờ hổ',
              'Mão (05:00 - 07:00): Giờ mèo',
              'Thìn (07:00 - 09:00): Giờ rồng',
              'Tị (09:00 - 11:00): Giờ rắn',
              'Ngọ (11:00 - 13:00): Giờ ngựa',
              'Mùi (13:00 - 15:00): Giờ dê',
              'Thân (15:00 - 17:00): Giờ khỉ',
              'Dậu (17:00 - 19:00): Giờ gà',
              'Tuất (19:00 - 21:00): Giờ chó',
              'Hợi (21:00 - 23:00): Giờ heo',
            ],
          },
          {
            heading: 'Ứng dụng',
            text: 'Người Việt thường chọn giờ Hoàng Đạo cho các việc quan trọng như:',
            list: [
              'Cưới hỏi, đón dâu',
              'Khai trương, ký kết hợp đồng',
              'Khởi công xây dựng, động thổ',
              'Nhập trạch, dọn về nhà mới',
              'Xuất hành, đi xa',
              'An táng, cải táng',
            ],
          },
          {
            heading: 'Lưu ý quan trọng',
            text: 'Trong ngày Hoàng Đạo vẫn có giờ Hắc Đạo và ngược lại. Câu xưa có dạy: "Năm tốt không bằng tháng tốt, tháng tốt không bằng ngày tốt, ngày tốt không bằng giờ tốt". Nếu không chọn được ngày tốt, hãy cố gắng chọn giờ tốt.',
          },
        ],
        source: 'Wikipedia, Phong Thủy Tâm Nguyên, Lịch Ngày Tốt',
      };

    case 'danhgia':
      return {
        title: 'Đánh giá chất lượng ngày',
        icon: 'chart-line',
        iconColor: '#00BCD4',
        iconBgColor: 'rgba(0, 188, 212, 0.15)',
        sections: [
          {
            heading: 'Điểm chất lượng ngày là gì?',
            text: 'Điểm chất lượng ngày (0-100) là thang đánh giá tổng hợp mức độ tốt xấu của một ngày dựa trên nhiều yếu tố phong thủy truyền thống.',
          },
          {
            heading: 'Các yếu tố đánh giá',
            text: 'Điểm được tính dựa trên sự kết hợp của:',
            list: [
              'Sao trực nhật (28 Sao): Sao tốt hay xấu',
              'Trực (12 Trực): Kiến, Trừ, Mãn... thuộc cấp nào',
              'Ngày Hoàng Đạo/Hắc Đạo: Ngày thuộc loại tốt hay xấu',
              'Số giờ Hoàng Đạo: Ngày có nhiều giờ tốt hơn',
              'Ngày đặc biệt: Ngày Tam Nương, Thọ Tử, Nguyệt Kỵ...',
            ],
          },
          {
            heading: 'Cách hiểu điểm số',
            text: '',
            list: [
              '80-100 điểm: Ngày Đại Cát - Rất tốt cho mọi việc',
              '60-79 điểm: Ngày Cát - Tốt cho hầu hết công việc',
              '40-59 điểm: Ngày Bình Thường - Cẩn thận khi làm việc lớn',
              '20-39 điểm: Ngày Xấu - Nên tránh việc quan trọng',
              '0-19 điểm: Ngày Đại Hung - Không nên khởi sự',
            ],
          },
          {
            heading: 'Lưu ý khi sử dụng',
            text: 'Điểm số chỉ mang tính chất tham khảo. Việc chọn ngày còn phụ thuộc vào tuổi, mệnh của từng người và loại công việc cụ thể. Một ngày xấu cho việc này có thể tốt cho việc khác.',
          },
        ],
        source: 'Tổng hợp từ các nguồn lịch vạn niên Việt Nam',
      };

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: colors.neutral[0],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.neutral[300],
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  title: {
    flex: 1,
    ...typography.h4,
    color: colors.neutral[900],
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: spacing[6],
  },
  section: {
    marginBottom: spacing[5],
  },
  sectionHeading: {
    ...typography.labelLarge,
    color: colors.primary[700],
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  sectionText: {
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 24,
  },
  list: {
    marginTop: spacing[2],
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  bullet: {
    ...typography.bodyMedium,
    color: colors.primary[600],
    marginRight: spacing[2],
    fontWeight: '600',
  },
  listText: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.neutral[700],
    lineHeight: 22,
  },
  sourceContainer: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  sourceLabel: {
    ...typography.labelSmall,
    color: colors.neutral[500],
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  sourceText: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    fontStyle: 'italic',
  },
});
