import logging
import os
import uuid
from typing import Any, List, Tuple

import chromadb
from openai import OpenAI

from services import embedding_service

logger = logging.getLogger(__name__)

_client = OpenAI()
_collection = None


def _get_collection():
    global _collection
    if _collection is not None:
        return _collection

    persist_dir = os.getenv("CHROMA_DIR", "chroma_db")
    os.makedirs(persist_dir, exist_ok=True)

    chroma_client = chromadb.PersistentClient(path=persist_dir)
    _collection = chroma_client.get_or_create_collection(
        name="rag_chunks",
        metadata={"hnsw:space": "cosine"},
    )

    return _collection


def store_chunks(
    documents: List[str],
    embeddings: List[list[float]],
    metadatas: List[dict[str, Any]],
) -> None:
    if not documents:
        return

    collection = _get_collection()
    ids = [str(uuid.uuid4()) for _ in documents]

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    logger.info("Stored %d chunks", len(documents))


def generate_answer(
    query: str,
    top_k: int = 4,
    include_sources: bool = False,
) -> Tuple[str, List[dict[str, Any]] | None]:
    collection = _get_collection()

    query_embedding = embedding_service.embed_text(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    documents = (results.get("documents") or [[]])[0]
    metadatas = (results.get("metadatas") or [[]])[0]
    distances = (results.get("distances") or [[]])[0]
    ids = (results.get("ids") or [[]])[0]

    context_blocks = []
    sources = []

    for doc, metadata, distance, doc_id in zip(documents, metadatas, distances, ids):
        context_blocks.append(doc)
        if include_sources:
            sources.append(
                {
                    "id": doc_id,
                    "text": doc,
                    "metadata": metadata,
                    "distance": distance,
                }
            )

    context_text = "\n\n".join(context_blocks)

    system_prompt = (
        "You are a helpful assistant. Use the provided context to answer the user's question. "
        "If the answer is not in the context, say you don't know."
    )
    user_prompt = f"Question: {query}\n\nContext:\n{context_text}"

    response = _client.responses.create(
        model="gpt-4o-mini",
        input=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    return response.output_text, sources if include_sources else None
