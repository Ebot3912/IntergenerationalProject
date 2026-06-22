export const Colors = {
  primary: '#6B48FF',
  primaryLight: '#8B6FFF',
  primaryDark: '#4A2FCC',
  secondary: '#FF6B6B',
  accent: '#FFD93D',
  accentGreen: '#6BCB77',
  accentBlue: '#4D96FF',
  background: '#F8F4FF',
  cardBg: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textPrimary: '#1A1A2E',    // alias for text
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textTertiary: '#9CA3AF',   // alias for textLight
  border: '#E5E7EB',
  danger: '#EF4444',
  dangerDark: '#DC2626',
  success: '#10B981',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  shadow: 'rgba(107, 72, 255, 0.15)',

  // Game colors
  chessLight: '#F0D9B5',
  chessDark: '#B58863',
  connectFourYellow: '#FFD93D',
  connectFourRed: '#FF6B6B',
  connectFourBlue: '#4D96FF',
  pokerGreen: '#2D6A4F',
  pokerFelt: '#1B4332',

  // Gradient starts/ends
  gradientStart: '#6B48FF',
  gradientEnd: '#FF6B6B',
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 36,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Shadow = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};
