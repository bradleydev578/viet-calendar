import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Text as SvgText, G, Path, Defs, RadialGradient, Stop, Polygon } from 'react-native-svg';

import { colors } from '../../theme';
import { useFengShuiStore } from '../../stores/useFengShuiStore';
import { DirectionCalculator, type DirectionInfo, type DirectionLuck } from '../../core/fengshui/DirectionCalculator';

const COMPASS_SIZE = 290;
const CENTER = COMPASS_SIZE / 2;

// Ring radii - compact design with space for 24 mountains text
const OUTER_RING = 140;
const DIRECTION_RING = 115;
const TRIGRAM_RING = 88;
const ELEMENT_RING = 65;
const INNER_RING = 40;
const NEEDLE_LENGTH = 70; // Length for compass needle - extends beyond inner ring

// Ngũ Hành (Five Elements) colors
const ELEMENT_COLORS = {
  kim: '#C0C0C0', // Metal - Silver
  moc: '#228B22', // Wood - Forest Green
  thuy: '#1E90FF', // Water - Dodger Blue
  hoa: '#DC143C', // Fire - Crimson
  tho: '#DAA520', // Earth - Goldenrod
};

// 8 Directions with Vietnamese names, Trigrams, and Elements
// Using full Vietnamese names instead of abbreviations
const DIRECTIONS = [
  { angle: 0, label: 'Bắc', name: 'Bắc', trigram: '☵', element: 'thuy', color: ELEMENT_COLORS.thuy },
  { angle: 45, label: 'ĐB', name: 'Đông Bắc', trigram: '☶', element: 'tho', color: ELEMENT_COLORS.tho },
  { angle: 90, label: 'Đông', name: 'Đông', trigram: '☳', element: 'moc', color: ELEMENT_COLORS.moc },
  { angle: 135, label: 'ĐN', name: 'Đông Nam', trigram: '☴', element: 'moc', color: ELEMENT_COLORS.moc },
  { angle: 180, label: 'Nam', name: 'Nam', trigram: '☲', element: 'hoa', color: ELEMENT_COLORS.hoa },
  { angle: 225, label: 'TN', name: 'Tây Nam', trigram: '☷', element: 'tho', color: ELEMENT_COLORS.tho },
  { angle: 270, label: 'Tây', name: 'Tây', trigram: '☱', element: 'kim', color: ELEMENT_COLORS.kim },
  { angle: 315, label: 'TB', name: 'Tây Bắc', trigram: '☰', element: 'kim', color: ELEMENT_COLORS.kim },
];

// 24 Mountain directions (simplified)
const MOUNTAINS_24 = [
  'Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 'Giáp',
  'Mão', 'Ất', 'Thìn', 'Tốn', 'Tỵ', 'Bính',
  'Ngọ', 'Đinh', 'Mùi', 'Khôn', 'Thân', 'Canh',
  'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi', 'Nhâm',
];

function getDirectionFromDegrees(degrees: number): typeof DIRECTIONS[0] {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return DIRECTIONS[index];
}

// Get luck indicator style for direction sector
function getLuckIndicatorStyle(luck: DirectionLuck): { fill: string; strokeWidth: number; stroke: string; opacity: number } {
  switch (luck) {
    case 'dai_cat':
      return { fill: 'rgba(218, 165, 32, 0.25)', strokeWidth: 3, stroke: '#DAA520', opacity: 1 };
    case 'cat':
      return { fill: 'rgba(5, 150, 105, 0.15)', strokeWidth: 2, stroke: '#059669', opacity: 1 };
    case 'hung':
      return { fill: 'rgba(249, 115, 22, 0.15)', strokeWidth: 2, stroke: '#F97316', opacity: 1 };
    case 'dai_hung':
      return { fill: 'rgba(220, 38, 38, 0.2)', strokeWidth: 3, stroke: '#DC2626', opacity: 1 };
    default:
      return { fill: 'transparent', strokeWidth: 0, stroke: 'transparent', opacity: 0 };
  }
}

