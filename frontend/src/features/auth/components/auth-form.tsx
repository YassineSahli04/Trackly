import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
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
      <View style={[styles.modeSelector, { backgroundColor: theme.surfaceMuted }]}>
        <Pressable
          onPress={() => changeMode('signIn')}
          style={[styles.modeButton, mode === 'signIn' && { backgroundColor: theme.surface }]}>
          <ThemedText type="label">Sign in</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => changeMode('signUp')}
          style={[styles.modeButton, mode === 'signUp' && { backgroundColor: theme.surface }]}>
          <ThemedText type="label">Create account</ThemedText>
        </Pressable>
      </View>

      {mode === 'signUp' && (
        <TextField
          autoCapitalize="none"
          autoComplete="username-new"
          label="Username"
          onChangeText={setUsername}
          placeholder="Username"
          value={username}
        />
      )}

      <TextField
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <TextField
        autoCapitalize="none"
        autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
        label="Password"
        onChangeText={setPassword}
        onSubmitEditing={mode === 'signIn' && !isDisabled ? submit : undefined}
        placeholder="Password"
        secureTextEntry
        value={password}
      />

      {mode === 'signUp' && (
        <TextField
          autoCapitalize="none"
          autoComplete="new-password"
          label="Confirm password"
          onChangeText={setPasswordConfirmation}
          onSubmitEditing={isDisabled ? undefined : submit}
          placeholder="Confirm password"
          secureTextEntry
          value={passwordConfirmation}
        />
      )}

      {message && (
        <ThemedText
          type="caption"
          style={{ color: isError ? theme.error : theme.success }}>
          {message}
        </ThemedText>
      )}

      <Button
        disabled={isDisabled}
        label={mode === 'signIn' ? 'Sign in' : 'Create account'}
        loading={isSubmitting}
        onPress={submit}
      />
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
});
