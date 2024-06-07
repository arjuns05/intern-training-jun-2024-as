from pydantic import BaseModel

# class Item(BaseModel):
#     name:str
#     description: str | None = None
#     price: float
#     tax: float | None = None


class Prompt(BaseModel):
    title: str
    tag: str
    description: str
    type: str
    choices: str | None = None


class PromptGuide(BaseModel):
    id: str | None = None
    name: str
    prompts: list[Prompt]
