import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type OnboardingHeaderProps = {
  description: string;
  step: number;
  title: string;
};

export function OnboardingHeader({ description, step, title }: OnboardingHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.progressSegment,
              { backgroundColor: item <= step ? theme.primary : theme.border },
            ]}
          />
        ))}
      </View>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        STEP {step} OF 3
      </ThemedText>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText style={{ color: theme.textSecondary }}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  progress: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});
