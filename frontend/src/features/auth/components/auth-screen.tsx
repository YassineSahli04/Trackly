import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { AuthForm } from '@/features/auth/components/auth-form';
import { useTheme } from '@/hooks/use-theme';

export function AuthScreen() {
  const theme = useTheme();

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.brand}>
        <View style={[styles.mark, { backgroundColor: theme.primary }]} />
        <ThemedText type="title">Trackly</ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          Turn everyday actions into meaningful progress.
        </ThemedText>
      </View>
      <AuthForm />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    gap: Spacing.five,
  },
  brand: {
    gap: Spacing.two,
  },
  mark: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.two,
  },
});
