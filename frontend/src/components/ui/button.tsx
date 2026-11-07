import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({
  disabled,
  label,
  loading = false,
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => [
        styles.button,
        variant === 'primary' && { backgroundColor: theme.primary },
        variant === 'secondary' && {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        },
        variant === 'ghost' && styles.ghost,
        (state.pressed || isDisabled) && styles.muted,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? theme.primaryText : theme.text} />
      ) : (
        <ThemedText
          type="label"
          style={isPrimary ? { color: theme.primaryText } : undefined}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: Spacing.four,
  },
  ghost: {
    minHeight: 44,
  },
  muted: {
    opacity: 0.55,
  },
});
