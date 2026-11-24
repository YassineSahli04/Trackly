from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.repository import CategoryTemplateRepository
from app.modules.categories.service import CategoryTemplateService
from app.core.database import get_user_database_session


def get_category_template_service(
    session: AsyncSession = Depends(get_user_database_session),
) -> CategoryTemplateService:
    repository = CategoryTemplateRepository(session)
    return CategoryTemplateService(repository)
