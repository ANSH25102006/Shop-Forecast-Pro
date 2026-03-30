import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const productPerformance = [
  { name: "Rice 5kg", sales: 12400, predicted: 13200 },
  { name: "Wheat Flour", sales: 8600, predicted: 9100 },
  { name: "Sugar 1kg", sales: 6200, predicted: 5800 },
  { name: "Cooking Oil", sales: 11800, predicted: 12500 },
  { name: "Dal Toor", sales: 9200, predicted: 9800 },
  { name: "Milk 1L", sales: 7400, predicted: 8200 },
  { name: "Bread", sales: 3200, predicted: 3400 },
];

const categoryData = [
  { name: "Grains & Cereals", value: 35 },
  { name: "Dairy", value: 22 },
  { name: "Oils & Spices", value: 18 },
  { name: "Beverages", value: 12 },
  { name: "Snacks", value: 8 },
  { name: "Others", value: 5 },
];

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(199, 89%, 48%)",
  "hsl(172, 66%, 50%)",
  "hsl(43, 96%, 56%)",
  "hsl(262, 83%, 58%)",
  "hsl(0, 84%, 60%)",
];

const trendData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 2000 + Math.sin(i / 5) * 400;
  return {
    day: `Day ${day}`,
    sales: Math.round(base + Math.random() * 300),
    movingAvg: Math.round(base + 50),
    predicted: i > 22 ? Math.round(base + 150 + Math.random() * 200) : null,
  };
});

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-card border border-border p-3 shadow-elevated text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">₹{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

type ChartView = "trend" | "product" | "category";

const AdvancedCharts = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<ChartView>("trend");

  const views: { key: ChartView; labelKey: string }[] = [
    { key: "trend", labelKey: "charts.salesTrend" },
    { key: "product", labelKey: "charts.productComparison" },
    { key: "category", labelKey: "charts.categoryDistribution" },
  ];

  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t("charts.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("charts.subtitle")}</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {views.map((v) => (
            <Button
              key={v.key}
              variant={view === v.key ? "default" : "ghost"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setView(v.key)}
            >
              {t(v.labelKey)}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-[320px]">
        {view === "trend" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="sales" name={t("charts.dailySales")} stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="movingAvg" name={t("charts.movingAverage")} stroke="hsl(199, 89%, 48%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="predicted" name={t("charts.predicted")} stroke="hsl(172, 66%, 50%)" strokeWidth={2} strokeDasharray="3 3" dot={false} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {view === "product" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
              <Bar dataKey="sales" name={t("charts.actualSales")} fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predicted" name={t("charts.predicted")} fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {view === "category" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, t("charts.share")]} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdvancedCharts;
