import { Settings, Sun, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const SettingsSheet = () => {
  const { user, displayName, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailAlerts: true,
    stockAlerts: true,
    forecastUpdates: true,
  });

  const updateSetting = (key: keyof typeof settings) => {
    if (key === "darkMode") {
      const next = !settings.darkMode;
      document.documentElement.classList.toggle("dark", next);
      setSettings(prev => ({ ...prev, darkMode: next }));
    } else {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Manage your account and preferences
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Profile Section */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </h4>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{displayName || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{role || "owner"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => updateSetting("darkMode")}
              />
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </h4>
            <div className="space-y-4">
              {[
                { id: "notifications", label: "Push Notifications", desc: "Receive browser notifications" },
                { id: "emailAlerts", label: "Email Alerts", desc: "Daily summary emails" },
                { id: "stockAlerts", label: "Stock Alerts", desc: "Low inventory warnings" },
                { id: "forecastUpdates", label: "Forecast Updates", desc: "New prediction notifications" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={item.id} className="text-foreground">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    id={item.id}
                    checked={settings[item.id as keyof typeof settings]}
                    onCheckedChange={() => updateSetting(item.id as keyof typeof settings)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Links */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Shield className="h-4 w-4" />
              Privacy & Security
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <HelpCircle className="h-4 w-4" />
              Help & Support
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
