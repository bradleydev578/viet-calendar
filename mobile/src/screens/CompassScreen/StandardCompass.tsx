import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Text as SvgText, G, Polygon } from 'react-native-svg';

import { colors } from '../../theme';

const COMPASS_SIZE = 280;
const CENTER = COMPASS_SIZE / 2;
const OUTER_RADIUS = 130;
const INNER_RADIUS = 110;
const NEEDLE_LENGTH = 80;

// Cardinal direction colors
const DIRECTION_COLORS = {
  N: '#DC2626', // Red
  S: '#059669', // Emerald
  E: '#0284C7', // Sky Blue
  W: '#D97706', // Amber
};

// Direction names in Vietnamese
const DIRECTION_NAMES: Record<string, string> = {
  N: 'Bắc',
  NE: 'Đông Bắc',
  E: 'Đông',
  SE: 'Đông Nam',
  S: 'Nam',
  SW: 'Tây Nam',
  W: 'Tây',
  NW: 'Tây Bắc',
};

function getDirectionFromDegrees(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'N';
  if (normalized >= 22.5 && normalized < 67.5) return 'NE';
  if (normalized >= 67.5 && normalized < 112.5) return 'E';
  if (normalized >= 112.5 && normalized < 157.5) return 'SE';
  if (normalized >= 157.5 && normalized < 202.5) return 'S';
  if (normalized >= 202.5 && normalized < 247.5) return 'SW';
  if (normalized >= 247.5 && normalized < 292.5) return 'W';
  return 'NW';
}

interface StandardCompassProps {
  heading: number | null;
  isAvailable: boolean;
  error: string | null;
  onSwitchToFengShui?: () => void;
}

export function StandardCompass({
  heading,
  isAvailable,
  error,
  onSwitchToFengShui,
}: StandardCompassProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (heading !== null) {
      // Rotate compass dial opposite to heading so North always points up relative to device
      rotation.value = withSpring(-heading, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [heading, rotation]);

  const compassStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Calculate direction before any early returns
  const currentDirection = heading !== null ? getDirectionFromDegrees(heading) : 'N';
  const directionName = DIRECTION_NAMES[currentDirection];

  if (!isAvailable) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🧭</Text>
        <Text style={styles.emptyTitle}>Thiết bị không hỗ trợ la bàn</Text>
        <Text style={styles.emptyMessage}>
          Vui lòng chuyển sang chế độ "Phong Thủy" để xem hướng tốt trong ngày
        </Text>
        {onSwitchToFengShui && (
          <TouchableOpacity
            style={styles.switchButton}
            onPress={onSwitchToFengShui}
            accessibilityLabel="Chuyển sang chế độ Phong Thủy"
            accessibilityRole="button"
          >
            <Text style={styles.switchButtonText}>Xem Phong Thủy</Text>
          </TouchableOpacity>
        )}
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
      accessibilityLabel={`La bàn, hướng hiện tại: ${heading !== null ? Math.round(heading) : '--'} độ, ${directionName}`}
    >
      {/* Compass dial */}
      <Animated.View style={[styles.compassWrapper, compassStyle]}>
        <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}>
          {/* Outer ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            stroke={colors.primary[600]}
            strokeWidth={4}
            fill="white"
          />

          {/* Inner ring */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            stroke={colors.neutral[300]}
            strokeWidth={1}
            fill="none"
          />

          {/* Degree markers */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i * 10;
            const isCardinal = angle % 90 === 0;
            const isIntercardinal = angle % 45 === 0 && !isCardinal;
            const lineLength = isCardinal ? 15 : isIntercardinal ? 10 : 5;
            const rad = (angle - 90) * (Math.PI / 180);
            const x1 = CENTER + (OUTER_RADIUS - lineLength) * Math.cos(rad);
            const y1 = CENTER + (OUTER_RADIUS - lineLength) * Math.sin(rad);
            const x2 = CENTER + (OUTER_RADIUS - 4) * Math.cos(rad);
            const y2 = CENTER + (OUTER_RADIUS - 4) * Math.sin(rad);

            return (
              <Line
                key={`marker-${angle}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isCardinal ? colors.neutral[800] : colors.neutral[400]}
                strokeWidth={isCardinal ? 2 : 1}
              />
            );
          })}

          {/* Cardinal direction labels - Full Vietnamese names */}
          {[
            { label: 'N', labelVi: 'Bắc', angle: 0, color: DIRECTION_COLORS.N },
            { label: 'E', labelVi: 'Đông', angle: 90, color: DIRECTION_COLORS.E },
            { label: 'S', labelVi: 'Nam', angle: 180, color: DIRECTION_COLORS.S },
            { label: 'W', labelVi: 'Tây', angle: 270, color: DIRECTION_COLORS.W },
          ].map(({ label, labelVi, angle, color }) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = CENTER + (INNER_RADIUS - 25) * Math.cos(rad);
            const y = CENTER + (INNER_RADIUS - 25) * Math.sin(rad);

            // Text rotates to radiate outward from center
            return (
              <SvgText
                key={label}
                x={x}
                y={y + 6}
                fill={color}
                fontSize={14}
                fontWeight="bold"
                textAnchor="middle"
                transform={`rotate(${angle}, ${x}, ${y + 6})`}
              >
                {labelVi}
              </SvgText>
            );
          })}

          {/* Center circle */}
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={8}
            fill={colors.primary[600]}
          />
        </Svg>
      </Animated.View>

      {/* Fixed needle pointing down (South indicator) - Vietnamese/Chinese tradition */}
      <View style={styles.needleContainer} pointerEvents="none">
        <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox={`0 0 ${COMPASS_SIZE} ${COMPASS_SIZE}`}>
          {/* South pointer (red) - points down following Vietnamese/Chinese compass tradition */}
          <Polygon
            points={`${CENTER},${CENTER + NEEDLE_LENGTH} ${CENTER - 10},${CENTER} ${CENTER + 10},${CENTER}`}
            fill={DIRECTION_COLORS.S}
          />
          {/* North pointer (white) - points up */}
          <Polygon
            points={`${CENTER},${CENTER - NEEDLE_LENGTH} ${CENTER - 10},${CENTER} ${CENTER + 10},${CENTER}`}
            fill="#FFFFFF"
            stroke={colors.neutral[300]}
            strokeWidth={1}
          />
          {/* Center dot */}
          <Circle cx={CENTER} cy={CENTER} r={6} fill={colors.neutral[800]} />
        </Svg>
      </View>

      {/* Heading readout */}
      <View style={styles.readout}>
        <Text style={styles.readoutText}>
          Hướng: {heading !== null ? `${Math.round(heading)}°` : '--°'} - {directionName}
        </Text>
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
  readout: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  readoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral[800],
    textAlign: 'center',
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
  switchButton: {
    marginTop: 20,
    backgroundColor: colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