interface FengShuiCompassProps {
  heading: number | null;
  isAvailable: boolean;
  error: string | null;
  todayDirections?: DirectionInfo[];
}

export function FengShuiCompass({
  heading,
  isAvailable,
  error,
  todayDirections: propDirections,
}: FengShuiCompassProps) {
  const rotation = useSharedValue(0);
  const pulseOpacity = useSharedValue(0.6);

  // Get feng shui data for today
  const { getByDate } = useFengShuiStore();
  const todayData = useMemo(() => getByDate(new Date()), [getByDate]);

  // Calculate today's auspicious directions
  const todayDirections = useMemo(() => {
    if (propDirections) return propDirections;
    return DirectionCalculator.getDirectionsForDay(todayData);
  }, [todayData, propDirections]);

  // Create a map for quick lookup
  const directionLuckMap = useMemo(() => {
    const map = new Map<string, DirectionInfo>();
    todayDirections.forEach(d => map.set(d.name, d));
    return map;
  }, [todayDirections]);

  useEffect(() => {
    if (heading !== null) {
      // Vietnamese/Chinese feng shui compass convention:
      // The direction you're facing should appear at the TOP (near the pointer)
      //
      // Standard compass: North=0° at top, heading rotates dial so faced direction aligns with pointer
      // Our dial has: Bắc at angle=0 (top), Nam at angle=180 (bottom)
      //
      // When heading=0° (facing North): rotate 0° → Bắc stays at top ✓
      // When heading=180° (facing South): rotate -180° → Nam moves to top ✓
      rotation.value = withSpring(-heading, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [heading, rotation]);

  // Pulse animation for dai_cat directions
  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseOpacity]);

  const compassStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Calculate current direction (needed for accessibility label)
  const currentDirection = heading !== null ? getDirectionFromDegrees(heading) : DIRECTIONS[0];
  const currentLuck = directionLuckMap.get(currentDirection.name);

  // Build accessibility label - must be before any early returns
  const accessibilityLabel = useMemo(() => {
    const headingText = heading !== null ? `${Math.round(heading)} độ` : '-- độ';
    const luckText = currentLuck && currentLuck.luck !== 'binh_thuong'
      ? `, ${DirectionCalculator.getLuckLabel(currentLuck.luck)}`
      : '';
    return `La bàn phong thủy, hướng hiện tại: ${headingText}, ${currentDirection.name}${luckText}`;
  }, [heading, currentDirection, currentLuck]);

  if (!isAvailable) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🧭</Text>
        <Text style={styles.emptyTitle}>Thiết bị không hỗ trợ la bàn</Text>
        <Text style={styles.emptyMessage}>
          Vui lòng sử dụng thiết bị có cảm biến từ trường
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Không thể truy cập la bàn</Text>
        <Text style={styles.emptyMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      {/* Feng Shui compass dial */}
      <Animated.View style={[styles.compassWrapper, compassStyle]}>
        <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}>
          <Defs>
            {/* Radial gradient for dai_cat glow */}
            <RadialGradient id="daiCatGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#DAA520" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#DAA520" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Outer decorative ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RING}
            stroke={colors.neutral[800]}
            strokeWidth={3}
            fill="#FFFDF7"
          />

          {/* Luck indicator sectors (background) */}
          {DIRECTIONS.map((dir, i) => {
            const dirLuck = directionLuckMap.get(dir.name);
            if (!dirLuck || dirLuck.luck === 'binh_thuong') return null;

            const style = getLuckIndicatorStyle(dirLuck.luck);
            const startAngle = dir.angle - 22.5;
            const endAngle = dir.angle + 22.5;
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            // Create arc path for sector
            const innerR = ELEMENT_RING;
            const outerR = DIRECTION_RING;

            const x1 = CENTER + outerR * Math.cos(startRad);
            const y1 = CENTER + outerR * Math.sin(startRad);
            const x2 = CENTER + outerR * Math.cos(endRad);
            const y2 = CENTER + outerR * Math.sin(endRad);
            const x3 = CENTER + innerR * Math.cos(endRad);
            const y3 = CENTER + innerR * Math.sin(endRad);
            const x4 = CENTER + innerR * Math.cos(startRad);
            const y4 = CENTER + innerR * Math.sin(startRad);

            const pathD = `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;

            return (
              <Path
                key={`luck-${i}`}
                d={pathD}
                fill={style.fill}
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                opacity={style.opacity}
              />
            );
          })}

          {/* 24 Mountain ring (outer) - text radiates outward from center */}
          {MOUNTAINS_24.map((mountain, i) => {
            const angle = i * 15;
            const rad = (angle - 90) * (Math.PI / 180);
            const radius = DIRECTION_RING + 18;
            const x = CENTER + radius * Math.cos(rad);
            const y = CENTER + radius * Math.sin(rad);

            // Text rotates to radiate outward from center
            // At 0° (top): text horizontal, baseline at bottom
            // At 180° (bottom): text rotated 180°, appears right-side up from outside
            return (
              <SvgText
                key={`mountain-${i}`}
                x={x}
                y={y}
                fill={colors.neutral[600]}
                fontSize={7}
                fontWeight="500"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${angle}, ${x}, ${y})`}
              >
                {mountain}
              </SvgText>
            );
          })}

          {/* Direction ring with colors */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={DIRECTION_RING}
            stroke={colors.neutral[400]}
            strokeWidth={1}
            fill="none"
          />

          {/* 8 Direction sectors */}
          {DIRECTIONS.map((dir, i) => {
            const startAngle = dir.angle - 22.5;
            const startRad = (startAngle - 90) * (Math.PI / 180);

            const x1 = CENTER + TRIGRAM_RING * Math.cos(startRad);
            const y1 = CENTER + TRIGRAM_RING * Math.sin(startRad);
            const x2 = CENTER + DIRECTION_RING * Math.cos(startRad);
            const y2 = CENTER + DIRECTION_RING * Math.sin(startRad);

            // Direction label position - adjusted for full names
            const labelRad = (dir.angle - 90) * (Math.PI / 180);
            const labelX = CENTER + (DIRECTION_RING - 16) * Math.cos(labelRad);
            const labelY = CENTER + (DIRECTION_RING - 16) * Math.sin(labelRad);

            // Get luck color override if applicable
            const dirLuck = directionLuckMap.get(dir.name);
            const labelColor = dirLuck && dirLuck.luck !== 'binh_thuong'
              ? DirectionCalculator.getLuckColor(dirLuck.luck)
              : dir.color;

            // Use smaller font for intercardinal directions (2 characters)
            const isIntercardinal = dir.label.length === 2;
            const fontSize = isIntercardinal ? 10 : 12;

            // Text rotates to radiate outward from center
            return (
              <G key={`dir-${i}`}>
                {/* Sector divider */}
                <Line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={colors.neutral[300]}
                  strokeWidth={1}
                />
                {/* Direction label - radiates outward from center */}
                <SvgText
                  x={labelX}
                  y={labelY + 4}
                  fill={labelColor}
                  fontSize={fontSize}
                  fontWeight="bold"
                  textAnchor="middle"
                  transform={`rotate(${dir.angle}, ${labelX}, ${labelY + 4})`}
                >
                  {dir.label}
                </SvgText>
              </G>
            );
          })}

          {/* Trigram ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={TRIGRAM_RING}
            stroke={colors.neutral[300]}
            strokeWidth={1}
            fill="none"
          />

          {/* Trigram symbols */}
          {DIRECTIONS.map((dir, i) => {
            const rad = (dir.angle - 90) * (Math.PI / 180);
            const x = CENTER + (TRIGRAM_RING - 15) * Math.cos(rad);
            const y = CENTER + (TRIGRAM_RING - 15) * Math.sin(rad);

            return (
              <SvgText
                key={`trigram-${i}`}
                x={x}
                y={y + 6}
                fill={dir.color}
                fontSize={16}
                textAnchor="middle"
              >
                {dir.trigram}
              </SvgText>
            );
          })}

          {/* Element ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={ELEMENT_RING}
            stroke={colors.neutral[300]}
            strokeWidth={1}
            fill="none"
          />

          {/* Element indicators */}
          {DIRECTIONS.map((dir, i) => {
            const rad = (dir.angle - 90) * (Math.PI / 180);
            const x = CENTER + (ELEMENT_RING - 15) * Math.cos(rad);
            const y = CENTER + (ELEMENT_RING - 15) * Math.sin(rad);

            return (
              <Circle
                key={`element-${i}`}
                cx={x}
                cy={y}
                r={8}
                fill={dir.color}
                opacity={0.6}
              />
            );
          })}

          {/* Inner ring (Yin-Yang area) */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RING}
            stroke={colors.neutral[400]}
            strokeWidth={2}
            fill="#FFFFFF"
          />

          {/* Yin-Yang symbol (simplified) */}
          <Circle cx={CENTER} cy={CENTER} r={20} fill={colors.neutral[800]} />
          <Path
            d={`M ${CENTER} ${CENTER - 20} A 20 20 0 0 1 ${CENTER} ${CENTER + 20} A 10 10 0 0 0 ${CENTER} ${CENTER} A 10 10 0 0 1 ${CENTER} ${CENTER - 20}`}
            fill="#FFFFFF"
          />
          <Circle cx={CENTER} cy={CENTER - 10} r={3} fill={colors.neutral[800]} />
          <Circle cx={CENTER} cy={CENTER + 10} r={3} fill="#FFFFFF" />
        </Svg>
      </Animated.View>

      {/* Fixed needle - Red points DOWN (South) following Vietnamese/Chinese compass tradition */}
      <View style={styles.needleContainer} pointerEvents="none">
        <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}>
          {/* South pointer (red) - points down, indicates magnetic south */}
          <Polygon
            points={`${CENTER},${CENTER + NEEDLE_LENGTH} ${CENTER - 10},${CENTER} ${CENTER + 10},${CENTER}`}
            fill={ELEMENT_COLORS.hoa}
          />
          {/* North pointer (white) - points up */}
          <Polygon
            points={`${CENTER},${CENTER - NEEDLE_LENGTH} ${CENTER - 10},${CENTER} ${CENTER + 10},${CENTER}`}
            fill="#FFFFFF"
            stroke={colors.neutral[400]}
            strokeWidth={1}
          />
          {/* Center dot */}
          <Circle cx={CENTER} cy={CENTER} r={6} fill={colors.neutral[800]} />
        </Svg>
      </View>

      {/* Fixed pointer indicator at top */}
      <View style={styles.pointerContainer} pointerEvents="none">
        <View style={styles.pointer} />
      </View>

      {/* Heading readout with luck indicator */}
      <View style={styles.readout}>
        <View style={[
          styles.elementBadge,
          { backgroundColor: currentLuck ? DirectionCalculator.getLuckColor(currentLuck.luck) : currentDirection.color }
        ]}>
          <Text style={styles.elementBadgeText}>{currentDirection.trigram}</Text>
        </View>
        <View style={styles.readoutInfo}>
          <Text style={styles.readoutHeading}>
            {heading !== null ? `${Math.round(heading)}°` : '--°'}
          </Text>
          <Text style={[
            styles.readoutDirection,
            { color: currentLuck ? DirectionCalculator.getLuckColor(currentLuck.luck) : currentDirection.color }
          ]}>
            {currentDirection.name}
            {currentLuck && currentLuck.luck !== 'binh_thuong' && (
              <Text style={styles.luckIndicator}> ({DirectionCalculator.getLuckLabel(currentLuck.luck)})</Text>
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  compassWrapper: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
  },
  needleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
  },
  pointerContainer: {
    position: 'absolute',
    top: -8,
    alignItems: 'center',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary[600],
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  elementBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  elementBadgeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  readoutInfo: {
    alignItems: 'flex-start',
  },
  readoutHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  readoutDirection: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  luckIndicator: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[800],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
});
