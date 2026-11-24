from collections.abc import Iterator
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.auth.dependencies import CurrentUser, get_current_user
from app.categories.dependencies import get_category_template_service
from app.categories.schemas import CategoryTemplateListResponse
from app.core.supabase_auth import get_supabase_auth
from app.main import create_app

TEMPLATE_ID = UUID("10000000-0000-0000-0000-000000000001")
USER_ID = UUID("00000000-0000-0000-0000-000000000001")


class FakeCategoryTemplateService:
    async def list_active(self) -> CategoryTemplateListResponse:
        return CategoryTemplateListResponse.model_validate(
            {
                "items": [
                    {
                        "id": TEMPLATE_ID,
                        "slug": "health",
                        "name": "Health",
                        "description": "Physical and mental wellbeing.",
                        "color": "#16A34A",
                        "icon": "heart-pulse",
                    }
                ]
            }
        )


@pytest.fixture
def client() -> Iterator[TestClient]:
    app = create_app(initialize_services=False)
    app.dependency_overrides[get_current_user] = lambda: CurrentUser(id=USER_ID)
    app.dependency_overrides[get_category_template_service] = FakeCategoryTemplateService

    with TestClient(app) as test_client:
        yield test_client


def test_list_category_templates(client: TestClient) -> None:
    response = client.get("/api/v1/category-templates")

    assert response.status_code == 200
    assert response.json() == {
        "items": [
            {
                "id": str(TEMPLATE_ID),
                "slug": "health",
                "name": "Health",
                "description": "Physical and mental wellbeing.",
                "color": "#16A34A",
                "icon": "heart-pulse",
            }
        ]
    }


def test_list_category_templates_requires_authentication() -> None:
    app = create_app(initialize_services=False)
    app.dependency_overrides[get_category_template_service] = FakeCategoryTemplateService
    app.dependency_overrides[get_supabase_auth] = lambda: None

    with TestClient(app) as client:
        response = client.get("/api/v1/category-templates")

    assert response.status_code == 401
