import { Settings, Sun, User, Bell, Shield, HelpCircle, LogOut, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useLanguage, languageNames, type Language } from "@/contexts/LanguageContext";

const SettingsSheet = () => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState(() => ({
    darkMode: document.documentElement.classList.contains('dark'),
    notifications: true, emailAlerts: true, stockAlerts: true, forecastUpdates: true,
  }));

  const updateSetting = (key: keyof typeof settings) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      if (key === 'darkMode') {
        if (newSettings.darkMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }
      return newSettings;
    });
  };

  const languages = Object.entries(languageNames) as [Language, { label: string; flag: string }][];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground"><Settings className="h-5 w-5" /></Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />{t("settings.title")}</SheetTitle>
          <SheetDescription>{t("settings.subtitle")}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Profile */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><User className="h-4 w-4" />{t("settings.profile")}</h4>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">JD</div>
              <div>
                <p className="font-semibold text-foreground">John Doe</p>
                <p className="text-sm text-muted-foreground">john@example.com</p>
                <p className="text-xs text-muted-foreground">{t("common.storeOwner")}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Language */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Languages className="h-4 w-4" />{t("settings.language")}</h4>
            <p className="text-xs text-muted-foreground mb-3">{t("settings.languageDesc")}</p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(([key, { label, flag }]) => (
                <Button key={key} variant={language === key ? "default" : "outline"} size="sm" onClick={() => setLanguage(key)} className="text-xs">
                  {flag} {label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Sun className="h-4 w-4" />{t("settings.appearance")}</h4>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-foreground">{t("settings.darkMode")}</Label>
                <p className="text-xs text-muted-foreground">{t("settings.darkModeDesc")}</p>
              </div>
              <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={() => updateSetting('darkMode')} />
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Bell className="h-4 w-4" />{t("settings.notifications")}</h4>
            <div className="space-y-4">
              {([['push-notifs', 'pushNotifs', 'pushNotifsDesc', 'notifications'], ['email-alerts', 'emailAlerts', 'emailAlertsDesc', 'emailAlerts'], ['stock-alerts', 'stockAlerts', 'stockAlertsDesc', 'stockAlerts'], ['forecast-updates', 'forecastUpdates', 'forecastUpdatesDesc', 'forecastUpdates']] as const).map(([id, labelKey, descKey, settingKey]) => (
                <div key={id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={id} className="text-foreground">{t(`settings.${labelKey}`)}</Label>
                    <p className="text-xs text-muted-foreground">{t(`settings.${descKey}`)}</p>
                  </div>
                  <Switch id={id} checked={settings[settingKey]} onCheckedChange={() => updateSetting(settingKey)} />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2"><Shield className="h-4 w-4" />{t("settings.privacy")}</Button>
            <Button variant="ghost" className="w-full justify-start gap-2"><HelpCircle className="h-4 w-4" />{t("settings.help")}</Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive"><LogOut className="h-4 w-4" />{t("settings.logout")}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
