from fastapi import APIRouter
from utils.database import get_prompt_guides_from_db

router = APIRouter()


@router.get("/api/prompt_guides")
def get_prompt_guides():
    return {"prompt guides": get_prompt_guides_from_db()}
