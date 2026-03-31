Project Overview

This project is a modern web application built with a component-driven frontend architecture. The system is designed to deliver a fast, scalable, and maintainable user interface while maintaining a clean and modular development workflow.
The application uses a modern toolchain based on Vite and React for fast development and optimized builds. TypeScript provides static typing and improved code reliability, while Tailwind CSS and shadcn-ui enable consistent and responsive UI design.
The project is integrated with the Lovable development platform, which allows rapid iteration, automatic code updates, and simplified deployment.

Architecture Overview — 4-Layer Frontend Pipeline

| Layer | Name                 | Responsibility                                                     | Technology              |
| ----- | -------------------- | ------------------------------------------------------------------ | ----------------------- |
| 1     | UI Layer             | Handles rendering of pages and reusable interface components       | React, TypeScript       |
| 2     | State & Logic        | Manages application state and UI interactions                      | React Hooks, Zustand    |
| 3     | Data Integration     | Handles API requests, WebSocket communication, and data processing | Fetch API, WebSocket    |
| 4     | Styling & Components | Provides responsive design and reusable UI components              | Tailwind CSS, shadcn-ui |

Data Flow:
<br>
User Interaction → Component Logic → State Update → API/Data Layer → UI Re-render
<br>
Repository Structure

project-root/
├── public/
│   Static assets and icons
│
├── src/
│   ├── components/
│   │   Reusable UI components
│   │
│   ├── pages/
│   │   Application pages and views
│   │
│   ├── hooks/
│   │   Custom React hooks
│   │
│   ├── utils/
│   │   Utility functions and helpers
│   │
│   ├── services/
│   │   API calls and external integrations
│   │
│   ├── styles/
│   │   Global styling configuration
│   │
│   ├── App.tsx
│   │   Root React component
│   │
│   └── main.tsx
│       Application entry point
│
├── package.json
│   Dependency management and scripts
│
├── vite.config.ts
│   Vite configuration
│
└── README.md
    Project documentation


Technology Stack
<br>
A.) Frontend Framework
<br>
1.) React - Component-based UI library for building dynamic and interactive interfaces.
<br>
2.) TypeScript - Strongly typed JavaScript that improves code reliability and developer productivity.
<br>
3.) Vite - Next-generation frontend build tool that provides extremely fast development server startup and optimized builds.
<br>

B.) UI and Styling
<br>
1.) Tailwind CSS - Utility-first CSS framework for building responsive interfaces quickly.
<br>
2.)shadcn-ui - Reusable and accessible UI component library built on top of Tailwind CSS.
<br>

C.)Development Tools
<br>
1.) Node.js - Runtime environment required to run the project locally.
<br>
2.) npm - Package manager used to install and manage project dependencies.
<br>
3.) Git and GitHub - Version control and project collaboration platform.
<br>

Installation
<br>
To run the project locally, ensure that Node.js and npm are installed.
<br>
Step 1 — Clone the Repository  -- git clone <YOUR_GIT_URL>
<br>
Step 2 — Navigate to the Project Directory  -- cd <YOUR_PROJECT_NAME>
<br>
Step 3 — Install Dependencies  -- npm install
<br>
Step 4 — Start the Development Server  -- npm run dev
<br>

The development server will start with hot reloading enabled, allowing instant preview of changes.

Running the Application
<br>
Once the development server is started, the application will be available at:
<br>
Frontend Application
<br>
http://localhost:5173
<br>
Any code changes will automatically trigger a rebuild and refresh the browser.
<br>

Deployment
<br>
The project can be deployed directly using the Lovable platform.
<br>
Steps to deploy:
<br>

1.) Open the project dashboard in Lovable.
<br>
2.) Navigate to the Share section.
<br>
3.) Select the Publish option.
<br>
4.) Lovable will automatically build and deploy the latest version.
<br>

Custom Domain Configuration
<br>
A custom domain can be connected through the project settings in Lovable.
<br>
Steps:
<br>
1.) Navigate to the Project Settings.
<br>
2.) Open the Domains section.
<br>
3.) Click Connect Domain.
<br>
4.) Follow the domain setup instructions.
<br>

Documentation reference:
<br>
https://docs.lovable.dev/features/custom-domain#custom-domain

Development Workflow
<br>
The recommended workflow for contributing to the project is:
<br>
1.) Clone the repository.
<br>
2.) Create a new feature branch.
<br>
3.) Implement changes locally.
<br>
4.) Commit updates with clear commit messages.
<br>
5.) Push the branch and open a pull request.
<br>
This ensures a clean and maintainable version history.
<br>

Future Improvements
<br>
1.) Planned improvements for the project include:
<br>
2.) Enhanced component reusability
<br>
3.) Advanced state management patterns
<br>
4.) Performance optimization
<br>
5.) Improved testing coverage
<br>
6.) Integration with external APIs and services

---

## OpenEnv Integration

OpenEnv is a standalone Python reinforcement-learning environment that simulates shop management decisions. It runs independently via CLI and does **not** affect the frontend.

### Structure

```
openenv/
├── __init__.py        # Package entry point
├── models.py          # State & Action dataclasses
├── shop_env.py        # ShopEnv environment (reset / step / get_state)
├── tasks.py           # 3 task definitions with grader functions
└── baseline.py        # Rule-based baseline agent
run_openenv.py         # CLI runner script
openenv.yaml           # Environment specification
```

### State Space

| Field | Type | Description |
|-------|------|-------------|
| `time_step` | int | Current day (0-indexed) |
| `products[].stock` | int | Current inventory |
| `products[].daily_demand_mean` | float | Average daily demand |
| `products[].demand_trend` | float | Demand growth rate |
| `cumulative_revenue` | float | Total revenue so far |
| `cumulative_cost` | float | Total costs so far |

### Action Space

| Field | Type | Description |
|-------|------|-------------|
| `price_multipliers` | list[float] | Per-product price scaling (1.0 = no change) |
| `restock_amounts` | list[int] | Units to order per product |
| `discount_rates` | list[float] | Discount fraction (0.0–1.0) |
| `demand_forecasts` | list[float] | Predicted demand (used for scoring) |

### Reward

Continuous per-step reward:
- **+** daily profit (revenue − restock cost)
- **−** 50 × stockout events
- **−** 0.5 × excess overstock units
- **+** 10 × cumulative forecast accuracy

### Tasks

| Difficulty | Task | Days | Metric |
|------------|------|------|--------|
| Easy | Predict next-day sales | 7 | Forecast accuracy (0–1) |
| Medium | Optimise inventory | 7 | Stockout + overstock score (0–1) |
| Hard | Maximise profit | 30 | Normalised profit (0–1) |

### How to Run

```bash
# Run all tasks with the baseline agent
python3 run_openenv.py

# Run a specific task
python3 run_openenv.py easy
python3 run_openenv.py hard
```

### Integration Hooks

- Product catalogue in `shop_env.py` mirrors the frontend mock data
- Demand trends and forecast logic align with `SmartForecastCard.tsx`
- No frontend files are modified; OpenEnv is fully isolated
