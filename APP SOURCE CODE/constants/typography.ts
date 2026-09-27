// SAARTHI Design System — Typography
// Scalable type system supporting Large Text accessibility (TRD §23)

import { Platform } from 'react-native';

const BASE_FONT = Platform.OS === 'ios' ? 'System' : 'Roboto';

let textScale = 1;

export function setTextScale(scale: number) {
  textScale = scale;
}

export function getTextScale() {
  return textScale;
}

export const Typography = {
  // Font Family Tokens (Falls back safely to system typography)
  fonts: {
    sans: BASE_FONT,
    sansMedium: BASE_FONT,
    sansBold: BASE_FONT,
    serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    serifMedium: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    serifSemiBold: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  // Standard Type Scale
  scale: {
    h1: 24,
    h2: 20,
    h3: 18,
    body: 16,
    body2: 14,
    caption: 12,
  },

  // Large Text Accessible Scale (TRD §23)
  largeScale: {
    h1: 28,
    h2: 24,
    h3: 21,
    body: 19,
    body2: 17,
    caption: 14,
  },

  // Display / Hero
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },

  // Headings
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },

  // Labels
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  labelSmall: {
    fontSize: 10,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },

  // Caption
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },

  // Button text
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  buttonSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
};

export default Typography;
