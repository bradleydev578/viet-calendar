/**
 * HoangDaoCard.tsx
 * Displays auspicious hours (Hoàng đạo giờ)
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import type { DayFengShuiData } from '../../data/types/FengShuiData';

interface HoangDaoCardProps {
  data: DayFengShuiData;
}

// Map Chi hours to time ranges
const CHI_HOURS: Record<string, string> = {
  'Tý': '23:00-01:00',
  'Sửu': '01:00-03:00',
  'Dần': '03:00-05:00',
  'Mão': '05:00-07:00',
  'Thìn': '07:00-09:00',
  'Tỵ': '09:00-11:00',
  'Ngọ': '11:00-13:00',
  'Mùi': '13:00-15:00',
  'Thân': '15:00-17:00',
  'Dậu': '17:00-19:00',
  'Tuất': '19:00-21:00',
  'Hợi': '21:00-23:00',
};

export function HoangDaoCard({ data }: HoangDaoCardProps) {
  if (!data.hd || data.hd.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon name="clock-outline" size={24} color="#3b82f6" style={styles.cardTitleIcon} />
        <Text style={styles.cardTitle}>Hoàng đạo giờ</Text>
      </View>

      <View style={styles.hoursGrid}>
        {data.hd.map((hour, index) => (
          <View key={index} style={styles.hourChip}>
            <Text style={styles.hourText}>{hour}</Text>
            <Text style={[styles.hourText, { fontSize: 10, marginTop: 2 }]}>
              {CHI_HOURS[hour] || ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
