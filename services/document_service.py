import io
import logging
from typing import List, Tuple

from pypdf import PdfReader

from services import embedding_service
from services.retrieval_service import store_chunks

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    pages_text = []

    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text:
            pages_text.append(page_text)

    return "\n".join(pages_text)


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    if not words:
        return []

    chunks: List[str] = []
    step = max(1, chunk_size - overlap)

    # Simple word-based chunking to approximate token counts.
    for start in range(0, len(words), step):
        end = start + chunk_size
        chunk_words = words[start:end]
        if not chunk_words:
            continue
        chunks.append(" ".join(chunk_words))

    return chunks


def ingest_pdf(
    file_bytes: bytes,
    filename: str,
    chunk_size: int = 500,
    overlap: int = 50,
) -> int:
    text = extract_text_from_pdf(file_bytes)

    if not text.strip():
        logger.warning("No text extracted from %s", filename)
        return 0

    chunks = chunk_text(text, chunk_size=chunk_size, overlap=overlap)

    if not chunks:
        logger.warning("No chunks created for %s", filename)
        return 0

    metadatas = [
        {
            "source": filename,
            "chunk_index": index,
        }
        for index in range(len(chunks))
    ]

    embeddings = embedding_service.embed_texts(chunks)
    store_chunks(chunks, embeddings, metadatas)

    return len(chunks)
