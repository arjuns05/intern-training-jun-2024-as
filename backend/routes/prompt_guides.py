from fastapi import APIRouter
from utils.database import get_prompt_guide_db, get_prompt_guides_from_db

router = APIRouter()


@router.get("/api/prompt_guides")
def get_prompt_guides():
    return {"prompt_guides": get_prompt_guides_from_db()}
