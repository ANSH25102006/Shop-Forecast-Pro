"""Baseline rule-based agent for OpenEnv."""

from __future__ import annotations

from openenv.models import Action, State

# Restock when stock drops below this many days of average demand
_RESTOCK_DAYS = 3
_RESTOCK_TARGET_DAYS = 7


class BaselineAgent:
    """Simple heuristic agent: restock when low, keep prices stable."""

    def act(self, state: State) -> Action:
        n = len(state.products)
        price_mults = []
        restocks = []
        discounts = []
        forecasts = []

        for p in state.products:
            trend_factor = 1.0 + p.demand_trend * (state.time_step + 1)
            predicted_demand = p.daily_demand_mean * trend_factor
            forecasts.append(round(predicted_demand, 1))

            # Restock rule
            days_of_supply = p.stock / max(predicted_demand, 0.1)
            if days_of_supply < _RESTOCK_DAYS:
                restock_qty = int(predicted_demand * _RESTOCK_TARGET_DAYS - p.stock)
                restocks.append(max(restock_qty, 0))
            else:
                restocks.append(0)

            # Pricing: raise price slightly if demand is growing, else hold
            if p.demand_trend > 0.01:
                price_mults.append(1.05)
            else:
                price_mults.append(1.0)

            # Discount overstock
            if days_of_supply > 10:
                discounts.append(0.1)
            else:
                discounts.append(0.0)

        return Action(
            price_multipliers=price_mults,
            restock_amounts=restocks,
            discount_rates=discounts,
            demand_forecasts=forecasts,
        )
