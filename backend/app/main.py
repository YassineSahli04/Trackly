from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from httpx import AsyncClient as HttpxAsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from starlette.responses import JSONResponse
from supabase import acreate_client
from supabase.lib.client_options import AsyncClientOptions

from app.api.router import api_router
from app.core.config import get_settings
from app.core.exceptions import DataAccessError


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    engine = create_async_engine(
        settings.database_url.get_secret_value(),
        connect_args={"ssl": "require"} if settings.database_ssl else {},
        pool_pre_ping=True,
    )
    app.state.session_factory = async_sessionmaker(engine, expire_on_commit=False)

    try:
        async with HttpxAsyncClient(timeout=10) as http_client:
            app.state.supabase_auth = await acreate_client(
                str(settings.supabase_url),
                settings.supabase_publishable_key.get_secret_value(),
                options=AsyncClientOptions(httpx_client=http_client),
            )
            yield
    finally:
        await engine.dispose()


def create_app(*, initialize_services: bool = True) -> FastAPI:
    application = FastAPI(
        title="Trackly API",
        lifespan=lifespan if initialize_services else None,
    )
    application.include_router(api_router)
    application.add_exception_handler(DataAccessError, handle_data_access_error)
    return application


async def handle_data_access_error(_request: Request, _error: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={"detail": "The data service is temporarily unavailable."},
    )


app = create_app()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
