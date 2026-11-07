import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CompleteStepProps = {
  onFinish: () => void;
};

export function CompleteStep({ onFinish }: CompleteStepProps) {
  const theme = useTheme();

  return (
    <Screen contentStyle={styles.screen}>
      <View style={[styles.check, { backgroundColor: `${theme.success}20` }]}>
        <ThemedText type="heading" style={{ color: theme.success }}>
          ✓
        </ThemedText>
      </View>
      <View style={styles.copy}>
        <ThemedText type="title">You’re ready</ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          Your space is set up. Start small and build consistency over time.
        </ThemedText>
      </View>
      <Button label="Go to dashboard" onPress={onFinish} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    gap: Spacing.four,
  },
  check: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  copy: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
});
