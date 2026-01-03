import { useState, useEffect } from 'react';
import CompassHeading from 'react-native-compass-heading';

interface CompassData {
  heading: number | null;
  isAvailable: boolean;
  error: string | null;
}

/**
 * Custom hook for compass functionality
 * Uses react-native-compass-heading which provides accurate heading
 * directly from iOS CLLocationManager (same as native Compass app)
 */
export function useCompass(): CompassData {
  const [heading, setHeading] = useState<number | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initCompass = () => {
      // Degree update rate (1 = update every 1 degree change)
      const degreeUpdateRate = 1;

      CompassHeading.start(degreeUpdateRate, ({ heading: newHeading, accuracy }) => {
        if (!isMounted) return;

        // heading is already in degrees (0-360), same as iOS Compass app
        // 0° = North, 90° = East, 180° = South, 270° = West
        setHeading(newHeading);
        setError(null);
      });
    };

    try {
      initCompass();
    } catch (err) {
      if (!isMounted) return;
      console.warn('Compass initialization failed:', err);
      setIsAvailable(false);
      setError('Thiết bị không hỗ trợ la bàn');
    }

    return () => {
      isMounted = false;
      CompassHeading.stop();
    };
  }, []);

  return { heading, isAvailable, error };
}
