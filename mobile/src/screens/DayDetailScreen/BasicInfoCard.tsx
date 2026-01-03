/**
 * BasicInfoCard.tsx
 * Displays basic feng shui information: 28 Sao, 12 Trực, Tiết khí, Ngũ hành
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import type { DayFengShuiData } from '../../data/types/FengShuiData';

interface BasicInfoCardProps {
  data: DayFengShuiData;
}

export function BasicInfoCard({ data }: BasicInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon name="information-outline" size={24} color="#3b82f6" style={styles.cardTitleIcon} />
        <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
      </View>

      {/* 28 Sao */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>28 Sao:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2, justifyContent: 'flex-end' }}>
          <Text style={[styles.infoValue, data.s28g === 1 ? styles.infoValueGood : styles.infoValueBad]}>
            {data.s28}
          </Text>
          <Icon
            name={data.s28g === 1 ? 'check-circle' : 'close-circle'}
            size={20}
            color={data.s28g === 1 ? '#10b981' : '#ef4444'}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>

      {/* 12 Trực */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>12 Trực:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2, justifyContent: 'flex-end' }}>
          <Text style={[styles.infoValue, data.t12g === 1 ? styles.infoValueGood : styles.infoValueBad]}>
            {data.t12}
          </Text>
          <Icon
            name={data.t12g === 1 ? 'check-circle' : 'close-circle'}
            size={20}
            color={data.t12g === 1 ? '#10b981' : '#ef4444'}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Ngũ hành */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Ngũ hành:</Text>
        <Text style={styles.infoValue}>{data.nh}</Text>
      </View>

      {/* Tiết khí (if available) */}
      {data.tk && (
        <View style={[styles.infoRow, styles.infoRowLast]}>
          <Text style={styles.infoLabel}>Tiết khí:</Text>
          <Text style={styles.infoValue}>{data.tk}</Text>
        </View>
      )}
    </View>
  );
}
