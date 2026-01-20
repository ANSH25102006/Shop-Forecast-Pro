import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const insights = [
  {
    id: 1,
    title: "Stock Alert",
    description: "Rice 5kg bags are predicted to run out in 3 days. Consider restocking 40+ units.",
    type: "warning",
  },
  {
    id: 2,
    title: "Demand Surge",
    description: "Organic Milk demand is trending 23% higher than last month. Increase orders.",
    type: "opportunity",
  },
  {
    id: 3,
    title: "Overstock Alert",
    description: "Sugar inventory exceeds predicted demand. Consider promotional pricing.",
    type: "info",
  },
];

const InsightCard = () => {
  return (
    <div className="rounded-xl bg-card p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="group p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{insight.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary">
        View All Insights
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default InsightCard;
