import { useState } from "react";
import { BarChart3, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationsSheet from "./NotificationsSheet";
import SettingsSheet from "./SettingsSheet";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  activeTab?: string;
}

const Header = ({ activeTab }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const currentTab = activeTab || location.pathname.replace("/", "") || "dashboard";

  const navItems = [
    { label: t("nav.dashboard"), key: "dashboard", path: "/dashboard" },
    { label: t("nav.products"), key: "products", path: "/products" },
    { label: t("nav.forecasts"), key: "forecasts", path: "/forecasts" },
    { label: t("nav.reports"), key: "reports", path: "/reports" },
    { label: t("nav.simulation"), key: "simulation", path: "/simulation" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/dashboard")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-card">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">{t("app.name")}</h1>
              <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
            </div>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`${
                  isActive
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationsSheet />
          <SettingsSheet />
          <div className="ml-2 h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
            JD
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
          <nav className="container py-2 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.key;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`justify-start ${
                    isActive
                      ? "text-foreground bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
