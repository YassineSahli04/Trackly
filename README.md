# Trackly

Trackly helps users define goals, log their activities, and understand their progress over time.

## Local development

Start Docker, then run each part in a separate terminal.

### Supabase

```bash
npx supabase start
```

### Backend

```bash
cd backend
cp .env.example .env
uv sync
uv run fastapi dev
```

Set the local Supabase URL and secret key in `backend/.env` before starting the API.

### Frontend

```bash
cd frontend
npm install
npx expo start
```

To stop the local Supabase services:

```bash
npx supabase stop
```

## Continuous integration

Pull requests validate the frontend, backend, and database. A successful push to `main` repeats
validation, deploys pending Supabase migrations, deploys the backend to Railway, and then publishes
an Expo preview update.

Before enabling preview publishing:

1. Add `EXPO_TOKEN` to the repository's GitHub Actions secrets.
2. Add `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, and `SUPABASE_PROJECT_ID` to the
   repository's GitHub Actions secrets.
3. Add a Railway project token as the `RAILWAY_TOKEN` GitHub Actions secret and the backend
   service ID as the `RAILWAY_SERVICE_ID` repository variable.
4. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the Railway backend service.
5. Add `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
   `EXPO_PUBLIC_API_URL` to the Expo `preview` environment.
6. Configure EAS Update after choosing the Expo SDK version used by testers.
