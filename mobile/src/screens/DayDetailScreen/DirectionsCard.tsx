/**
 * DirectionsCard.tsx
 * Displays good and bad directions (Hỷ thần, Tài thần, Hắc thần)
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import type { DayFengShuiData } from '../../data/types/FengShuiData';

interface DirectionsCardProps {
  data: DayFengShuiData;
}

// Map direction names to colors and icons
const DIRECTION_CONFIG: Record<string, { color: string; icon: string }> = {
  'Hỷ thần': { color: '#10b981', icon: 'emoticon-happy-outline' },
  'Tài thần': { color: '#eab308', icon: 'currency-usd' },
  'Hắc thần': { color: '#ef4444', icon: 'alert-circle-outline' },
};

export function DirectionsCard({ data }: DirectionsCardProps) {
  if (!data.dir || data.dir.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon name="compass-outline" size={24} color="#3b82f6" style={styles.cardTitleIcon} />
        <Text style={styles.cardTitle}>Hướng</Text>
      </View>

      {data.dir.map((direction, index) => {
        const config = DIRECTION_CONFIG[direction.n] || { color: '#6b7280', icon: 'compass' };
        const isLast = index === data.dir.length - 1;

        return (
          <View key={index} style={[styles.directionRow, isLast && styles.directionRowLast]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Icon name={config.icon} size={20} color={config.color} style={{ marginRight: 8 }} />
              <Text style={styles.directionName}>{direction.n}</Text>
            </View>
            <View style={styles.directionBadge}>
              <Text style={[styles.directionValue, { color: config.color }]}>
                {direction.d}
              </Text>
              <Icon
                name="navigation"
                size={20}
                color={config.color}
                style={styles.directionIcon}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
