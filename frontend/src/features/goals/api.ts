import type { CreateGoalInput, Goal } from '@/features/goals/types';
import { apiRequest } from '@/lib/api-client';

export function createGoal(input: CreateGoalInput) {
  return apiRequest<Goal>('/api/v1/goals', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
