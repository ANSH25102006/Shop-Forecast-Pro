"""Shop management reinforcement-learning environment."""

from __future__ import annotations

import copy
import math
import random
from typing import Any, Dict, Tuple

from openenv.models import Action, Product, State


# Default product catalogue (mirrors mock data used in the frontend)
_DEFAULT_PRODUCTS = [
    Product("Basmati Rice 5kg", price=320, cost=240, stock=45, daily_demand_mean=8, demand_trend=0.02),
    Product("Toor Dal 1kg", price=160, cost=120, stock=30, daily_demand_mean=6, demand_trend=0.01),
    Product("Sunflower Oil 1L", price=180, cost=140, stock=25, daily_demand_mean=5, demand_trend=-0.01),
    Product("Sugar 1kg", price=48, cost=36, stock=60, daily_demand_mean=10, demand_trend=0.0),
    Product("Wheat Flour 10kg", price=420, cost=340, stock=20, daily_demand_mean=4, demand_trend=0.03),
]

OVERSTOCK_THRESHOLD = 3.0  # days-of-supply above which overstock penalty kicks in


class ShopEnv:
    """Gym-style environment for shop inventory / pricing decisions.

    Usage::

        env = ShopEnv(total_days=30)
        state = env.reset()
        done = False
        while not done:
            action = agent.act(state)
            state, reward, done, info = env.step(action)
    """

    def __init__(
        self,
        total_days: int = 30,
        products: list[Product] | None = None,
        seed: int | None = None,
    ):
        self.total_days = total_days
        self._initial_products = [copy.deepcopy(p) for p in (products or _DEFAULT_PRODUCTS)]
        self._rng = random.Random(seed)
        self.state: State = State(time_step=0, total_days=total_days)

    # ------------------------------------------------------------------
    def reset(self) -> State:
        """Reset environment to initial state and return it."""
        self.state = State(
            time_step=0,
            total_days=self.total_days,
            products=[copy.deepcopy(p) for p in self._initial_products],
        )
        return self.get_state()

    # ------------------------------------------------------------------
    def step(self, action: Action) -> Tuple[State, float, bool, Dict[str, Any]]:
        """Advance one day. Returns (next_state, reward, done, info)."""
        s = self.state
        n = len(s.products)

        # Pad / default action vectors
        pm = (action.price_multipliers + [1.0] * n)[:n]
        ra = (action.restock_amounts + [0] * n)[:n]
        dr = (action.discount_rates + [0.0] * n)[:n]
        fc = (action.demand_forecasts + [0.0] * n)[:n]

        day_revenue = 0.0
        day_cost = 0.0
        day_stockouts = 0
        day_overstock = 0
        info: Dict[str, Any] = {"day": s.time_step + 1, "products": {}}

        for i, p in enumerate(s.products):
            # Apply restock
            restock = max(0, int(ra[i]))
            p.stock += restock
            day_cost += restock * p.cost

            # Effective price after multiplier and discount
            eff_price = p.price * pm[i] * (1.0 - dr[i])

            # Simulate demand (stochastic with trend)
            trend_factor = 1.0 + p.demand_trend * (s.time_step + 1)
            mean_demand = p.daily_demand_mean * trend_factor
            # Price elasticity: higher price → lower demand
            elasticity = eff_price / p.price
            adjusted_mean = mean_demand / max(elasticity, 0.5)
            actual_demand = max(0, int(self._rng.gauss(adjusted_mean, adjusted_mean * 0.2)))

            # Sales limited by stock
            units_sold = min(actual_demand, p.stock)
            p.stock -= units_sold

            day_revenue += units_sold * eff_price

            # Track stockouts
            if actual_demand > units_sold:
                day_stockouts += 1

            # Track overstock
            safe_demand = max(p.daily_demand_mean, 1)
            if p.stock > safe_demand * OVERSTOCK_THRESHOLD:
                day_overstock += int(p.stock - safe_demand * OVERSTOCK_THRESHOLD)

            # Forecast error
            s.forecast_errors.append(abs(fc[i] - actual_demand) / max(actual_demand, 1))

            # Update demand trend slightly
            p.demand_trend += self._rng.gauss(0, 0.002)

            info["products"][p.name] = {
                "sold": units_sold,
                "demand": actual_demand,
                "stock": p.stock,
                "revenue": units_sold * eff_price,
            }

        # Update state
        s.cumulative_revenue += day_revenue
        s.cumulative_cost += day_cost
        s.cumulative_stockout_days += day_stockouts
        s.cumulative_overstock_units += day_overstock
        s.time_step += 1

        done = s.time_step >= s.total_days

        # --- Reward (continuous, per-step) ---
        profit_reward = day_revenue - day_cost
        stockout_penalty = -50.0 * day_stockouts
        overstock_penalty = -0.5 * day_overstock
        forecast_bonus = 10.0 * s.forecast_accuracy  # encourages better forecasts

        reward = profit_reward + stockout_penalty + overstock_penalty + forecast_bonus
        info["reward_breakdown"] = {
            "profit": profit_reward,
            "stockout_penalty": stockout_penalty,
            "overstock_penalty": overstock_penalty,
            "forecast_bonus": forecast_bonus,
        }

        return self.get_state(), reward, done, info

    # ------------------------------------------------------------------
    def get_state(self) -> State:
        """Return a deep copy of the current state."""
        return copy.deepcopy(self.state)
