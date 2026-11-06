import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { AuthForm } from '@/features/auth/components/auth-form';

export default function HomeScreen() {
  const { isLoading, session, signOut } = useAuth();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <SafeAreaView style={styles.content}>
          <ThemedText type="title">Trackly</ThemedText>

          {session ? (
            <>
              <ThemedText>
                Signed in as {session.user.user_metadata.username ?? session.user.email}
              </ThemedText>
              <Pressable style={styles.signOutButton} onPress={signOut}>
                <ThemedText>Sign out</ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              <ThemedText>Track your goals and activities.</ThemedText>
              <AuthForm />
            </>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    padding: Spacing.four,
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#808080',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});
