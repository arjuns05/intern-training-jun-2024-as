from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from routes import prompt_guide_id, prompt_guides, root, send

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

if Path("static/assets").exists():
    # Mount all endpoints from `/assets/*` to be served from the `static/assets` folder
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

app.include_router(root.router)
app.include_router(prompt_guides.router)
app.include_router(prompt_guide_id.router)
app.include_router(send.router)


# Set up the default catch-all handler to serve our index.html file
@app.get("/{path:path}")
def index():
    return FileResponse("static/index.html")
