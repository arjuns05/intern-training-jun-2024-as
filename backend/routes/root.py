from fastapi import APIRouter

router = APIRouter()


@router.get("/api")
def root():
    return "Hi there!"
