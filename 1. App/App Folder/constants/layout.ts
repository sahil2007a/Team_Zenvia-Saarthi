// SAARTHI Design System — Spacing & Layout

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  giant: 64,
  cardPadding: 16,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
} as const;

export const Layout = {
  screenPadding: Spacing.lg,
  cardPadding: Spacing.lg,
  sectionSpacing: Spacing.xxl,
  listItemSpacing: Spacing.md,
  tabBarHeight: 80,
  headerHeight: 56,
  searchBarHeight: 48,
  buttonHeight: 48,
  buttonHeightSmall: 36,
  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  },
  imageHeight: {
    hero: 240,
    card: 160,
    thumbnail: 80,
  },
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#1B2838',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1B2838',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1B2838',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#1B2838',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;
