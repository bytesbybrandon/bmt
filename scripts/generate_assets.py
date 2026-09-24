import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv(Path("/app/backend/.env"))

OUT = Path("/app/frontend/public/assets")
OUT.mkdir(parents=True, exist_ok=True)

ASSETS = [
    (
        "spider.png",
        "Photorealistic macro photograph of a large orb weaver spider (Araneus diadematus, European garden spider) viewed directly from above, perfectly centered, eight long slender legs fully spread in a symmetrical resting pose, rounded bulbous abdomen with amber-brown chitin and subtle cream cross-shaped markings, fine visible hairs on legs, soft cold moonlight rim lighting with faint warm amber highlights, isolated on a pure solid black background, ultra detailed, sharp focus, high resolution",
    ),
    (
        "night-bg.png",
        "Extremely dark moody night background, deep blue-black out-of-focus forest bokeh at night, faint cold moonlight glow in the upper right corner, a few tiny soft out-of-focus specks of dew light scattered sparsely, almost completely black, cinematic, minimal, atmospheric, no subjects, no spider, no web",
    ),
    (
        "portrait.png",
        "Moody cinematic editorial portrait of a distinguished software engineer in his mid forties, short groomed beard, thoughtful calm expression looking slightly off camera, dark charcoal studio setting, single soft dramatic key light from the left, deep shadows, black background, shallow depth of field, fine art photography, ultra detailed",
    ),
]


async def generate(name: str, prompt: str):
    api_key = os.environ["EMERGENT_LLM_KEY"]
    chat = LlmChat(
        api_key=api_key,
        session_id=f"asset-{name}",
        system_message="You are an image generation assistant.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )
    msg = UserMessage(text=prompt)
    text, images = await chat.send_message_multimodal_response(msg)
    if images:
        image_bytes = base64.b64decode(images[0]["data"])
        (OUT / name).write_bytes(image_bytes)
        print(f"SAVED {name} ({len(image_bytes)} bytes)")
    else:
        print(f"FAILED {name}: {text[:200]}")


async def main():
    for name, prompt in ASSETS:
        try:
            await generate(name, prompt)
        except Exception as e:
            print(f"ERROR {name}: {e}")


if __name__ == "__main__":
    asyncio.run(main())
