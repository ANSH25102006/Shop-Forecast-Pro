"""Structured state and action definitions using dataclasses."""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import List


@dataclass
class Product:
    name: str
    price: float
    cost: float
    stock: int
    daily_demand_mean: float  # average units sold per day
    demand_trend: float = 0.0  # positive = growing, negative = shrinking


@dataclass
class State:
    """Observable environment state."""
    time_step: int
    total_days: int
    products: List[Product] = field(default_factory=list)
    cumulative_revenue: float = 0.0
    cumulative_cost: float = 0.0
    cumulative_stockout_days: int = 0
    cumulative_overstock_units: int = 0
    forecast_errors: List[float] = field(default_factory=list)

    @property
    def profit(self) -> float:
        return self.cumulative_revenue - self.cumulative_cost

    @property
    def forecast_accuracy(self) -> float:
        if not self.forecast_errors:
            return 1.0
        mae = sum(abs(e) for e in self.forecast_errors) / len(self.forecast_errors)
        return max(0.0, 1.0 - mae)


@dataclass
class Action:
    """Agent action for a single time step.

    Each list is parallel to the product list in State.
    """
    price_multipliers: List[float] = field(default_factory=list)   # 1.0 = no change
    restock_amounts: List[int] = field(default_factory=list)       # units to order
    discount_rates: List[float] = field(default_factory=list)      # 0.0–1.0
    demand_forecasts: List[float] = field(default_factory=list)    # predicted demand

    @classmethod
    def no_op(cls, n_products: int) -> "Action":
        return cls(
            price_multipliers=[1.0] * n_products,
            restock_amounts=[0] * n_products,
            discount_rates=[0.0] * n_products,
            demand_forecasts=[0.0] * n_products,
        )
