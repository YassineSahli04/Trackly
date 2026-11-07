import { ActivityIndicator, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { useAuth } from '@/features/auth/auth-context';
import { AuthScreen } from '@/features/auth/components/auth-screen';
import { DashboardHome } from '@/features/dashboard/components/dashboard-home';
import { OnboardingFlow } from '@/features/onboarding/onboarding-flow';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const { isLoading, session, signOut } = useAuth();

  if (isLoading) {
    return (
      <Screen contentStyle={styles.centered} scroll={false}>
        <ActivityIndicator color={theme.primary} />
      </Screen>
    );
  }

  if (!session) return <AuthScreen />;

  const username = session.user.user_metadata.username;
  const displayName = typeof username === 'string' ? username : (session.user.email ?? 'there');

  return (
    <OnboardingFlow onSignOut={signOut}>
      <DashboardHome displayName={displayName} onSignOut={signOut} />
    </OnboardingFlow>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
