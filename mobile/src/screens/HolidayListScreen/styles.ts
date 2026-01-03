/**
 * HolidayListScreen styles
 */

import { StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    marginTop: spacing[4],
  },

  // Section Header (Month)
  sectionHeader: {
    backgroundColor: colors.neutral[100],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  sectionHeaderText: {
    ...typography.h3,
    color: colors.neutral[900],
    fontWeight: '600',
  },

  // Holiday Item
  holidayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[0],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  holidayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[4],
  },
  holidayContent: {
    flex: 1,
  },
  holidayName: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: spacing[1],
  },
  holidayNameImportant: {
    color: colors.semantic.error,
  },
  holidayDate: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  holidayDescription: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    marginTop: spacing[1],
  },
  chevronIcon: {
    marginLeft: spacing[2],
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
  },
  emptyText: {
    ...typography.bodyLarge,
    color: colors.neutral[600],
    textAlign: 'center',
    marginTop: spacing[4],
  },
});
