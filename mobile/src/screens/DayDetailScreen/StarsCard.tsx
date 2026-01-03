/**
 * StarsCard.tsx
 * Displays good and bad stars for the day
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import type { DayFengShuiData } from '../../data/types/FengShuiData';

interface StarsCardProps {
  data: DayFengShuiData;
}

export function StarsCard({ data }: StarsCardProps) {
  const hasGoodStars = data.gs && data.gs.length > 0;
  const hasBadStars = data.bs && data.bs.length > 0;

  if (!hasGoodStars && !hasBadStars) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon name="star-outline" size={24} color="#3b82f6" style={styles.cardTitleIcon} />
        <Text style={styles.cardTitle}>Sao</Text>
      </View>

      {/* Good Stars */}
      {hasGoodStars && (
        <View style={styles.starsSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="star" size={20} color="#10b981" style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: '#10b981' }]}>Sao tốt</Text>
          </View>
          <View style={styles.starsList}>
            {data.gs.map((star, index) => (
              <View key={index} style={[styles.starChip, styles.starChipGood]}>
                <Text style={[styles.starText, styles.starTextGood]}>{star}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bad Stars */}
      {hasBadStars && (
        <View style={[styles.starsSection, { marginBottom: 0 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="star-off" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Sao xấu</Text>
          </View>
          <View style={styles.starsList}>
            {data.bs.map((star, index) => (
              <View key={index} style={[styles.starChip, styles.starChipBad]}>
                <Text style={[styles.starText, styles.starTextBad]}>{star}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
