import logging
from typing import Optional

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from services.document_service import ingest_pdf

logger = logging.getLogger(__name__)

router = APIRouter()


class UploadResponse(BaseModel):
    chunks_stored: int
    filename: str


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)) -> UploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is required")

    filename = file.filename
    content_type = file.content_type or ""

    if not filename.lower().endswith(".pdf") or content_type not in {"application/pdf", ""}:
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    logger.info("Processing upload: %s", filename)
    chunks_stored = ingest_pdf(file_bytes, filename)

    return UploadResponse(chunks_stored=chunks_stored, filename=filename)
