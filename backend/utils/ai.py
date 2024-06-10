import os

from openai import OpenAI
from utils.secret import get_secret

secret = get_secret("secret/data/teams/intern-training/openai")
OPENAI_API_KEY = secret["apikey"]
base_url = os.getenv("OPENAI_BASE_URL", "https://api.dev.ai-hub.colpal.cloud/openai/v1")


client = OpenAI(api_key=OPENAI_API_KEY, base_url=base_url)


def send_ai_message(message):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message, "name": "arjun"}],
    )

    return completion.choices[0].message.content
