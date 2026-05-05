import logging
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.retrieval_service import generate_answer

logger = logging.getLogger(__name__)

router = APIRouter()


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1)
    top_k: int = Field(default=4, ge=1, le=20)
    return_sources: bool = False


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[list[dict[str, Any]]] = None


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    logger.info("Chat query received")

    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    answer, sources = generate_answer(
        request.query,
        top_k=request.top_k,
        include_sources=request.return_sources,
    )

    return ChatResponse(answer=answer, sources=sources if request.return_sources else None)
