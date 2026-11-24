from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.categories.models import CategoryTemplateModel
from app.core.exceptions import DataAccessError


class CategoryTemplateRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_active(self) -> list[dict[str, object]]:
        statement = (
            select(CategoryTemplateModel)
            .where(CategoryTemplateModel.is_active.is_(True))
            .order_by(CategoryTemplateModel.sort_order, CategoryTemplateModel.name)
        )

        try:
            result = await self._session.scalars(statement)
        except SQLAlchemyError as error:
            raise DataAccessError("Unable to load category templates.") from error

        return [
            {
                "id": template.id,
                "slug": template.slug,
                "name": template.name,
                "description": template.description,
                "color": template.color,
                "icon": template.icon,
            }
            for template in result
        ]
