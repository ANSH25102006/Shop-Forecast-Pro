import { Settings, Moon, Sun, Monitor, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
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

const SettingsSheet = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailAlerts: true,
    stockAlerts: true,
    forecastUpdates: true,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
                JD
              </div>
              <div>
                <p className="font-semibold text-foreground">John Doe</p>
                <p className="text-sm text-muted-foreground">john@example.com</p>
                <p className="text-xs text-muted-foreground">Store Owner</p>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-foreground">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={settings.darkMode}
                  onCheckedChange={() => updateSetting('darkMode')}
                />
              </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifs" className="text-foreground">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive browser notifications</p>
                </div>
                <Switch 
                  id="push-notifs" 
                  checked={settings.notifications}
                  onCheckedChange={() => updateSetting('notifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-alerts" className="text-foreground">Email Alerts</Label>
                  <p className="text-xs text-muted-foreground">Daily summary emails</p>
                </div>
                <Switch 
                  id="email-alerts" 
                  checked={settings.emailAlerts}
                  onCheckedChange={() => updateSetting('emailAlerts')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stock-alerts" className="text-foreground">Stock Alerts</Label>
                  <p className="text-xs text-muted-foreground">Low inventory warnings</p>
                </div>
                <Switch 
                  id="stock-alerts" 
                  checked={settings.stockAlerts}
                  onCheckedChange={() => updateSetting('stockAlerts')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="forecast-updates" className="text-foreground">Forecast Updates</Label>
                  <p className="text-xs text-muted-foreground">New prediction notifications</p>
                </div>
                <Switch 
                  id="forecast-updates" 
                  checked={settings.forecastUpdates}
                  onCheckedChange={() => updateSetting('forecastUpdates')}
                />
              </div>
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
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
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
