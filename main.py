import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routes.chat import router as chat_router
from routes.upload import router as upload_router


def create_app() -> FastAPI:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    app = FastAPI(title="RAG Backend")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"] ,
        allow_headers=["*"],
    )
    app.include_router(upload_router)
    app.include_router(chat_router)

    return app


app = create_app()
