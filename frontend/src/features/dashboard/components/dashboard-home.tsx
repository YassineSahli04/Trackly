import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DashboardHomeProps = {
  displayName: string;
  onSignOut: () => Promise<void>;
};

export function DashboardHome({ displayName, onSignOut }: DashboardHomeProps) {
  const theme = useTheme();

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          WELCOME BACK
        </ThemedText>
        <ThemedText type="title">Hi, {displayName}</ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          Your dashboard is ready for the next feature.
        </ThemedText>
      </View>
      <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <ThemedText type="heading">Start tracking</ThemedText>
        <ThemedText style={{ color: theme.textSecondary }}>
          Your goals and daily progress will appear here.
        </ThemedText>
      </View>
      <Button label="Sign out" onPress={onSignOut} variant="ghost" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.two,
  },
  emptyCard: {
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.four,
  },
});
