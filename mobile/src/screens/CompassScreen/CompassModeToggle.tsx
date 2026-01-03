import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { colors } from '../../theme';
import type { CompassMode } from './index';

interface CompassModeToggleProps {
  mode: CompassMode;
  onModeChange: (mode: CompassMode) => void;
}

export function CompassModeToggle({ mode, onModeChange }: CompassModeToggleProps) {
  const isStandard = mode === 'standard';

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(isStandard ? 0 : 1, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
      left: withTiming(isStandard ? 4 : '50%', {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }),
    };
  }, [isStandard]);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        {/* Animated indicator */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {/* Standard option */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => onModeChange('standard')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: isStandard }}
          accessibilityLabel="La Bàn Thường"
        >
          <Text style={[styles.optionText, isStandard && styles.optionTextActive]}>
            La Bàn Thường
          </Text>
        </TouchableOpacity>

        {/* Feng Shui option */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => onModeChange('fengshui')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: !isStandard }}
          accessibilityLabel="Phong Thủy"
        >
          <Text style={[styles.optionText, !isStandard && styles.optionTextActive]}>
            Phong Thủy
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: 20,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '48%',
    backgroundColor: colors.primary[600],
    borderRadius: 16,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
