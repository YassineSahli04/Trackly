from uuid import UUID

from sqlalchemy import Boolean, SmallInteger, String
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class CategoryTemplateModel(Base):
    __tablename__ = "category_templates"

    id: Mapped[UUID] = mapped_column(PostgresUUID(as_uuid=True), primary_key=True)
    slug: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(200))
    color: Mapped[str] = mapped_column(String(7))
    icon: Mapped[str] = mapped_column(String(50))
    sort_order: Mapped[int] = mapped_column(SmallInteger)
    is_active: Mapped[bool] = mapped_column(Boolean)
