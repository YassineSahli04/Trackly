export type OnboardingStep = 'welcome' | 'categories' | 'goal';

export type OnboardingStatus = {
  completed: boolean;
  current_step: OnboardingStep;
};
