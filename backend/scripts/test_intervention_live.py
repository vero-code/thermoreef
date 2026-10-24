import asyncio
import json
from dotenv import load_dotenv

load_dotenv()

from backend.main import get_reef_intervention

async def main():
    print("Testing live end-to-end intervention for Reef #1...")
    # Calls NOAA satellite API, then sends to NVIDIA Nemotron-3 Ultra on Nebius Token Factory
    res = await get_reef_intervention(reef_id="1")
    print("\n--- NOAA Satellite Stress Data ---")
    print(json.dumps(res["stress"], indent=2))

    print("\n--- Tavily Web Intelligence ---")
    print(json.dumps(res.get("web_intelligence"), indent=2, ensure_ascii=False))

    print("\n--- NVIDIA Nemotron-3 Ultra Rescue Protocol ---")
    print(json.dumps(res["protocol"], indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())
