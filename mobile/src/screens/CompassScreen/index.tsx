import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme';
import { useCompass } from '../../hooks/useCompass';
import { CompassModeToggle } from './CompassModeToggle';
import { StandardCompass } from './StandardCompass';
import { FengShuiCompass } from './FengShuiCompass';
import { FengShuiInfoPanel } from './FengShuiInfoPanel';

export type CompassMode = 'standard' | 'fengshui';

export function CompassScreen() {
  const [mode, setMode] = useState<CompassMode>('standard');

  // Get compass data at parent level to share with children
  const { heading, isAvailable, error } = useCompass();

  const handleModeChange = useCallback((newMode: CompassMode) => {
    setMode(newMode);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Decorative blur circles */}
      <View style={styles.blurCircle1} />
      <View style={styles.blurCircle2} />

      {mode === 'standard' ? (
        // Standard compass - centered layout
        <View style={styles.content}>
          <CompassModeToggle mode={mode} onModeChange={handleModeChange} />
          <View style={styles.compassContainerStandard}>
            <StandardCompass
              heading={heading}
              isAvailable={isAvailable}
              error={error}
              onSwitchToFengShui={() => setMode('fengshui')}
            />
          </View>
        </View>
      ) : (
        // Feng Shui mode - scrollable layout with compass at top
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CompassModeToggle mode={mode} onModeChange={handleModeChange} />

          {/* Compass Display - fixed at top */}
          <View style={styles.compassContainerFengShui}>
            <FengShuiCompass
              heading={heading}
              isAvailable={isAvailable}
              error={error}
            />
          </View>

          {/* Info Panel */}
          <FengShuiInfoPanel
            heading={heading}
            isCompassAvailable={isAvailable}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // slate-50
  },
  blurCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(5, 150, 105, 0.08)', // emerald tint
    top: -50,
    left: -100,
  },
  blurCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(234, 179, 8, 0.06)', // gold tint
    bottom: 100,
    right: -80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  compassContainerStandard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassContainerFengShui: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
});
