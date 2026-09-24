import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path("/app/backend/.env"))

PROMPT = (
    "Bright serene daytime atmosphere, pale warm cream and soft blue morning "
    "sky, out-of-focus sunlit garden foliage bokeh, gentle daylight glow in "
    "the upper right corner, airy, calm, minimal, photographic, extremely "
    "soft focus, no animals, no spider, no web, no text"
)


async def main():
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id="asset-day-bg",
        system_message="You are an image generation assistant.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )
    text, images = await chat.send_message_multimodal_response(
        UserMessage(text=PROMPT)
    )
    if images:
        data = base64.b64decode(images[0]["data"])
        Path("/app/frontend/public/assets/day-bg.png").write_bytes(data)
        print(f"SAVED day-bg.png ({len(data)} bytes)")
    else:
        print(f"FAILED: {text[:200]}")


if __name__ == "__main__":
    asyncio.run(main())
