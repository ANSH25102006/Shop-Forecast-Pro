import { Lightbulb, ArrowRight, Package, TrendingDown, TrendingUp, AlertTriangle, DollarSign, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Insight {
  id: number;
  titleKey: string;
  descKey: string;
  type: "warning" | "opportunity" | "info" | "danger";
  icon: React.ElementType;
  actions: { labelKey: string; variant: "default" | "outline" | "destructive" }[];
}

const SmartInsights = () => {
  const { t } = useLanguage();

  const insights: Insight[] = [
    {
      id: 1,
      titleKey: "smartInsight.stockDepletion",
      descKey: "smartInsight.stockDepletionDesc",
      type: "danger",
      icon: AlertTriangle,
      actions: [{ labelKey: "smartInsight.restockNow", variant: "default" }],
    },
    {
      id: 2,
      titleKey: "smartInsight.salesGrowth",
      descKey: "smartInsight.salesGrowthDesc",
      type: "opportunity",
      icon: TrendingUp,
      actions: [{ labelKey: "smartInsight.increasePrice", variant: "outline" }],
    },
    {
      id: 3,
      titleKey: "smartInsight.lowPerformer",
      descKey: "smartInsight.lowPerformerDesc",
      type: "warning",
      icon: TrendingDown,
      actions: [{ labelKey: "smartInsight.reduceInventory", variant: "outline" }],
    },
    {
      id: 4,
      titleKey: "smartInsight.bestSeller",
      descKey: "smartInsight.bestSellerDesc",
      type: "info",
      icon: ShoppingCart,
      actions: [{ labelKey: "smartInsight.restockNow", variant: "default" }],
    },
    {
      id: 5,
      titleKey: "smartInsight.overstockAlert",
      descKey: "smartInsight.overstockAlertDesc",
      type: "warning",
      icon: Package,
      actions: [
        { labelKey: "smartInsight.reduceInventory", variant: "outline" },
        { labelKey: "smartInsight.increasePrice", variant: "outline" },
      ],
    },
  ];

  const typeStyles = {
    danger: "border-l-destructive bg-destructive/5",
    warning: "border-l-chart-4 bg-chart-4/5",
    opportunity: "border-l-accent bg-accent/5",
    info: "border-l-primary bg-primary/5",
  };

  const typeBadge = {
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-chart-4/10 text-chart-4",
    opportunity: "bg-accent/10 text-accent",
    info: "bg-primary/10 text-primary",
  };

  const handleAction = (actionKey: string) => {
    toast.success(t("smartInsight.actionTaken"), { description: t(actionKey) });
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("smartInsight.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("smartInsight.subtitle")}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">{insights.length} {t("smartInsight.active")}</Badge>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border-l-4 transition-colors ${typeStyles[insight.type]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground text-sm">{t(insight.titleKey)}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeBadge[insight.type]}`}>
                      {insight.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(insight.descKey)}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {insight.actions.map((action) => (
                      <Button
                        key={action.labelKey}
                        variant={action.variant}
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleAction(action.labelKey)}
                      >
                        {t(action.labelKey)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary">
        {t("smartInsight.viewAll")}
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default SmartInsights;
