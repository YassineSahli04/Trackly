import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ScreenProps = PropsWithChildren<{
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
}>;

export function Screen({ children, contentStyle, scroll = true }: ScreenProps) {
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <SafeAreaView style={styles.container}>
          {scroll ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled">
              {content}
            </ScrollView>
          ) : (
            content
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: Spacing.four,
  },
});
