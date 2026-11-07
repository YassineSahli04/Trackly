import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'heading' | 'caption' | 'label';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme.text }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 400,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 42,
    letterSpacing: -0.8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 20,
  },
});
