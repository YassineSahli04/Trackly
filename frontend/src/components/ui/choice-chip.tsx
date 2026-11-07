import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChoiceChipProps = {
  label: string;
  onPress: () => void;
  selected: boolean;
};

export function ChoiceChip({ label, onPress, selected }: ChoiceChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}>
      <ThemedText
        type="label"
        style={selected ? { color: theme.primaryText } : undefined}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 21,
    paddingHorizontal: Spacing.three,
  },
});
