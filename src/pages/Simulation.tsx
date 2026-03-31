import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Target,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// ── Simulation engine (mirrors Python OpenEnv logic) ────────────
interface Product {
  name: string;
  price: number;
  cost: number;
  stock: number;
  dailyDemandMean: number;
  demandTrend: number;
}

interface DayResult {
  day: number;
  revenue: number;
  cost: number;
  profit: number;
  reward: number;
  stockouts: number;
  overstock: number;
  forecastAccuracy: number;
  products: Record<string, { sold: number; demand: number; stock: number }>;
}

interface TaskResult {
  key: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  totalReward: number;
  days: DayResult[];
}

const DEFAULT_PRODUCTS: Product[] = [
  { name: "Basmati Rice 5kg", price: 320, cost: 240, stock: 45, dailyDemandMean: 8, demandTrend: 0.02 },
  { name: "Toor Dal 1kg", price: 160, cost: 120, stock: 30, dailyDemandMean: 6, demandTrend: 0.01 },
  { name: "Sunflower Oil 1L", price: 180, cost: 140, stock: 25, dailyDemandMean: 5, demandTrend: -0.01 },
  { name: "Sugar 1kg", price: 48, cost: 36, stock: 60, dailyDemandMean: 10, demandTrend: 0.0 },
  { name: "Wheat Flour 10kg", price: 420, cost: 340, stock: 20, dailyDemandMean: 4, demandTrend: 0.03 },
];

// Seeded PRNG (simple mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussRandom(rng: () => number, mean: number, stddev: number): number {
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

function runSimulation(totalDays: number, seed = 42): { days: DayResult[]; finalProducts: Product[] } {
  const rng = mulberry32(seed);
  const products = DEFAULT_PRODUCTS.map((p) => ({ ...p }));
  const days: DayResult[] = [];
  let cumulativeRevenue = 0;
  let cumulativeCost = 0;
  const forecastErrors: number[] = [];

  for (let day = 0; day < totalDays; day++) {
    let dayRevenue = 0;
    let dayCost = 0;
    let dayStockouts = 0;
    let dayOverstock = 0;
    const productResults: Record<string, { sold: number; demand: number; stock: number }> = {};

    for (const p of products) {
      // Baseline agent logic
      const trendFactor = 1.0 + p.demandTrend * (day + 1);
      const predictedDemand = p.dailyDemandMean * trendFactor;
      const daysOfSupply = p.stock / Math.max(predictedDemand, 0.1);

      // Restock
      let restock = 0;
      if (daysOfSupply < 3) {
        restock = Math.max(0, Math.round(predictedDemand * 7 - p.stock));
      }
      p.stock += restock;
      dayCost += restock * p.cost;

      // Price multiplier
      const priceMult = p.demandTrend > 0.01 ? 1.05 : 1.0;
      const discount = daysOfSupply > 10 ? 0.1 : 0.0;
      const effPrice = p.price * priceMult * (1 - discount);

      // Demand
      const meanDemand = p.dailyDemandMean * trendFactor;
      const elasticity = effPrice / p.price;
      const adjustedMean = meanDemand / Math.max(elasticity, 0.5);
      const actualDemand = Math.max(0, Math.round(gaussRandom(rng, adjustedMean, adjustedMean * 0.2)));

      const unitsSold = Math.min(actualDemand, p.stock);
      p.stock -= unitsSold;
      dayRevenue += unitsSold * effPrice;

      if (actualDemand > unitsSold) dayStockouts++;
      const safeDemand = Math.max(p.dailyDemandMean, 1);
      if (p.stock > safeDemand * 3) dayOverstock += Math.round(p.stock - safeDemand * 3);

      forecastErrors.push(Math.abs(predictedDemand - actualDemand) / Math.max(actualDemand, 1));
      p.demandTrend += gaussRandom(rng, 0, 0.002);

      productResults[p.name] = { sold: unitsSold, demand: actualDemand, stock: p.stock };
    }

    cumulativeRevenue += dayRevenue;
    cumulativeCost += dayCost;

    const mae = forecastErrors.reduce((a, b) => a + Math.abs(b), 0) / forecastErrors.length;
    const forecastAcc = Math.max(0, 1 - mae);
    const profitReward = dayRevenue - dayCost;
    const reward = profitReward - 50 * dayStockouts - 0.5 * dayOverstock + 10 * forecastAcc;

    days.push({
      day: day + 1,
      revenue: Math.round(dayRevenue),
      cost: Math.round(dayCost),
      profit: Math.round(dayRevenue - dayCost),
      reward: Math.round(reward),
      stockouts: dayStockouts,
      overstock: dayOverstock,
      forecastAccuracy: Math.round(forecastAcc * 100),
      products: productResults,
    });
  }

  return { days, finalProducts: products };
}

