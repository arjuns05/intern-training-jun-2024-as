from fastapi import APIRouter
from utils.secret import get_secret

router = APIRouter()


@router.get("/api")
def root():
    secret = get_secret("secret/data/teams/intern-training/aas-color")
    color = secret["favorite_color"]
    print(f"My favorite color is {color}")
    return "Hi there!"
