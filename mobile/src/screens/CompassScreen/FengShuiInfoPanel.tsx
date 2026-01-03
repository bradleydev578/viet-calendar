import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { colors } from '../../theme';
import { useFengShuiStore } from '../../stores/useFengShuiStore';
import { DirectionCalculator, type DirectionInfo } from '../../core/fengshui/DirectionCalculator';

// Ngũ Hành (Five Elements) data
const ELEMENT_INFO = {
  kim: {
    name: 'Kim',
    vietnamese: 'Kim (Metal)',
    color: '#C0C0C0',
    directions: ['Tây', 'Tây Bắc'],
    meaning: 'Sự cứng rắn, quyết đoán, công bằng',
  },
  moc: {
    name: 'Mộc',
    vietnamese: 'Mộc (Wood)',
    color: '#228B22',
    directions: ['Đông', 'Đông Nam'],
    meaning: 'Sự phát triển, sinh sôi, sáng tạo',
  },
  thuy: {
    name: 'Thủy',
    vietnamese: 'Thủy (Water)',
    color: '#1E90FF',
    directions: ['Bắc'],
    meaning: 'Sự thông minh, linh hoạt, giao tiếp',
  },
  hoa: {
    name: 'Hỏa',
    vietnamese: 'Hỏa (Fire)',
    color: '#DC143C',
    directions: ['Nam'],
    meaning: 'Sự nhiệt tình, năng động, danh tiếng',
  },
  tho: {
    name: 'Thổ',
    vietnamese: 'Thổ (Earth)',
    color: '#DAA520',
    directions: ['Đông Bắc', 'Tây Nam'],
    meaning: 'Sự ổn định, bền vững, nuôi dưỡng',
  },
};

// Direction to element mapping
const DIRECTION_ELEMENTS: Record<string, keyof typeof ELEMENT_INFO> = {
  'Bắc': 'thuy',
  'Đông Bắc': 'tho',
  'Đông': 'moc',
  'Đông Nam': 'moc',
  'Nam': 'hoa',
  'Tây Nam': 'tho',
  'Tây': 'kim',
  'Tây Bắc': 'kim',
};

// 8 Trigrams (Bát Quái) info
const TRIGRAM_INFO: Record<string, { name: string; symbol: string; meaning: string }> = {
  'Bắc': { name: 'Khảm', symbol: '☵', meaning: 'Nước, nguy hiểm, trí tuệ' },
  'Đông Bắc': { name: 'Cấn', symbol: '☶', meaning: 'Núi, dừng lại, tri thức' },
  'Đông': { name: 'Chấn', symbol: '☳', meaning: 'Sấm, chuyển động, khởi đầu' },
  'Đông Nam': { name: 'Tốn', symbol: '☴', meaning: 'Gió, thuận lợi, tài lộc' },
  'Nam': { name: 'Ly', symbol: '☲', meaning: 'Lửa, sáng sủa, danh tiếng' },
  'Tây Nam': { name: 'Khôn', symbol: '☷', meaning: 'Đất, tiếp nhận, quan hệ' },
  'Tây': { name: 'Đoài', symbol: '☱', meaning: 'Đầm, vui vẻ, con cháu' },
  'Tây Bắc': { name: 'Càn', symbol: '☰', meaning: 'Trời, sáng tạo, quý nhân' },
};

interface FengShuiInfoPanelProps {
  heading?: number | null;
  isCompassAvailable?: boolean;
}

