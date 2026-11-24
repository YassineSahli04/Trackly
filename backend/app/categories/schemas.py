from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CategoryTemplate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: UUID
    slug: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=200)
    color: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")
    icon: str = Field(min_length=1, max_length=50)


class CategoryTemplateListResponse(BaseModel):
    items: list[CategoryTemplate]
