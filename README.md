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
