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
uv sync
uv run fastapi dev
```

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
