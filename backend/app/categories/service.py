from typing import Protocol

from app.categories.schemas import CategoryTemplate, CategoryTemplateListResponse


class CategoryTemplateReader(Protocol):
    async def list_active(self) -> list[dict[str, object]]: ...


class CategoryTemplateService:
    def __init__(self, repository: CategoryTemplateReader) -> None:
        self._repository = repository

    async def list_active(self) -> CategoryTemplateListResponse:
        rows = await self._repository.list_active()
        items = [CategoryTemplate.model_validate(row) for row in rows]
        return CategoryTemplateListResponse(items=items)
