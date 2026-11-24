from fastapi import Request
from supabase import AsyncClient


def get_supabase_auth(request: Request) -> AsyncClient:
    return request.app.state.supabase_auth
