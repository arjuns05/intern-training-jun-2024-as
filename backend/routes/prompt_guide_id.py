from fastapi import APIRouter
from models.prompt_guide_model import PromptGuide
from utils.database import get_prompt_guide_db, update_record_or_add

router = APIRouter()


@router.get("/api/prompt_guide")
def get_prompt_guides(prompt_id: str):
    return {"prompt guides": get_prompt_guide_db(prompt_id)}


# POST ROUTE, /api/prompt_guide
@router.post("/api/prompt_guide")
def create_prompt_guide(prompt_guide: PromptGuide):
    return {"id:": update_record_or_add(prompt_guide)}
