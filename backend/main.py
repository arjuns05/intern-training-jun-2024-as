from fastapi import FastAPI
from routes import prompt_guide_id, prompt_guides, root, send

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openai.json")
app.include_router(root.router)
app.include_router(prompt_guides.router)
app.include_router(prompt_guide_id.router)
app.include_router(send.router)
