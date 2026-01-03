/**
 * useReducedMotion hook
 * Detects if the user has enabled "Reduce Motion" in system accessibility settings
 * Returns true if animations should be reduced/disabled
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    // Check initial value
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotionEnabled(enabled);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotionEnabled(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotionEnabled;
}

/**
 * Get animation duration based on reduced motion preference
 * @param normalDuration - Duration in ms when animations are enabled
 * @param reducedDuration - Duration in ms when reduce motion is enabled (default: 0)
 */
export function getAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0,
  reduceMotionEnabled: boolean
): number {
  return reduceMotionEnabled ? reducedDuration : normalDuration;
}
