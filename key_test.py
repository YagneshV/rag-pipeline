from dotenv import load_dotenv
import os
from openai import OpenAI

# Load variables from .env
load_dotenv()

# Initialize client (will read OPENAI_API_KEY automatically)
client = OpenAI()

response = client.responses.create(
    model="gpt-4o-mini",
    input="tell me about the Einstein's theory of relativity",
    store=True,
)

print(response.output_text)