function gradeEasy(days: DayResult[]): number {
  const avg = days.reduce((s, d) => s + d.forecastAccuracy, 0) / days.length;
  return Math.max(0, Math.min(1, avg / 100));
}

function gradeInventory(days: DayResult[], totalDays: number): number {
  const nProducts = 5;
  const totalStockouts = days.reduce((s, d) => s + d.stockouts, 0);
  const totalOverstock = days.reduce((s, d) => s + d.overstock, 0);
  const maxStockout = totalDays * nProducts;
  const maxOverstock = totalDays * nProducts * 50;
  const stockoutScore = 1 - totalStockouts / Math.max(maxStockout, 1);
  const overstockScore = 1 - Math.min(totalOverstock / Math.max(maxOverstock, 1), 1);
  return Math.max(0, Math.min(1, 0.5 * stockoutScore + 0.5 * overstockScore));
}

function gradeProfit(days: DayResult[]): number {
  const totalProfit = days.reduce((s, d) => s + d.profit, 0);
  return Math.max(0, Math.min(1, totalProfit / 15000));
}

// ── Component ───────────────────────────────────────────────────
const Simulation = () => {
  const { t } = useLanguage();
  const [results, setResults] = useState<TaskResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [activeTask, setActiveTask] = useState("easy");

  const runAll = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const tasks: { key: string; name: string; difficulty: "easy" | "medium" | "hard"; totalDays: number }[] = [
        { key: "easy", name: "Predict Next-Day Sales", difficulty: "easy", totalDays: 7 },
        { key: "medium", name: "Optimise Inventory (7 days)", difficulty: "medium", totalDays: 7 },
        { key: "hard", name: "Maximise Profit (30 days)", difficulty: "hard", totalDays: 30 },
      ];

      const taskResults: TaskResult[] = tasks.map((task) => {
        const { days } = runSimulation(task.totalDays, 42);
        const totalReward = days.reduce((s, d) => s + d.reward, 0);
        let score: number;
        if (task.key === "easy") score = gradeEasy(days);
        else if (task.key === "medium") score = gradeInventory(days, task.totalDays);
        else score = gradeProfit(days);

        return { ...task, score, totalReward: Math.round(totalReward), days };
      });

      setResults(taskResults);
      setRunning(false);
      setActiveTask("easy");
    }, 800);
  }, []);

  const reset = () => {
    setResults(null);
    setActiveTask("easy");
  };

  const currentTask = results?.find((r) => r.key === activeTask);

  const difficultyColor = (d: string) => {
    if (d === "easy") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    if (d === "medium") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  };

  const scoreColor = (score: number) => {
    if (score >= 0.8) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 0.5) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="simulation" />

      <main className="container py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{t("simulation.title")}</h2>
              <p className="text-muted-foreground text-sm">{t("simulation.subtitle")}</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{t("simulation.controlTitle")}</h3>
                  <p className="text-sm text-muted-foreground">{t("simulation.controlDesc")}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={runAll}
                    disabled={running}
                    className="gap-2"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {running ? (
                      <Activity className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {running ? t("simulation.running") : t("simulation.runAll")}
                  </Button>
                  {results && (
                    <Button variant="outline" onClick={reset} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      {t("simulation.reset")}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Score overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {results.map((task, i) => (
                  <motion.div
                    key={task.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        activeTask === task.key ? "ring-2 ring-primary shadow-md" : "border-border"
                      }`}
                      onClick={() => setActiveTask(task.key)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className={difficultyColor(task.difficulty)}>
                            {task.difficulty.toUpperCase()}
                          </Badge>
                          <div className={`text-2xl font-bold ${scoreColor(task.score)}`}>
                            {(task.score * 100).toFixed(0)}%
                          </div>
                        </div>
                        <h4 className="font-semibold text-foreground text-sm mb-2">{task.name}</h4>
                        <Progress value={task.score * 100} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{task.days.length} days</span>
                          <span>Reward: {task.totalReward.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Detailed view */}
              {currentTask && (
                <motion.div
                  key={currentTask.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Tabs defaultValue="charts" className="space-y-4">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="charts">{t("simulation.charts")}</TabsTrigger>
                      <TabsTrigger value="metrics">{t("simulation.metrics")}</TabsTrigger>
                      <TabsTrigger value="products">{t("simulation.products")}</TabsTrigger>
                    </TabsList>

                    {/* Charts tab */}
                    <TabsContent value="charts" className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Revenue & Profit */}
                        <Card className="border-border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              {t("simulation.revenueProfit")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                              <AreaChart data={currentTask.days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: 12,
                                  }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1) / 0.15)" name="Revenue" />
                                <Area type="monotone" dataKey="profit" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3) / 0.15)" name="Profit" />
                                <Legend />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Reward per day */}
                        <Card className="border-border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Zap className="h-4 w-4 text-amber-500" />
                              {t("simulation.rewardPerDay")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                              <BarChart data={currentTask.days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: 12,
                                  }}
                                />
                                <Bar dataKey="reward" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Reward" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Stockouts & overstock */}
                        <Card className="border-border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              {t("simulation.inventoryHealth")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                              <LineChart data={currentTask.days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: 12,
                                  }}
                                />
                                <Line type="monotone" dataKey="stockouts" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Stockouts" />
                                <Line type="monotone" dataKey="overstock" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} name="Overstock" />
                                <Legend />
                              </LineChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Forecast accuracy */}
                        <Card className="border-border">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Target className="h-4 w-4 text-emerald-500" />
                              {t("simulation.forecastAccuracy")}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={240}>
                              <AreaChart data={currentTask.days}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: 12,
                                  }}
                                />
                                <Area type="monotone" dataKey="forecastAccuracy" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3) / 0.15)" name="Accuracy %" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Metrics tab */}
                    <TabsContent value="metrics">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            label: t("simulation.totalRevenue"),
                            value: `₹${currentTask.days.reduce((s, d) => s + d.revenue, 0).toLocaleString()}`,
                            icon: DollarSign,
                            color: "text-primary",
                          },
                          {
                            label: t("simulation.totalProfit"),
                            value: `₹${currentTask.days.reduce((s, d) => s + d.profit, 0).toLocaleString()}`,
                            icon: TrendingUp,
                            color: "text-emerald-600 dark:text-emerald-400",
                          },
                          {
                            label: t("simulation.totalReward"),
                            value: currentTask.totalReward.toLocaleString(),
                            icon: Zap,
                            color: "text-amber-600 dark:text-amber-400",
                          },
                          {
                            label: t("simulation.score"),
                            value: `${(currentTask.score * 100).toFixed(1)}%`,
                            icon: Target,
                            color: scoreColor(currentTask.score),
                          },
                          {
                            label: t("simulation.stockoutDays"),
                            value: currentTask.days.reduce((s, d) => s + d.stockouts, 0).toString(),
                            icon: AlertTriangle,
                            color: "text-destructive",
                          },
                          {
                            label: t("simulation.overstockUnits"),
                            value: currentTask.days.reduce((s, d) => s + d.overstock, 0).toLocaleString(),
                            icon: Package,
                            color: "text-amber-600 dark:text-amber-400",
                          },
                          {
                            label: t("simulation.avgAccuracy"),
                            value: `${Math.round(currentTask.days.reduce((s, d) => s + d.forecastAccuracy, 0) / currentTask.days.length)}%`,
                            icon: Brain,
                            color: "text-primary",
                          },
                          {
                            label: t("simulation.daysRun"),
                            value: currentTask.days.length.toString(),
                            icon: BarChart3,
                            color: "text-muted-foreground",
                          },
                        ].map((m, i) => (
                          <motion.div
                            key={m.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Card className="border-border">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <m.icon className={`h-4 w-4 ${m.color}`} />
                                  <span className="text-xs text-muted-foreground">{m.label}</span>
                                </div>
                                <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* Products tab */}
                    <TabsContent value="products">
                      <Card className="border-border">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">{t("simulation.productPerformance")}</CardTitle>
                          <CardDescription className="text-xs">{t("simulation.lastDaySnapshot")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {(() => {
                              const lastDay = currentTask.days[currentTask.days.length - 1];
                              return Object.entries(lastDay.products).map(([name, data]) => {
                                const stockStatus =
                                  data.stock === 0
                                    ? "destructive"
                                    : data.stock < 10
                                    ? "secondary"
                                    : "default";
                                return (
                                  <div
                                    key={name}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-muted/30 gap-2"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Package className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium text-foreground">{name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          Demand: {data.demand} · Sold: {data.sold}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={stockStatus as any}>
                                        {data.stock === 0 ? (
                                          <span className="flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" /> Out of stock
                                          </span>
                                        ) : (
                                          <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> {data.stock} units
                                          </span>
                                        )}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!results && !running && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--gradient-primary)" }}>
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("simulation.emptyTitle")}</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">{t("simulation.emptyDesc")}</p>
            <Button onClick={runAll} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
              <Play className="h-4 w-4" />
              {t("simulation.runAll")}
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Simulation;
