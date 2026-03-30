import { DollarSign, ShoppingCart, TrendingUp, Target, AlertTriangle, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface KPIData {
  titleKey: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  descKey: string;
  color: string;
}

const AdvancedKPICards = () => {
  const { t } = useLanguage();

  const kpis: KPIData[] = [
    {
      titleKey: "kpi.totalRevenue",
      value: "₹62,400",
      change: "+18.2%",
      changeType: "positive",
      icon: DollarSign,
      descKey: "kpi.revenueDesc",
      color: "from-primary to-accent",
    },
    {
      titleKey: "kpi.totalOrders",
      value: "1,248",
      change: "+12.5%",
      changeType: "positive",
      icon: ShoppingCart,
      descKey: "kpi.ordersDesc",
      color: "from-accent to-primary",
    },
    {
      titleKey: "kpi.profit",
      value: "₹20,800",
      change: "+8.3%",
      changeType: "positive",
      icon: TrendingUp,
      descKey: "kpi.profitDesc",
      color: "from-chart-3 to-accent",
    },
    {
      titleKey: "kpi.growth",
      value: "18.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: Percent,
      descKey: "kpi.growthDesc",
      color: "from-chart-4 to-chart-5",
    },
    {
      titleKey: "kpi.forecastAccuracy",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: Target,
      descKey: "kpi.accuracyDesc",
      color: "from-chart-5 to-primary",
    },
    {
      titleKey: "kpi.lowStockAlerts",
      value: "6",
      change: "-3",
      changeType: "positive",
      icon: AlertTriangle,
      descKey: "kpi.alertsDesc",
      color: "from-destructive to-chart-4",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.titleKey}
            className="group relative overflow-hidden rounded-xl bg-card p-5 shadow-card transition-all duration-300 hover:shadow-elevated border border-border/50 animate-fade-in"
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="absolute inset-0 gradient-hero opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br mb-3 transition-transform duration-300 group-hover:scale-110", kpi.color)}>
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{t(kpi.titleKey)}</p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded-full",
                  kpi.changeType === "positive" && "bg-accent/10 text-accent",
                  kpi.changeType === "negative" && "bg-destructive/10 text-destructive",
                )}>
                  {kpi.change}
                </span>
                <span className="text-[10px] text-muted-foreground">{t(kpi.descKey)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdvancedKPICards;
