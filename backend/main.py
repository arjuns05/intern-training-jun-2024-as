from fastapi import FastAPI
from routes import prompt_guides, root

app = FastAPI()
app.include_router(root.router)
app.include_router(prompt_guides.router)
