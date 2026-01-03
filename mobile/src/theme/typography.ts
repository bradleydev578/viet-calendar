import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    lineHeight: 40,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    lineHeight: 32,
  } as TextStyle,

  h3: {
    fontSize: 20,
    fontFamily: fontFamily.semiBold,
    lineHeight: 28,
  } as TextStyle,

  h4: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    lineHeight: 24,
  } as TextStyle,

  // Body
  bodyLarge: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    lineHeight: 20,
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    lineHeight: 16,
  } as TextStyle,

  // Labels
  labelLarge: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    lineHeight: 20,
  } as TextStyle,

  labelMedium: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
    lineHeight: 16,
  } as TextStyle,

  labelSmall: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
    lineHeight: 14,
  } as TextStyle,

  // Day Detail specific
  dayDetail: {
    dayNumber: {
      fontSize: 64,
      fontFamily: fontFamily.bold,
      lineHeight: 70,
    } as TextStyle,

    weekDay: {
      fontSize: 14,
      fontFamily: fontFamily.medium,
      letterSpacing: 2,
    } as TextStyle,

    score: {
      fontSize: 24,
      fontFamily: fontFamily.bold,
    } as TextStyle,

    sectionTitle: {
      fontSize: 16,
      fontFamily: fontFamily.semiBold,
    } as TextStyle,
  },
};
