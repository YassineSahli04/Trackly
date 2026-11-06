import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/lib/supabase';

type AuthMode = 'signIn' | 'signUp';

export function AuthForm() {
  const theme = useTheme();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setUsername('');
    setPassword('');
    setPasswordConfirmation('');
    setMessage(null);
    setIsError(false);
  }

  async function submit() {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    if (mode === 'signUp' && (normalizedUsername.length < 3 || normalizedUsername.length > 30)) {
      setIsError(true);
      setMessage('Username must contain between 3 and 30 characters.');
      return;
    }

    if (mode === 'signUp' && password.length < 8) {
      setIsError(true);
      setMessage('Password must contain at least 8 characters.');
      return;
    }

    if (mode === 'signUp' && password !== passwordConfirmation) {
      setIsError(true);
      setMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setIsError(false);

    try {
      const result =
        mode === 'signIn'
          ? await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
          : await supabase.auth.signUp({
              email: normalizedEmail,
              password,
              options: { data: { username: normalizedUsername } },
            });

      if (result.error) {
        setIsError(true);
        setMessage(result.error.message);
      } else if (mode === 'signUp' && !result.data.session) {
        setMessage('Account created. You can now sign in.');
      }
    } catch {
      setIsError(true);
      setMessage('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isMissingRequiredField =
    !email.trim() ||
    !password ||
    (mode === 'signUp' && (!username.trim() || !passwordConfirmation));
  const isDisabled = isSubmitting || isMissingRequiredField;

  return (
    <View style={styles.form}>
      <View style={[styles.modeSelector, { backgroundColor: theme.backgroundElement }]}>
        <Pressable
          onPress={() => changeMode('signIn')}
          style={[styles.modeButton, mode === 'signIn' && { backgroundColor: theme.background }]}>
          <ThemedText>Sign in</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => changeMode('signUp')}
          style={[styles.modeButton, mode === 'signUp' && { backgroundColor: theme.background }]}>
          <ThemedText>Create account</ThemedText>
        </Pressable>
      </View>

      {mode === 'signUp' && (
        <TextInput
          autoCapitalize="none"
          autoComplete="username-new"
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
          value={username}
        />
      )}

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
        onChangeText={setPassword}
        onSubmitEditing={mode === 'signIn' && !isDisabled ? submit : undefined}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
        value={password}
      />

      {mode === 'signUp' && (
        <TextInput
          autoCapitalize="none"
          autoComplete="new-password"
          onChangeText={setPasswordConfirmation}
          onSubmitEditing={isDisabled ? undefined : submit}
          placeholder="Confirm password"
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          style={[styles.input, { borderColor: theme.backgroundSelected, color: theme.text }]}
          value={passwordConfirmation}
        />
      )}

      {message && (
        <ThemedText style={[styles.message, isError && styles.error]}>{message}</ThemedText>
      )}

      <Pressable
        disabled={isDisabled}
        onPress={submit}
        style={[styles.primaryButton, isDisabled && styles.disabled]}>
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <ThemedText style={styles.primaryButtonText}>
            {mode === 'signIn' ? 'Sign in' : 'Create account'}
          </ThemedText>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  modeSelector: {
    flexDirection: 'row',
    borderRadius: Spacing.two,
    padding: Spacing.one,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  message: {
    fontSize: 14,
  },
  error: {
    color: '#c62828',
  },
  primaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.two,
    backgroundColor: '#208AEF',
    paddingHorizontal: Spacing.four,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
});
