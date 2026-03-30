import { TrendingUp, TrendingDown, Target, Calendar, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const SmartForecastCard = () => {
  const { t } = useLanguage();

  const forecasts = [
    {
      period: t("forecast.next7"),
      value: "₹48,200",
      confidence: "94.2%",
      direction: "up" as const,
      change: "+12%",
      movingAvg: "₹44,800",
    },
    {
      period: t("forecast.next30"),
      value: "₹1,85,600",
      confidence: "89.5%",
      direction: "up" as const,
      change: "+8%",
      movingAvg: "₹1,72,000",
    },
  ];

  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Zap className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t("forecast.smartTitle")}</h3>
          <p className="text-xs text-muted-foreground">{t("forecast.smartSubtitle")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {forecasts.map((fc, i) => (
          <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{fc.period}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                <Target className="h-2.5 w-2.5 mr-1" />
                {fc.confidence}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{fc.value}</p>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold flex items-center gap-1 ${fc.direction === "up" ? "text-accent" : "text-destructive"}`}>
                {fc.direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {fc.change} {t("forecast.vsLastPeriod")}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("forecast.movingAvg")}: {fc.movingAvg}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trend Detection */}
      <div className="mt-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-accent">{t("forecast.demandIncreasing")}</span>
        </div>
        <p className="text-xs text-muted-foreground">{t("forecast.trendDesc")}</p>
      </div>
    </div>
  );
};

export default SmartForecastCard;
