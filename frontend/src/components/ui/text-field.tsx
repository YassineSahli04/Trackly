import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextFieldProps = TextInputProps & {
  error?: string;
  label: string;
};

export function TextField({ error, label, style, ...props }: TextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="label">{label}</ThemedText>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.error : theme.border,
            color: theme.text,
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <ThemedText type="caption" style={{ color: theme.error }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 16,
  },
});
