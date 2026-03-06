import { Package, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import Header from "@/components/layout/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import SalesChart from "@/components/dashboard/SalesChart";
import ProductTable from "@/components/dashboard/ProductTable";
import InsightCard from "@/components/dashboard/InsightCard";
import QuickActions from "@/components/dashboard/QuickActions";
import DailyRecordUpload from "@/components/dashboard/DailyRecordUpload";
import StoreNetworkSection from "@/components/stores/StoreNetworkSection";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="dashboard" />
      
      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Monitor your inventory and demand predictions</p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <MetricCard
              title="Total Products"
              value="248"
              change="+12"
              changeType="positive"
              icon={Package}
              description="Active inventory items"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
            <MetricCard
              title="Monthly Sales"
              value="₹62,400"
              change="+18.2%"
              changeType="positive"
              icon={DollarSign}
              description="Revenue this month"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <MetricCard
              title="Forecast Accuracy"
              value="94.2%"
              change="+2.1%"
              changeType="positive"
              icon={TrendingUp}
              description="ML model performance"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.25s" }}>
            <MetricCard
              title="Low Stock Alerts"
              value="6"
              change="-3"
              changeType="positive"
              icon={AlertTriangle}
              description="Items need restocking"
            />
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <SalesChart />
          </div>
          <div className="space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: "0.35s" }}>
              <InsightCard />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <QuickActions />
            </div>
          </div>
        </div>
        
        {/* Daily Material Records */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.45s" }}>
          <DailyRecordUpload />
        </div>

        {/* Product Table */}
        <div className="animate-fade-in mb-8" style={{ animationDelay: "0.5s" }}>
          <ProductTable />
        </div>

        {/* Store Network Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <StoreNetworkSection />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>ForecastPro — Intelligent Demand Forecasting for Retail</p>
          <p className="text-xs mt-1">Powered by Machine Learning</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
