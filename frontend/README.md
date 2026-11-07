# Trackly frontend

Expo React Native client for Trackly.

## Local development

```bash
npm install
npx expo start
```

Copy `.env.example` to `.env` and provide the Supabase project URL and publishable key.
Set `EXPO_PUBLIC_API_URL` to the backend URL. When testing on a physical phone, use your
computer's LAN IP instead of `localhost`.

## Structure

- `src/app`: routes only
- `src/features`: feature-specific UI and state
- `src/components`: shared UI components
- `src/lib`: external service clients
- `src/hooks`: shared hooks
- `src/constants`: shared design constants
