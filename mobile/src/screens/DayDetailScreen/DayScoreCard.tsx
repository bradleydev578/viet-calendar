/**
 * DayScoreCard.tsx
 * Displays the day's feng shui score with visual indicators
 */

import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { DayScore } from '../../core/fengshui/DayScore';
import type { DayScore as DayScoreResult } from '../../data/types/FengShuiData';

interface DayScoreCardProps {
  score: DayScoreResult;
}

export function DayScoreCard({ score }: DayScoreCardProps) {
  const color = DayScore.getQualityColor(score.quality);
  const label = DayScore.getQualityLabel(score.quality);
  const stars = DayScore.getStarRating(score.quality);

  return (
    <View style={styles.card}>
      <View style={styles.scoreCard}>
        {/* Score Circle - Simple text for now, can be enhanced with circular progress later */}
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color }]}>
            {Math.round(score.score)}
          </Text>
          <Text style={styles.scoreLabel}>{label}</Text>
        </View>

        {/* Star Rating */}
        <View style={styles.starRating}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Icon
              key={index}
              name={index < stars ? 'star' : 'star-outline'}
              size={24}
              color={index < stars ? color : '#d1d5db'}
              style={{ marginHorizontal: 2 }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
