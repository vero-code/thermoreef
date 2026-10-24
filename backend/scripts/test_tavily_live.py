import asyncio
import os
import sys
from pathlib import Path

# Add backend/src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from backend.tavily import search_reef_context
from backend.nemotron.prompts import build_user_prompt


async def test():
    print("--- Testing Tavily Module ---")
    api_key = os.getenv("TAVILY_API_KEY", "").strip()
    print(f"TAVILY_API_KEY configured: {bool(api_key)}")

    # Test search for Great Barrier Reef area
    res = await search_reef_context(lat=-16.5, lng=146.0, reef_name="Great Barrier Reef Sector")
    print(f"Status: {res.get('status')}")
    print(f"Query: {res.get('query')}")
    print(f"Answer: {res.get('answer')}")
    print(f"Results Count: {len(res.get('results', []))}")
    for item in res.get("results", []):
        print(f" - {item.get('title')} ({item.get('url')})")

    # Test prompt generation
    prompt = build_user_prompt(
        reef_id="1",
        stress_data={"baa": 2, "dhw": 4.5, "sst": 29.8, "tempAnomaly": 1.4, "alertLevel": "warning"},
        lat=-16.5,
        lng=146.0,
        reef_name="Great Barrier Reef Sector",
        tavily_context=res,
    )
    print("\n--- Generated Prompt Preview (tail) ---")
    print("\n".join(prompt.splitlines()[-10:]))
    print("\nTavily integration test completed successfully!")


if __name__ == "__main__":
    asyncio.run(test())
