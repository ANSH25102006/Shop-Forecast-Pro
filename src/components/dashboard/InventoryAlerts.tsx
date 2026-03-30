import { AlertTriangle, AlertCircle, Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Alert {
  id: number;
  product: string;
  type: "low" | "out" | "depleting";
  stock: number;
  daysLeft: number | null;
  descKey: string;
}

const InventoryAlerts = () => {
  const { t } = useLanguage();

  const alerts: Alert[] = [
    { id: 1, product: "Rice 5kg Bag", type: "depleting", stock: 30, daysLeft: 3, descKey: "alert.depletingIn" },
    { id: 2, product: "Organic Milk 1L", type: "low", stock: 8, daysLeft: 1, descKey: "alert.lowStockWarning" },
    { id: 3, product: "Fresh Paneer 200g", type: "out", stock: 0, daysLeft: null, descKey: "alert.outOfStock" },
    { id: 4, product: "Brown Bread", type: "depleting", stock: 15, daysLeft: 5, descKey: "alert.depletingIn" },
    { id: 5, product: "Eggs (12 pack)", type: "low", stock: 6, daysLeft: 2, descKey: "alert.lowStockWarning" },
  ];

  const typeConfig = {
    out: { icon: AlertCircle, color: "bg-destructive/10 text-destructive border-destructive/20", badge: "destructive" as const },
    low: { icon: AlertTriangle, color: "bg-chart-4/10 text-chart-4 border-chart-4/20", badge: "secondary" as const },
    depleting: { icon: Package, color: "bg-accent/10 text-accent border-accent/20", badge: "outline" as const },
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("alert.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("alert.subtitle")}</p>
          </div>
        </div>
        <Badge variant="destructive" className="text-xs animate-pulse">{alerts.length}</Badge>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <div key={alert.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:opacity-90 ${config.color}`}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{alert.product}</p>
                <p className="text-xs opacity-80">
                  {t(alert.descKey)}{alert.daysLeft !== null ? ` ${alert.daysLeft} ${t("alert.days")}` : ""} • {t("alert.stock")}: {alert.stock}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => toast.success(t("smartInsight.actionTaken"), { description: `${alert.product} - ${t("smartInsight.restockNow")}` })}
              >
                {t("smartInsight.restockNow")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryAlerts;
