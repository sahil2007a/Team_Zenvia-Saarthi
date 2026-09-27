// SAARTHI Design System — Colors
// PRD §29: Deep Navy primary, Warm Gold secondary, Warm Ivory background
// Premium Indian heritage + modern AI visual direction

export const Colors = {
  // Direct Top-Level Design System Tokens
  primary: '#1B2838', // Deep Navy
  primaryLight: '#2C3E50',
  primaryDark: '#0F1923',
  primaryMuted: '#34495E',

  secondary: '#C4963C', // Warm Gold
  secondaryLight: '#D4A84E',
  secondaryDark: '#A67C2E',
  sand: '#D4B896',
  sandLight: '#E8D5BE',

  accent: '#E36414', // Warm Terracotta Ochre

  background: '#FAF7F2', // Warm Ivory
  surface: '#FFFFFF',
  surfaceVariant: '#F5F0E8', // Warm Sandstone Cream
  white: '#FFFFFF',

  textPrimary: '#1B2838',
  textSecondary: '#5A6978',
  textTertiary: '#8B95A1',
  textInverse: '#FFFFFF',

  border: '#E5E1D8',
  borderLight: '#F0ECE3',
  divider: '#EBE7DF',

  success: '#2D7D46',
  warning: '#D4963C',
  error: '#C2432D',
  info: '#2563EB',

  // Provenance Label Badges (PRD §16)
  provenance: {
    verifiedFact: '#2D7D46',
    verifiedFactBg: '#E8F5EC',
    archaeologicalEvidence: '#1B6B93',
    archaeologicalEvidenceBg: '#E3F2FD',
    localTradition: '#D4963C',
    localTraditionBg: '#FFF8EB',
    interpretation: '#8B5CF6',
    interpretationBg: '#F3E8FF',
    original: '#2563EB',
    originalBg: '#EFF6FF',
    restored: '#0D9488',
    restoredBg: '#CCFBF1',
    reconstructed: '#D97706',
    reconstructedBg: '#FEF3C7',
  },

  // Legacy Nested Maps for backwards compatibility
  nested: {
    primary: {
      navy: '#1B2838',
      navyLight: '#2C3E50',
      navyDark: '#0F1923',
      navyMuted: '#34495E',
    },
    secondary: {
      gold: '#C4963C',
      goldLight: '#D4A84E',
      goldDark: '#A67C2E',
      sand: '#D4B896',
      sandLight: '#E8D5BE',
    },
    background: {
      ivory: '#FAF7F2',
      white: '#FFFFFF',
      cream: '#F5F0E8',
      warmGray: '#F0ECE3',
      card: '#FFFFFF',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#1B2838',
      secondary: '#5A6978',
      tertiary: '#8B95A1',
      inverse: '#FFFFFF',
      muted: '#9CA3AF',
      link: '#2563EB',
    },
    status: {
      verified: '#2D7D46',
      verifiedBg: '#E8F5EC',
      alert: '#C2432D',
      alertBg: '#FDECEA',
      warning: '#D4963C',
      warningBg: '#FFF8EB',
      info: '#2563EB',
      infoBg: '#EBF2FF',
    },
    ai: {
      purple: '#6B5CE7',
      purpleLight: '#8B7CF0',
      purpleBg: '#F0EEFF',
      purpleMuted: '#9B8FEA',
    },
    heritage: {
      unesco: '#1B6B93',
      unescoBg: '#E3F2FD',
      asi: '#7B5E3B',
      asiBg: '#F5EDE3',
    },
    ui: {
      border: '#E5E1D8',
      borderLight: '#F0ECE3',
      divider: '#EBE7DF',
      shadow: 'rgba(27, 40, 56, 0.08)',
      shadowDark: 'rgba(27, 40, 56, 0.15)',
      overlay: 'rgba(27, 40, 56, 0.5)',
      disabled: '#C9CDD3',
      disabledBg: '#F5F3EF',
    },
    crowd: {
      low: '#2D7D46',
      moderate: '#D4963C',
      high: '#C2432D',
      unknown: '#8B95A1',
    },
    tabBar: {
      active: '#C4963C',
      inactive: '#8B95A1',
      background: '#FFFFFF',
      border: '#E5E1D8',
    },
  },
} as const;

export const HighContrastColors = {
  text: {
    primary: '#000000',
    secondary: '#333333',
    tertiary: '#555555',
  },
  ui: {
    border: '#666666',
    divider: '#999999',
  },
  background: {
    ivory: '#FFFFFF',
    cream: '#F5F5F5',
  },
} as const;

export default Colors;
