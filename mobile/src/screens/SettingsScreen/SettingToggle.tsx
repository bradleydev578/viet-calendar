/**
 * SettingToggle.tsx
 * Toggle switch setting row
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

interface SettingToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconName: string;
  iconColor: string;
  isLast?: boolean;
}

export function SettingToggle({
  label,
  description,
  value,
  onValueChange,
  iconName,
  iconColor,
  isLast = false,
}: SettingToggleProps) {
  return (
    <View style={[styles.settingRow, isLast && styles.settingRowLast]}>
      {/* Icon */}
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}20` }]}>
        <Icon name={iconName} size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>

      {/* Toggle Switch */}
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
        thumbColor={value ? '#2196F3' : '#f3f4f6'}
      />
    </View>
  );
}
