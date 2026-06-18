# ruff: noqa
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Shopping Assistant Agent — ADK 2.0

Demonstrates a retail AI assistant with a single-use discount-code
redemption tool.  The hardcoded api_key below is intentional for the
pre-commit / Semgrep security-gating demo in a later step.
"""

from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.models import Gemini
from google.genai import types

# ---------------------------------------------------------------------------
# In-memory discount-code store
# Each entry: { "discount_pct": int, "redeemed": bool }
# ---------------------------------------------------------------------------
_DISCOUNT_CODES: dict[str, dict] = {
    "WELCOME50": {"discount_pct": 50, "redeemed": False},
    "SUMMER20": {"discount_pct": 20, "redeemed": False},
}

# Simulated registered-user registry  { user_id: display_name }
_REGISTERED_USERS: dict[str, str] = {
    "user_001": "Alice",
    "user_002": "Bob",
    "user_003": "Carol",
}


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------


def redeem_discount_code(code: str, user_id: str) -> str:
    """Redeem a single-use discount code for a registered user.

    Checks that the code exists in the in-memory store, that the requesting
    user is registered, and that the code has not already been used.  If all
    checks pass the code is marked as redeemed and the discount percentage is
    returned.

    Args:
        code:    The discount code string (e.g. "WELCOME50").
        user_id: The registered user ID attempting the redemption.

    Returns:
        A human-readable string describing the outcome of the redemption
        attempt.
    """
    code = code.strip().upper()

    # --- 1. Validate user ---
    if user_id not in _REGISTERED_USERS:
        return (
            f"Redemption failed: user ID '{user_id}' is not registered. "
            "Please create an account before redeeming discount codes."
        )

    user_name = _REGISTERED_USERS[user_id]

    # --- 2. Validate code existence ---
    if code not in _DISCOUNT_CODES:
        return (
            f"Redemption failed: discount code '{code}' does not exist. "
            "Please check the code and try again."
        )

    entry = _DISCOUNT_CODES[code]

    # --- 3. Check single-use constraint ---
    if entry["redeemed"]:
        return (
            f"Redemption failed: discount code '{code}' has already been "
            "used and cannot be redeemed again."
        )

    # --- 4. Mark as redeemed ---
    entry["redeemed"] = True
    pct = entry["discount_pct"]
    return (
        f"🎉 Success! Hi {user_name}, discount code '{code}' has been "
        f"redeemed. You receive a {pct}% discount on your current order. "
        "Enjoy your shopping!"
    )


def search_products(query: str) -> str:
    """Search the retail catalogue for products matching the query.

    Args:
        query: A natural-language product search string.

    Returns:
        A simulated list of matching products with prices.
    """
    catalogue = {
        "shoes": [
            {"name": "Trail Runner Pro", "price": "$89.99"},
            {"name": "Urban Sneaker X", "price": "$64.99"},
        ],
        "jacket": [
            {"name": "Alpine Fleece Jacket", "price": "$129.99"},
            {"name": "Rain Shield Anorak", "price": "$99.99"},
        ],
        "headphones": [
            {"name": "SoundWave BT 300", "price": "$149.99"},
            {"name": "BassBoost Pro", "price": "$79.99"},
        ],
    }

    q = query.lower()
    for keyword, products in catalogue.items():
        if keyword in q:
            lines = "\n".join(f"  • {p['name']} — {p['price']}" for p in products)
            return f"Found products for '{query}':\n{lines}"

    return (
        f"No products found for '{query}'. "
        "Try searching for 'shoes', 'jacket', or 'headphones'."
    )


def get_order_status(order_id: str) -> str:
    """Return the current shipping status of an order.

    Args:
        order_id: The order identifier string (e.g. "ORD-1042").

    Returns:
        A string describing the current order status.
    """
    simulated_orders = {
        "ORD-1001": "Delivered on June 10 — enjoy your purchase!",
        "ORD-1042": "Out for delivery — expected today by 6 PM.",
        "ORD-2099": "Processing — estimated ship date June 20.",
    }
    status = simulated_orders.get(
        order_id.upper(),
        f"Order '{order_id}' not found. Please check your order confirmation email.",
    )
    return status


# ---------------------------------------------------------------------------
# Agent definition
# NOTE: api_key is intentionally hardcoded here to demonstrate pre-commit
#       security gating (Semgrep secret detection) in a later workflow step.
#       Do NOT do this in production code.
# ---------------------------------------------------------------------------
import os
root_agent = Agent(
    name="shopping_assistant",
    model=Gemini(
        model="gemini-2.0-flash",
        # ⚠️  DEMO ONLY — hardcoded key for security-gating demonstration
        api_key=os.getenv("GOOGLE_API_KEY"),  # ty: ignore[unknown-argument]
        retry_options=types.HttpRetryOptions(attempts=3),
    ),
    instruction=(
        "You are a friendly and knowledgeable AI shopping assistant for a "
        "retail store. Help customers find products, check order status, and "
        "redeem discount codes. Always be polite, concise, and accurate. "
        "When a customer wants to redeem a discount code, ask for their "
        "registered user ID if they haven't provided one."
    ),
    tools=[redeem_discount_code, search_products, get_order_status],
)

app = App(
    root_agent=root_agent,
    name="shopping-assistant",
)