export function FengShuiInfoPanel({ heading, isCompassAvailable = false }: FengShuiInfoPanelProps) {
  const { getByDate } = useFengShuiStore();

  // Get today's date info
  const today = new Date();
  const todayData = useMemo(() => getByDate(today), [getByDate]);

  // Get grouped directions
  const groupedDirections = useMemo(() => {
    return DirectionCalculator.getGroupedDirections(todayData);
  }, [todayData]);

  // Get current direction if compass is available
  const currentDirection = useMemo(() => {
    if (!isCompassAvailable || heading === null || heading === undefined) return null;
    return DirectionCalculator.getDirectionFromDegrees(heading);
  }, [isCompassAvailable, heading]);

  // Format today's date
  const formattedDate = format(today, "EEEE, d 'tháng' M, yyyy", { locale: vi });
  const lunarInfo = todayData
    ? `${todayData.ld}/${todayData.lm} Âm lịch - ${todayData.dgz}`
    : '';

  return (
    <View style={styles.container}>
      {/* Today's Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        {lunarInfo && <Text style={styles.lunarText}>{lunarInfo}</Text>}
      </View>

      {/* Direction Summary Cards */}
      {groupedDirections.daiCat.length > 0 && (
        <DirectionCard
          title="Hướng Đại Cát"
          subtitle="Rất tốt - Nên hướng về"
          directions={groupedDirections.daiCat}
          color="#DAA520"
          bgColor="rgba(218, 165, 32, 0.1)"
        />
      )}

      {groupedDirections.cat.length > 0 && (
        <DirectionCard
          title="Hướng Cát"
          subtitle="Tốt - Thuận lợi"
          directions={groupedDirections.cat}
          color="#059669"
          bgColor="rgba(5, 150, 105, 0.1)"
        />
      )}

      {groupedDirections.hung.length > 0 && (
        <DirectionCard
          title="Hướng Hung"
          subtitle="Xấu - Nên tránh"
          directions={groupedDirections.hung}
          color="#F97316"
          bgColor="rgba(249, 115, 22, 0.1)"
        />
      )}

      {groupedDirections.daiHung.length > 0 && (
        <DirectionCard
          title="Hướng Đại Hung"
          subtitle="Rất xấu - Tuyệt đối tránh"
          directions={groupedDirections.daiHung}
          color="#DC2626"
          bgColor="rgba(220, 38, 38, 0.1)"
        />
      )}

      {/* Current Direction Info (if compass available) */}
      {currentDirection && (
        <CurrentDirectionCard
          directionName={currentDirection}
          heading={heading}
        />
      )}

      {/* Five Elements Legend */}
      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Ngũ Hành & Bát Quái</Text>
        <View style={styles.legendGrid}>
          {Object.entries(ELEMENT_INFO).map(([key, info]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: info.color }]} />
              <Text style={styles.legendText}>{info.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Suggestion */}
      <View style={styles.suggestionCard}>
        <Text style={styles.suggestionIcon}>💡</Text>
        <Text style={styles.suggestionText}>
          {groupedDirections.daiCat.length > 0
            ? `Hôm nay nên hướng về ${groupedDirections.daiCat.map(d => d.name).join(', ')} để được may mắn.`
            : groupedDirections.cat.length > 0
            ? `Các hướng ${groupedDirections.cat.map(d => d.name).join(', ')} thuận lợi cho các hoạt động hôm nay.`
            : 'Hôm nay không có hướng đặc biệt tốt, bạn có thể di chuyển bình thường.'}
        </Text>
      </View>
    </View>
  );
}

// Direction Card Component
interface DirectionCardProps {
  title: string;
  subtitle: string;
  directions: DirectionInfo[];
  color: string;
  bgColor: string;
}

function DirectionCard({ title, subtitle, directions, color, bgColor }: DirectionCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color }]}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.directionTags}>
        {directions.map((dir, index) => (
          <View key={index} style={[styles.directionTag, { borderColor: color }]}>
            <Text style={[styles.directionTagText, { color }]}>{dir.name}</Text>
            {dir.reason && (
              <Text style={styles.directionReason}>{dir.reason}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// Current Direction Card Component
interface CurrentDirectionCardProps {
  directionName: string;
  heading: number | null | undefined;
}

function CurrentDirectionCard({ directionName, heading }: CurrentDirectionCardProps) {
  const elementKey = DIRECTION_ELEMENTS[directionName];
  const element = ELEMENT_INFO[elementKey];
  const trigram = TRIGRAM_INFO[directionName];

  if (!element || !trigram) return null;

  return (
    <View style={styles.currentCard}>
      <Text style={styles.currentTitle}>Hướng Hiện Tại</Text>
      <View style={styles.currentContent}>
        <View style={styles.currentMain}>
          <Text style={styles.currentSymbol}>{trigram.symbol}</Text>
          <View>
            <Text style={styles.currentDirection}>{directionName}</Text>
            <Text style={styles.currentDegree}>
              {heading !== null && heading !== undefined ? `${Math.round(heading)}°` : '--°'}
            </Text>
          </View>
        </View>
        <View style={styles.currentDetails}>
          <View style={styles.currentDetailRow}>
            <View style={[styles.elementDot, { backgroundColor: element.color }]} />
            <Text style={styles.currentDetailText}>{element.vietnamese}</Text>
          </View>
          <Text style={styles.currentDetailSubtext}>{trigram.meaning}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  dateHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[800],
    textTransform: 'capitalize',
  },
  lunarText: {
    fontSize: 13,
    color: colors.neutral[500],
    marginTop: 4,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: 2,
  },
  directionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  directionTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
  },
  directionTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  directionReason: {
    fontSize: 10,
    color: colors.neutral[500],
    marginTop: 2,
  },
  currentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: 10,
  },
  currentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSymbol: {
    fontSize: 32,
    marginRight: 12,
  },
  currentDirection: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  currentDegree: {
    fontSize: 14,
    color: colors.neutral[500],
  },
  currentDetails: {
    alignItems: 'flex-end',
  },
  currentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  currentDetailText: {
    fontSize: 13,
    color: colors.neutral[700],
  },
  currentDetailSubtext: {
    fontSize: 11,
    color: colors.neutral[500],
    marginTop: 4,
    maxWidth: 120,
    textAlign: 'right',
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.neutral[600],
  },
  suggestionCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  suggestionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  suggestionText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary[800],
    lineHeight: 20,
  },
});
