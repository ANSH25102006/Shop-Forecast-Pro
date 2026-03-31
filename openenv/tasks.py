"""Task definitions with grader functions for OpenEnv."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Dict

from openenv.models import Action, State
from openenv.shop_env import ShopEnv


@dataclass
class Task:
    name: str
    difficulty: str  # easy | medium | hard
    description: str
    total_days: int
    grader: Callable[[ShopEnv], float]  # returns 0.0–1.0


# ── Grader helpers ────────────────────────────────────────────────

def _grade_next_day_forecast(env: ShopEnv) -> float:
    """Easy: score = average forecast accuracy over the run."""
    return max(0.0, min(1.0, env.state.forecast_accuracy))


def _grade_inventory_optimisation(env: ShopEnv) -> float:
    """Medium: penalise stockouts and overstock over 7 days."""
    s = env.state
    n_products = len(s.products)
    max_stockout = s.total_days * n_products
    max_overstock = s.total_days * n_products * 50  # rough upper bound

    stockout_score = 1.0 - (s.cumulative_stockout_days / max(max_stockout, 1))
    overstock_score = 1.0 - min(s.cumulative_overstock_units / max(max_overstock, 1), 1.0)
    return max(0.0, min(1.0, 0.5 * stockout_score + 0.5 * overstock_score))


def _grade_profit_maximisation(env: ShopEnv) -> float:
    """Hard: normalised profit score over 30 days."""
    profit = env.state.profit
    # Rough baseline: if agent does nothing, ~0 profit. Good agent > 10 000.
    normalised = profit / 15_000.0
    return max(0.0, min(1.0, normalised))


# ── Task registry ────────────────────────────────────────────────

TASKS: Dict[str, Task] = {
    "easy": Task(
        name="Predict Next-Day Sales",
        difficulty="easy",
        description=(
            "Forecast tomorrow's demand for each product. "
            "Score is based on forecast accuracy (MAE-based)."
        ),
        total_days=7,
        grader=_grade_next_day_forecast,
    ),
    "medium": Task(
        name="Optimise Inventory (7 days)",
        difficulty="medium",
        description=(
            "Manage restocking decisions to minimise both stockouts and overstock "
            "over a 7-day horizon."
        ),
        total_days=7,
        grader=_grade_inventory_optimisation,
    ),
    "hard": Task(
        name="Maximise Profit (30 days)",
        difficulty="hard",
        description=(
            "Use pricing, discounts, and restocking to maximise cumulative profit "
            "over 30 simulated days."
        ),
        total_days=30,
        grader=_grade_profit_maximisation,
    ),
}
