# RAG Backend (FastAPI)

Minimal backend for PDF ingestion and RAG-style chat.

## Setup

1. Create a `.env` file with your OpenAI key:

   ```
   OPENAI_API_KEY=your_key_here
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the API:

   ```bash
   uvicorn main:app --reload
   ```

## Endpoints

### POST /upload

Upload a PDF, chunk it, embed, and store in Chroma.

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your.pdf"
```

### POST /chat

Ask a question against stored chunks.

```bash
curl -X POST "http://127.0.0.1:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"query":"What is this document about?","top_k":4,"return_sources":true}'
```

## Notes

- Chroma stores data in `./chroma_db` by default (override with `CHROMA_DIR`).
- Only PDF files are supported in `/upload`.
