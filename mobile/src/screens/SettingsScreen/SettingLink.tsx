/**
 * SettingLink.tsx
 * Navigable setting row
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';

interface SettingLinkProps {
  label: string;
  description?: string;
  value?: string;
  onPress: () => void;
  iconName: string;
  iconColor: string;
  isLast?: boolean;
}

export function SettingLink({
  label,
  description,
  value,
  onPress,
  iconName,
  iconColor,
  isLast = false,
}: SettingLinkProps) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, isLast && styles.settingRowLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}20` }]}>
        <Icon name={iconName} size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>

      {/* Value (optional) */}
      {value && <Text style={styles.settingValue}>{value}</Text>}

      {/* Chevron */}
      <Icon name="chevron-right" size={24} color="#9E9E9E" style={styles.chevron} />
    </TouchableOpacity>
  );
}
