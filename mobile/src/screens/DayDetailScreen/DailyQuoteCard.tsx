/**
 * DailyQuoteCard
 * Shows daily inspirational quote for the viewed date
 * Story 5.11
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../theme';
import { QuoteService } from '../../core/quotes';

interface DailyQuoteCardProps {
  date: Date;
}

export function DailyQuoteCard({ date }: DailyQuoteCardProps) {
  const quote = QuoteService.getQuoteForDate(date);

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>"{quote}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary[500],
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.neutral[800], // Changed from [700] for better contrast on primary[50]
    lineHeight: 22,
  },
});
