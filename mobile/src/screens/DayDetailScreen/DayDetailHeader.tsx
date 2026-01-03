/**
 * DayDetailHeader.tsx
 * Header component for Day Detail Screen
 * Displays solar date, lunar date, and Can Chi
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { styles } from './styles';
import type { DayFengShuiData } from '../../data/types/FengShuiData';

interface DayDetailHeaderProps {
  date: Date;
  data: DayFengShuiData;
}

export function DayDetailHeader({ date, data }: DayDetailHeaderProps) {
  const navigation = useNavigation();
  // Format solar date
  const solarDate = format(date, 'EEEE, dd MMMM yyyy', { locale: vi });

  // Format lunar date
  const lunarDate = `Âm lịch: ${data.ld}/${data.lm}/${data.ly}${data.lp === 1 ? ' (nhuận)' : ''}`;

  // Can Chi
  const canChi = `${data.dgz} - ${data.mgz} - ${data.ygz}`;

  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="chevron-left" size={32} color="#fff" />
        <Text style={styles.backButtonText}>Lịch</Text>
      </TouchableOpacity>

      {/* Content */}
      <Text style={styles.solarDateText}>{solarDate}</Text>
      <Text style={styles.lunarDateText}>{lunarDate}</Text>
      <Text style={styles.canChiText}>{canChi}</Text>
      {data.tk && (
        <Text style={styles.canChiText}>Tiết khí: {data.tk}</Text>
      )}
    </View>
  );
}
