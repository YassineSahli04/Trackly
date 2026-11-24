from collections.abc import AsyncIterator

from fastapi import Depends, Request
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.auth.principal import CurrentUser
from app.infrastructure.auth.dependencies import get_current_user
from app.core.exceptions import DataAccessError


def get_session_factory(request: Request) -> async_sessionmaker[AsyncSession]:
    return request.app.state.session_factory


async def get_user_database_session(
    current_user: CurrentUser = Depends(get_current_user),
    session_factory: async_sessionmaker[AsyncSession] = Depends(get_session_factory),
) -> AsyncIterator[AsyncSession]:
    try:
        async with session_factory() as session, session.begin():
            await session.execute(
                text("select set_config('app.current_user_id', :user_id, true)"),
                {"user_id": str(current_user.id)},
            )
            yield session
    except SQLAlchemyError as error:
        raise DataAccessError("Unable to access the database.") from error
