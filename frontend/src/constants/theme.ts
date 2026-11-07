export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceMuted: '#F1F5F9',
    border: '#E2E8F0',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    error: '#DC2626',
    success: '#16A34A',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: '#0B0F14',
    surface: '#141A21',
    surfaceMuted: '#1C2430',
    border: '#2B3543',
    primary: '#60A5FA',
    primaryText: '#08111F',
    error: '#F87171',
    success: '#4ADE80',
  },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
