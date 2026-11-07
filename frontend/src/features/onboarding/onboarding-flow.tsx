import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import type { Category } from '@/features/categories/types';
import { getOnboardingStatus } from '@/features/onboarding/api';
import { CategoryStep } from '@/features/onboarding/screens/category-step';
import { CompleteStep } from '@/features/onboarding/screens/complete-step';
import { GoalStep } from '@/features/onboarding/screens/goal-step';
import { WelcomeStep } from '@/features/onboarding/screens/welcome-step';
import type { OnboardingStep } from '@/features/onboarding/types';
import { useTheme } from '@/hooks/use-theme';
import { getApiErrorMessage } from '@/lib/api-client';

type FlowState = 'loading' | 'error' | OnboardingStep | 'done' | 'complete';

type OnboardingFlowProps = PropsWithChildren<{
  onSignOut: () => Promise<void>;
}>;

export function OnboardingFlow({ children, onSignOut }: OnboardingFlowProps) {
  const theme = useTheme();
  const [flowState, setFlowState] = useState<FlowState>('loading');
  const [createdCategories, setCreatedCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadStatus() {
      try {
        const status = await getOnboardingStatus();
        if (!isCurrent) return;

        setFlowState(status.completed ? 'complete' : status.current_step);
      } catch (error) {
        if (!isCurrent) return;

        setMessage(getApiErrorMessage(error));
        setFlowState('error');
      }
    }

    void loadStatus();

    return () => {
      isCurrent = false;
    };
  }, [loadAttempt]);

  function retry() {
    setMessage(null);
    setFlowState('loading');
    setLoadAttempt((current) => current + 1);
  }

  if (flowState === 'loading') {
    return (
      <Screen contentStyle={styles.centered} scroll={false}>
        <ActivityIndicator color={theme.primary} />
      </Screen>
    );
  }

  if (flowState === 'error') {
    return (
      <Screen contentStyle={styles.centered} scroll={false}>
        <View style={styles.errorCopy}>
          <ThemedText type="heading">Unable to load Trackly</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>{message}</ThemedText>
        </View>
        <View style={styles.actions}>
          <Button label="Try again" onPress={retry} />
          <Button label="Sign out" onPress={onSignOut} variant="ghost" />
        </View>
      </Screen>
    );
  }

  if (flowState === 'welcome') {
    return <WelcomeStep onContinue={() => setFlowState('categories')} />;
  }

  if (flowState === 'categories') {
    return (
      <CategoryStep
        onContinue={(categories) => {
          setCreatedCategories(categories);
          setFlowState('goal');
        }}
      />
    );
  }

  if (flowState === 'goal') {
    return (
      <GoalStep
        initialCategories={createdCategories}
        onComplete={() => setFlowState('done')}
      />
    );
  }

  if (flowState === 'done') {
    return <CompleteStep onFinish={() => setFlowState('complete')} />;
  }

  return children;
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    gap: Spacing.four,
  },
  errorCopy: {
    gap: Spacing.two,
  },
  actions: {
    gap: Spacing.two,
  },
});
