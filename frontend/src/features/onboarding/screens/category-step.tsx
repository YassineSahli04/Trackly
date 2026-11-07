import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { createCategories, getCategoryTemplates } from '@/features/categories/api';
import type { Category, CategoryTemplate } from '@/features/categories/types';
import { OnboardingHeader } from '@/features/onboarding/components/onboarding-header';
import { useTheme } from '@/hooks/use-theme';
import { getApiErrorMessage } from '@/lib/api-client';

type CategoryStepProps = {
  onContinue: (categories: Category[]) => void;
};

export function CategoryStep({ onContinue }: CategoryStepProps) {
  const theme = useTheme();
  const [templates, setTemplates] = useState<CategoryTemplate[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadTemplates() {
      try {
        const items = await getCategoryTemplates();
        if (isCurrent) setTemplates(items);
      } catch (error) {
        if (isCurrent) setMessage(getApiErrorMessage(error));
      }
    }

    void loadTemplates();

    return () => {
      isCurrent = false;
    };
  }, [loadAttempt]);

  function retry() {
    setTemplates(null);
    setMessage(null);
    setLoadAttempt((current) => current + 1);
  }

  function toggleTemplate(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submit() {
    setIsSaving(true);
    setMessage(null);

    try {
      const categories = await createCategories([...selectedIds]);
      onContinue(categories);
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen contentStyle={styles.screen}>
      <OnboardingHeader
        description="Choose the areas you want to organize. You can add more later."
        step={2}
        title="What matters to you?"
      />

      {!templates ? (
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
        <View style={styles.grid}>
          {templates.map((template) => {
            const isSelected = selectedIds.has(template.id);

            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                key={template.id}
                onPress={() => toggleTemplate(template.id)}
                style={[
                  styles.card,
                  {
                    backgroundColor: isSelected ? `${template.color}18` : theme.surface,
                    borderColor: isSelected ? template.color : theme.border,
                  },
                ]}>
                <View style={[styles.color, { backgroundColor: template.color }]} />
                <View style={styles.cardText}>
                  <ThemedText type="label">{template.name}</ThemedText>
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                    {template.description}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {templates && (
        <View style={styles.footer}>
          {message && (
            <ThemedText type="caption" style={{ color: theme.error }}>
              {message}
            </ThemedText>
          )}
          <Button
            disabled={selectedIds.size === 0}
            label={selectedIds.size > 0 ? `Continue with ${selectedIds.size}` : 'Select categories'}
            loading={isSaving}
            onPress={submit}
          />
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
  grid: {
    gap: Spacing.three,
  },
  card: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: Spacing.three,
  },
  color: {
    width: 12,
    height: 44,
    borderRadius: 6,
  },
  cardText: {
    flex: 1,
    gap: Spacing.one,
  },
  footer: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
});
