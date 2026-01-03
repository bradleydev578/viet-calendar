/**
 * SettingsScreen styles
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

  // Section
  section: {
    backgroundColor: colors.neutral[0],
    marginTop: spacing[4],
    paddingVertical: spacing[2],
  },
  sectionTitle: {
    ...typography.labelSmall,
    color: colors.neutral[600],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Setting Row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
    fontWeight: '500',
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.neutral[600],
    marginTop: spacing[1],
  },
  settingValue: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
    marginLeft: spacing[2],
  },
  chevron: {
    marginLeft: spacing[2],
  },

  // Version
  versionText: {
    ...typography.bodyMedium,
    color: colors.neutral[500],
    textAlign: 'center',
    paddingVertical: spacing[6],
  },

  // Footer
  footer: {
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 20,
  },
});
