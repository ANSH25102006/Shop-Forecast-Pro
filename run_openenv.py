#!/usr/bin/env python3
"""Runner script – initialises ShopEnv, runs the baseline agent, and prints scores."""

from __future__ import annotations

import sys

from openenv.baseline import BaselineAgent
from openenv.shop_env import ShopEnv
from openenv.tasks import TASKS


def run_task(task_key: str) -> float:
    task = TASKS[task_key]
    env = ShopEnv(total_days=task.total_days, seed=42)
    agent = BaselineAgent()

    state = env.reset()
    total_reward = 0.0
    done = False

    while not done:
        action = agent.act(state)
        state, reward, done, info = env.step(action)
        total_reward += reward

    score = task.grader(env)
    return score, total_reward


def main():
    keys = sys.argv[1:] if len(sys.argv) > 1 else list(TASKS.keys())
    print("=" * 60)
    print("  OpenEnv – Baseline Agent Results (seed=42)")
    print("=" * 60)
    for key in keys:
        if key not in TASKS:
            print(f"  Unknown task: {key}")
            continue
        task = TASKS[key]
        score, total_reward = run_task(key)
        print(f"\n  [{task.difficulty.upper()}] {task.name}")
        print(f"    Days:         {task.total_days}")
        print(f"    Total Reward: {total_reward:,.1f}")
        print(f"    Score:        {score:.4f}  (0.0–1.0)")
    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
