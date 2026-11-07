import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { getCategories } from '@/features/categories/api';
import type { Category } from '@/features/categories/types';
import { createGoal } from '@/features/goals/api';
import type { GoalComparison, GoalFrequency } from '@/features/goals/types';
import { completeOnboarding } from '@/features/onboarding/api';
import { OnboardingHeader } from '@/features/onboarding/components/onboarding-header';
import { useTheme } from '@/hooks/use-theme';
import { getApiErrorMessage } from '@/lib/api-client';

const frequencies: { label: string; value: GoalFrequency }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Once', value: 'once' },
];

const comparisons: { label: string; value: GoalComparison }[] = [
  { label: 'At least', value: 'at_least' },
  { label: 'At most', value: 'at_most' },
  { label: 'Exactly', value: 'exactly' },
];

type GoalStepProps = {
  initialCategories: Category[];
  onComplete: () => void;
};

export function GoalStep({ initialCategories, onComplete }: GoalStepProps) {
  const theme = useTheme();
  const [categories, setCategories] = useState<Category[] | null>(
    initialCategories.length > 0 ? initialCategories : null,
  );
  const [categoryId, setCategoryId] = useState(initialCategories[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [frequency, setFrequency] = useState<GoalFrequency>('daily');
  const [comparison, setComparison] = useState<GoalComparison>('at_least');
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const goalCreated = useRef(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    if (initialCategories.length > 0) return;

    let isCurrent = true;

    async function loadCategories() {
      try {
        const items = await getCategories();
        if (!isCurrent) return;

        setCategories(items);
        setCategoryId(items[0]?.id ?? '');
      } catch (error) {
        if (isCurrent) setMessage(getApiErrorMessage(error));
      }
    }

    void loadCategories();

    return () => {
      isCurrent = false;
    };
  }, [initialCategories.length, loadAttempt]);

  function retry() {
    setCategories(null);
    setMessage(null);
    setLoadAttempt((current) => current + 1);
  }

  async function finishOnboarding() {
    await completeOnboarding();
    onComplete();
  }

  async function submit() {
    const numericTarget = Number(targetValue.replace(',', '.'));

    if (!categoryId || !title.trim() || !unit.trim() || !Number.isFinite(numericTarget)) {
      setMessage('Complete all goal fields.');
      return;
    }

    if (numericTarget <= 0) {
      setMessage('The target must be greater than zero.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      if (!goalCreated.current) {
        await createGoal({
          category_id: categoryId,
          title: title.trim(),
          target_value: numericTarget,
          unit: unit.trim(),
          frequency,
          comparison,
        });
        goalCreated.current = true;
      }

      await finishOnboarding();
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function skip() {
    setIsSaving(true);
    setMessage(null);

    try {
      await finishOnboarding();
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader
        description="Give yourself one clear target. You can skip this and create a goal later."
        step={3}
        title="Create your first goal"
      />

      {!categories ? (
        <View style={styles.loading}>
          {message ? (
            <>
              <ThemedText style={{ color: theme.error }}>{message}</ThemedText>
              <Button label="Try again" onPress={retry} variant="secondary" />
            </>
          ) : (
            <ActivityIndicator color={theme.primary} />
          )}
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <ThemedText type="label">Category</ThemedText>
            <View style={styles.chips}>
              {categories.map((category) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: categoryId === category.id }}
                  key={category.id}
                  onPress={() => setCategoryId(category.id)}
                  style={[
                    styles.category,
                    {
                      backgroundColor:
                        categoryId === category.id ? `${category.color}18` : theme.surface,
                      borderColor: categoryId === category.id ? category.color : theme.border,
                    },
                  ]}>
                  <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                  <ThemedText type="label">{category.name}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <TextField
            label="Goal"
            maxLength={200}
            onChangeText={setTitle}
            placeholder="Read more consistently"
            value={title}
          />

          <View style={styles.row}>
            <View style={styles.rowField}>
              <TextField
                keyboardType="decimal-pad"
                label="Target"
                onChangeText={setTargetValue}
                placeholder="20"
                value={targetValue}
              />
            </View>
            <View style={styles.rowField}>
              <TextField
                label="Unit"
                maxLength={50}
                onChangeText={setUnit}
                placeholder="pages"
                value={unit}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText type="label">Frequency</ThemedText>
            <View style={styles.chips}>
              {frequencies.map((option) => (
                <ChoiceChip
                  key={option.value}
                  label={option.label}
                  onPress={() => setFrequency(option.value)}
                  selected={frequency === option.value}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText type="label">Target type</ThemedText>
            <View style={styles.chips}>
              {comparisons.map((option) => (
                <ChoiceChip
                  key={option.value}
                  label={option.label}
                  onPress={() => setComparison(option.value)}
                  selected={comparison === option.value}
                />
              ))}
            </View>
          </View>

          {message && (
            <ThemedText type="caption" style={{ color: theme.error }}>
              {message}
            </ThemedText>
          )}

          <View style={styles.actions}>
            <Button label="Create goal" loading={isSaving} onPress={submit} />
            <Button disabled={isSaving} label="Skip for now" onPress={skip} variant="ghost" />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: Spacing.five,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  form: {
    gap: Spacing.four,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  category: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
  },
  categoryColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  rowField: {
    flex: 1,
  },
  actions: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
});
