/**
 * DayDetailScreen styles
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[16],
  },

  // Header
  header: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[6],
    backgroundColor: colors.secondary[500],
  },
  headerGradient: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[6],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    marginLeft: -spacing[2],
  },
  backButtonText: {
    color: colors.neutral[0],
    fontSize: 17,
    marginLeft: spacing[1],
  },
  solarDateText: {
    ...typography.h1,
    color: colors.neutral[0],
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  lunarDateText: {
    ...typography.bodyLarge,
    color: colors.neutral[0],
    textAlign: 'center',
    opacity: 0.9,
  },
  canChiText: {
    ...typography.bodyMedium,
    color: colors.neutral[0],
    textAlign: 'center',
    marginTop: spacing[2],
    opacity: 0.8,
  },

  // Cards
  card: {
    backgroundColor: colors.neutral[0],
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    borderRadius: 12,
    padding: spacing[4],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.neutral[900],
    marginBottom: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitleIcon: {
    marginRight: spacing[3],
  },

  // Score Card
  scoreCard: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  scoreCircle: {
    marginBottom: spacing[4],
  },
  scoreValue: {
    ...typography.h1,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreLabel: {
    ...typography.h3,
    marginTop: spacing[2],
  },
  starRating: {
    flexDirection: 'row',
    marginTop: spacing[3],
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    flex: 1,
  },
  infoValue: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  infoValueGood: {
    color: colors.semantic.success,
  },
  infoValueBad: {
    color: colors.semantic.error,
  },

  // Hoàng Đạo Hours
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  hourChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    backgroundColor: colors.secondary[50],
    minWidth: 60,
    alignItems: 'center',
  },
  hourText: {
    ...typography.bodyMedium,
    color: colors.secondary[700],
    fontWeight: '600',
  },

  // Activities
  activitiesSection: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing[3],
  },
  activitiesList: {
    gap: spacing[2],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  activityBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing[3],
  },
  activityBulletGood: {
    backgroundColor: colors.semantic.success,
  },
  activityBulletBad: {
    backgroundColor: colors.semantic.error,
  },
  activityText: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
    flex: 1,
  },

  // Directions
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  directionRowLast: {
    borderBottomWidth: 0,
  },
  directionName: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    flex: 1,
  },
  directionValue: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionIcon: {
    marginLeft: spacing[2],
  },

  // Stars
  starsSection: {
    marginBottom: spacing[4],
  },
  starsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  starChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 12,
    borderWidth: 1,
  },
  starChipGood: {
    backgroundColor: colors.dayScore.excellent + '20', // 20% opacity
    borderColor: colors.semantic.success,
  },
  starChipBad: {
    backgroundColor: colors.dayScore.veryBad + '20', // 20% opacity
    borderColor: colors.semantic.error,
  },
  starText: {
    ...typography.labelSmall,
    fontWeight: '500',
  },
  starTextGood: {
    color: colors.semantic.success,
  },
  starTextBad: {
    color: colors.semantic.error,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
  },
});

// Modal-specific styles
export const modalStyles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral[300],
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateHeader: {
    backgroundColor: colors.secondary[500],
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  solarDateText: {
    ...typography.h2,
    color: colors.neutral[0],
    textAlign: 'center',
    marginBottom: 4,
  },
  lunarDateText: {
    ...typography.bodyLarge,
    color: colors.neutral[0],
    textAlign: 'center',
    opacity: 0.9,
  },
  canChiText: {
    ...typography.bodyMedium,
    color: colors.neutral[0],
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
});
