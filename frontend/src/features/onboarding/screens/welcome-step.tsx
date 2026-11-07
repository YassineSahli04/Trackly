import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { OnboardingHeader } from '@/features/onboarding/components/onboarding-header';

type WelcomeStepProps = {
  onContinue: () => void;
};

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader
        description="Set up the areas you care about and turn one intention into a clear goal."
        step={1}
        title="Welcome to Trackly"
      />
      <View style={styles.footer}>
        <Button label="Get started" onPress={onContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    gap: Spacing.six,
  },
  footer: {
    paddingTop: Spacing.four,
  },
});
