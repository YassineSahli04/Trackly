from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.categories.dependencies import get_category_template_service
from app.categories.schemas import CategoryTemplateListResponse
from app.categories.service import CategoryTemplateService

router = APIRouter(
    prefix="/category-templates",
    tags=["Categories"],
    dependencies=[Depends(get_current_user)],
    responses={
        401: {"description": "Invalid or missing access token."},
        503: {"description": "The data service is temporarily unavailable."},
    },
)


@router.get("", response_model=CategoryTemplateListResponse)
async def list_category_templates(
    service: CategoryTemplateService = Depends(get_category_template_service),
) -> CategoryTemplateListResponse:
    return await service.list_active()
