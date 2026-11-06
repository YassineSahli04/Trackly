# Trackly frontend

Expo React Native client for Trackly.

## Local development

```bash
npm install
npx expo start
```

Copy `.env.example` to `.env` and provide the Supabase project URL and publishable key.

## Structure

- `src/app`: routes only
- `src/features`: feature-specific UI and state
- `src/components`: shared UI components
- `src/lib`: external service clients
- `src/hooks`: shared hooks
- `src/constants`: shared design constants
