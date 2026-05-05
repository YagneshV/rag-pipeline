import logging
from typing import Iterable, List

from openai import OpenAI

logger = logging.getLogger(__name__)

_client = OpenAI()


def embed_texts(texts: Iterable[str]) -> List[list[float]]:
    text_list = [text for text in texts]
    if not text_list:
        return []

    logger.info("Generating embeddings for %d chunks", len(text_list))
    response = _client.embeddings.create(
        model="text-embedding-3-small",
        input=text_list,
    )

    return [item.embedding for item in response.data]


def embed_text(text: str) -> list[float]:
    embeddings = embed_texts([text])
    return embeddings[0] if embeddings else []
