import Header from "@/components/layout/Header";
import SalesChart from "@/components/dashboard/SalesChart";
import InsightCard from "@/components/dashboard/InsightCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, TrendingUp, Download, X, Package, Clock, Target, BarChart3 } from "lucide-react";
import { useState } from "react";
import RunForecastDialog from "@/components/dashboard/RunForecastDialog";
import ExportReportDialog from "@/components/dashboard/ExportReportDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface ForecastDetail {
  label: string;
  value: string;
  trend: string;
  items: { name: string; value: string; detail: string }[];
}

const Forecasts = () => {
  const [forecastOpen, setForecastOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<ForecastDetail | null>(null);
  const { t } = useLanguage();

  const forecastMetrics: ForecastDetail[] = [
    {
      label: t("forecasts.7day"),
      value: "₹48,200",
      trend: "+12%",
      items: [
        { name: t("products.product") + " - Rice 5kg", value: "₹12,400", detail: t("forecasts.7day") + ": 120 units" },
        { name: t("products.product") + " - Wheat Flour", value: "₹8,600", detail: t("forecasts.7day") + ": 95 units" },
        { name: t("products.product") + " - Sugar 1kg", value: "₹6,200", detail: t("forecasts.7day") + ": 180 units" },
        { name: t("products.product") + " - Cooking Oil", value: "₹11,800", detail: t("forecasts.7day") + ": 65 units" },
        { name: t("products.product") + " - Dal Toor", value: "₹9,200", detail: t("forecasts.7day") + ": 85 units" },
      ],
    },
    {
      label: t("forecasts.30day"),
      value: "₹1,85,600",
      trend: "+8%",
      items: [
        { name: t("products.product") + " - Rice 5kg", value: "₹48,000", detail: t("forecasts.30day") + ": 480 units" },
        { name: t("products.product") + " - Wheat Flour", value: "₹35,200", detail: t("forecasts.30day") + ": 390 units" },
        { name: t("products.product") + " - Sugar 1kg", value: "₹24,800", detail: t("forecasts.30day") + ": 720 units" },
        { name: t("products.product") + " - Cooking Oil", value: "₹45,600", detail: t("forecasts.30day") + ": 260 units" },
        { name: t("products.product") + " - Dal Toor", value: "₹32,000", detail: t("forecasts.30day") + ": 340 units" },
      ],
    },
    {
      label: t("forecasts.accuracyRate"),
      value: "94.2%",
      trend: "+2.1%",
      items: [
        { name: "Rice 5kg", value: "96.5%", detail: t("forecasts.accuracyRate") },
        { name: "Wheat Flour", value: "93.8%", detail: t("forecasts.accuracyRate") },
        { name: "Sugar 1kg", value: "95.1%", detail: t("forecasts.accuracyRate") },
        { name: "Cooking Oil", value: "91.4%", detail: t("forecasts.accuracyRate") },
        { name: "Dal Toor", value: "94.2%", detail: t("forecasts.accuracyRate") },
      ],
    },
    {
      label: t("forecasts.nextRestock"),
      value: "3 days",
      trend: "6 items",
      items: [
        { name: "Rice 5kg Bag", value: "2 " + t("forecasts.nextRestock"), detail: "30 units → Reorder 50" },
        { name: "Organic Milk 1L", value: "1 " + t("forecasts.nextRestock"), detail: "8 units → Reorder 40" },
        { name: "Brown Bread", value: "3 " + t("forecasts.nextRestock"), detail: "15 units → Reorder 30" },
        { name: "Eggs (12 pack)", value: "4 " + t("forecasts.nextRestock"), detail: "22 units → Reorder 60" },
        { name: "Fresh Paneer", value: "2 " + t("forecasts.nextRestock"), detail: "5 units → Reorder 25" },
        { name: "Curd 500g", value: "3 " + t("forecasts.nextRestock"), detail: "12 units → Reorder 35" },
      ],
    },
  ];

  const metricIcons = [BarChart3, Target, TrendingUp, Clock];

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="forecasts" />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("forecasts.title")}</h2>
            <p className="text-muted-foreground">{t("forecasts.subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Calendar className="h-4 w-4 mr-2" />{t("forecasts.last30")}</Button>
            <Button variant="hero" onClick={() => setForecastOpen(true)}><RefreshCw className="h-4 w-4 mr-2" />{t("forecasts.runNew")}</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {forecastMetrics.map((metric, index) => {
            const Icon = metricIcons[index];
            return (
              <Card
                key={index}
                className="animate-fade-in cursor-pointer hover:shadow-elevated transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                onClick={() => setSelectedMetric(metric)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-accent mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />{metric.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.3s" }}><SalesChart /></div>
          <div className="animate-fade-in" style={{ animationDelay: "0.35s" }}><InsightCard /></div>
        </div>
        <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <CardHeader><CardTitle className="text-lg">{t("forecasts.exportTitle")}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t("forecasts.exportDesc")}</p>
            <Button variant="outline" onClick={() => setExportOpen(true)}><Download className="h-4 w-4 mr-2" />{t("forecasts.exportReport")}</Button>
          </CardContent>
        </Card>
      </main>

      {/* Metric Detail Dialog */}
      <Dialog open={!!selectedMetric} onOpenChange={(open) => !open && setSelectedMetric(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {selectedMetric?.label}
            </DialogTitle>
            <DialogDescription>
              {selectedMetric?.value} — {selectedMetric?.trend}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedMetric?.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <RunForecastDialog open={forecastOpen} onOpenChange={setForecastOpen} />
      <ExportReportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
};

export default Forecasts;
