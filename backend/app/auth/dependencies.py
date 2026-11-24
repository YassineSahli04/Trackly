from dataclasses import dataclass
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import AsyncClient
from supabase_auth.errors import AuthApiError

from app.core.supabase_auth import get_supabase_auth

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    id: UUID


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    supabase: AsyncClient = Depends(get_supabase_auth),
) -> CurrentUser:
    if credentials is None:
        raise _unauthorized()

    try:
        response = await supabase.auth.get_user(credentials.credentials)
    except AuthApiError as error:
        raise _unauthorized() from error

    if response is None or response.user is None:
        raise _unauthorized()

    return CurrentUser(id=UUID(str(response.user.id)))


def _unauthorized() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing access token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
