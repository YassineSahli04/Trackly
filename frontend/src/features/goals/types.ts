export type GoalFrequency = 'daily' | 'weekly' | 'monthly' | 'once';
export type GoalComparison = 'at_least' | 'at_most' | 'exactly';

export type CreateGoalInput = {
  category_id: string;
  title: string;
  target_value: number;
  unit: string;
  frequency: GoalFrequency;
  comparison: GoalComparison;
};

export type Goal = CreateGoalInput & {
  id: string;
};
