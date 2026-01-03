/**
 * HolidayItem.tsx
 * Individual holiday row component
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Holiday } from '../../data/types/HolidayData';
import { HolidayService } from '../../data/services/HolidayService';
import { styles } from './styles';

interface HolidayItemProps {
  holiday: Holiday;
  onPress: (holiday: Holiday) => void;
}

export function HolidayItem({ holiday, onPress }: HolidayItemProps) {
  const iconName = HolidayService.getHolidayIcon(holiday.type);
  const iconColor = HolidayService.getHolidayColor(holiday.type, holiday.isImportant);

  // Format date
  const date = new Date(holiday.date);
  const dateText = format(date, 'EEEE, dd/MM/yyyy', { locale: vi });

  return (
    <TouchableOpacity
      style={styles.holidayItem}
      onPress={() => onPress(holiday)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.holidayIcon, { backgroundColor: `${iconColor}20` }]}>
        <Icon name={iconName} size={24} color={iconColor} />
      </View>

      {/* Content */}
      <View style={styles.holidayContent}>
        <Text style={[styles.holidayName, holiday.isImportant && styles.holidayNameImportant]}>
          {holiday.name}
          {holiday.isImportant && ' ⭐'}
        </Text>
        <Text style={styles.holidayDate}>{dateText}</Text>
        {holiday.description && (
          <Text style={styles.holidayDescription}>{holiday.description}</Text>
        )}
      </View>

      {/* Chevron */}
      <Icon name="chevron-right" size={24} color="#9E9E9E" style={styles.chevronIcon} />
    </TouchableOpacity>
  );
}
