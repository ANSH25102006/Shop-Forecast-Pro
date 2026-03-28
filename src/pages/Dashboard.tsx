import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import SalesChart from "@/components/dashboard/SalesChart";
import InsightCard from "@/components/dashboard/InsightCard";
import DailyRecordUpload from "@/components/dashboard/DailyRecordUpload";
import StoreNetworkSection from "@/components/stores/StoreNetworkSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="dashboard" />
      
      <main className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">{t("dashboard.title")}</h2>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.1s" }}>
          <DailyRecordUpload />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <MetricCard title={t("dashboard.totalProducts")} value="248" change="+12" changeType="positive" icon={Package} description={t("dashboard.activeItems")} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <MetricCard title={t("dashboard.monthlySales")} value="₹62,400" change="+18.2%" changeType="positive" icon={DollarSign} description={t("dashboard.revenueMonth")} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <MetricCard title={t("dashboard.forecastAccuracy")} value="94.2%" change="+2.1%" changeType="positive" icon={TrendingUp} description={t("dashboard.mlPerformance")} />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <MetricCard title={t("dashboard.lowStockAlerts")} value="6" change="-3" changeType="positive" icon={AlertTriangle} description={t("dashboard.needsRestocking")} />
          </div>
        </div>

        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.35s" }}>
          <InsightCard />
        </div>
        
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.4s" }}>
          <SalesChart />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.55s" }}>
          <StoreNetworkSection />
        </div>
      </main>
      
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>{t("footer.tagline")}</p>
          <p className="text-xs mt-1">{t("footer.powered")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
