import { BarChart3, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-card">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">ForecastPro</h1>
            <p className="text-xs text-muted-foreground">Retail Demand Intelligence</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Products
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Forecasts
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Reports
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="ml-2 h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
