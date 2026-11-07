import type { OnboardingStatus } from '@/features/onboarding/types';
import { apiRequest } from '@/lib/api-client';

export function getOnboardingStatus() {
  return apiRequest<OnboardingStatus>('/api/v1/onboarding');
}

export function completeOnboarding() {
  return apiRequest<{ completed: true }>('/api/v1/onboarding/complete', {
    method: 'POST',
  });
}
