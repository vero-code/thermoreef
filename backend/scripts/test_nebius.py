import os
import httpx
from dotenv import load_dotenv

# Load from backend/.env
load_dotenv()

key = os.getenv("NEBIUS_API_KEY")
base_url = os.getenv("NEBIUS_BASE_URL", "https://api.tokenfactory.nebius.com/v1").rstrip("/")
model = os.getenv("NEBIUS_MODEL", "nvidia/Nemotron-3-Ultra-550b-a55b")

print(f"Connecting to Nebius Token Factory: {base_url}")
print(f"Target model: {model}")

headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}

# 1. Test Models Endpoint
try:
    models_resp = httpx.get(f"{base_url}/models", headers=headers, timeout=10.0)
    print(f"Models endpoint status: {models_resp.status_code}")
    if models_resp.status_code == 200:
        models = models_resp.json().get("data", [])
        nemotron_models = [m["id"] for m in models if "nemotron" in m["id"].lower() or "nvidia" in m["id"].lower()]
        print(f"Found {len(nemotron_models)} NVIDIA/Nemotron models:")
        for m in nemotron_models[:10]:
            print(f"  - {m}")
    else:
        print(f"Models query response: {models_resp.text}")
except Exception as e:
    print(f"Error checking models: {e}")

# 2. Test Single Chat Completion
print("\nTesting single inference call...")
test_payload = {
    "model": model,
    "messages": [
        {"role": "system", "content": "You are a marine biology AI coordinator for ThermoReef."},
        {"role": "user", "content": "Briefly state 2 urgent actions when a coral reef enters NOAA Alert Level 2 (severe heat stress)."}
    ],
    "max_tokens": 150,
    "temperature": 0.2
}

try:
    resp = httpx.post(f"{base_url}/chat/completions", headers=headers, json=test_payload, timeout=30.0)
    print(f"Completion status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.json()
        print("\n--- Response from Nemotron ---")
        print(data["choices"][0]["message"]["content"])
        print("-------------------------------")
        print("SUCCESS! Nebius Token Factory connection is working perfectly!")
    else:
        print(f"Inference error: {resp.text}")
except Exception as e:
    print(f"Error during completion: {e}")
