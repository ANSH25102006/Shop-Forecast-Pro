import Header from "@/components/layout/Header";
import DailyRecordUpload from "@/components/dashboard/DailyRecordUpload";
import AdvancedKPICards from "@/components/dashboard/AdvancedKPICards";
import SmartInsights from "@/components/dashboard/SmartInsights";
import AdvancedCharts from "@/components/dashboard/AdvancedCharts";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import ExpenseTracker from "@/components/dashboard/ExpenseTracker";
import SmartForecastCard from "@/components/dashboard/SmartForecastCard";
import StoreNetworkSection from "@/components/stores/StoreNetworkSection";
import FloatingAddSale from "@/components/dashboard/FloatingAddSale";
import AIChatbot from "@/components/dashboard/AIChatbot";
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
        
        {/* Daily Records */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.1s" }}>
          <DailyRecordUpload />
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <AdvancedKPICards />
        </div>

        {/* Smart Forecast + Inventory Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <SmartForecastCard />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <InventoryAlerts />
          </div>
        </div>

        {/* Smart Insights with Decision Support */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.3s" }}>
          <SmartInsights />
        </div>

        {/* Advanced Charts */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.35s" }}>
          <AdvancedCharts />
        </div>

        {/* Expense Tracker */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.4s" }}>
          <ExpenseTracker />
        </div>

        {/* Store Network */}
        <div className="animate-fade-in" style={{ animationDelay: "0.45s" }}>
          <StoreNetworkSection />
        </div>
      </main>
      
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>{t("footer.tagline")}</p>
          <p className="text-xs mt-1">{t("footer.powered")}</p>
        </div>
      </footer>

      {/* Floating Actions */}
      <FloatingAddSale />
      <AIChatbot />
    </div>
  );
};

export default Dashboard;
