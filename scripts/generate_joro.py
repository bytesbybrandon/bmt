import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path("/app/backend/.env"))

OUT = Path("/app/frontend/public/assets")
OUT.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Photorealistic macro photograph of a single female Joro spider "
    "(Trichonephila clavata) orb weaver, anatomically correct with exactly one "
    "elongated oval abdomen and one small cephalothorax, viewed directly from "
    "above, perfectly centered. The abdomen has vivid yellow and charcoal-black "
    "horizontal banding with a small red marking near the rear tip. Exactly "
    "eight very long, slender, gracefully curved legs with alternating black "
    "and yellow banding, spread symmetrically in a natural resting pose. Soft "
    "cold moonlight rim lighting with faint warm highlights, fine visible leg "
    "hairs, isolated on a pure solid black background, ultra detailed, sharp "
    "macro focus, high resolution, no other objects"
)


async def generate(name: str):
    api_key = os.environ["EMERGENT_LLM_KEY"]
    chat = LlmChat(
        api_key=api_key,
        session_id=f"joro-{name}",
        system_message="You are an image generation assistant.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )
    text, images = await chat.send_message_multimodal_response(
        UserMessage(text=PROMPT)
    )
    if images:
        image_bytes = base64.b64decode(images[0]["data"])
        (OUT / name).write_bytes(image_bytes)
        print(f"SAVED {name} ({len(image_bytes)} bytes)")
    else:
        print(f"FAILED {name}: {text[:200]}")


async def main():
    for name in ["joro-a.png", "joro-b.png"]:
        try:
            await generate(name)
        except Exception as e:
            print(f"ERROR {name}: {e}")


if __name__ == "__main__":
    asyncio.run(main())
