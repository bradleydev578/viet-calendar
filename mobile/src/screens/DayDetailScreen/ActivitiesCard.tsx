/**
 * ActivitiesCard.tsx
 * Displays good and bad activities for the day
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import type { DayFengShuiData } from '../../data/types/FengShuiData';

interface ActivitiesCardProps {
  data: DayFengShuiData;
}

export function ActivitiesCard({ data }: ActivitiesCardProps) {
  const hasGoodActivities = data.ga && data.ga.length > 0;
  const hasBadActivities = data.ba && data.ba.length > 0;

  if (!hasGoodActivities && !hasBadActivities) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Icon name="calendar-check" size={24} color="#3b82f6" style={styles.cardTitleIcon} />
        <Text style={styles.cardTitle}>Hoạt động</Text>
      </View>

      {/* Good Activities */}
      {hasGoodActivities && (
        <View style={styles.activitiesSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="check-circle" size={20} color="#10b981" style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: '#10b981' }]}>Nên làm</Text>
          </View>
          <View style={styles.activitiesList}>
            {data.ga.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityBullet, styles.activityBulletGood]} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bad Activities */}
      {hasBadActivities && (
        <View style={[styles.activitiesSection, { marginBottom: 0 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="close-circle" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Không nên làm</Text>
          </View>
          <View style={styles.activitiesList}>
            {data.ba.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[styles.activityBullet, styles.activityBulletBad]} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
