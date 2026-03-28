import { Bell, CheckCircle, AlertTriangle, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Notification {
  id: string;
  titleKey: string;
  messageKey: string;
  timeKey: string;
  read: boolean;
  type: 'success' | 'warning' | 'info';
}

const NotificationsSheet = () => {
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', titleKey: 'notifs.lowStock', messageKey: 'notifs.lowStockMsg', timeKey: 'notifs.minAgo', read: false, type: 'warning' },
    { id: '2', titleKey: 'notifs.forecastUpdated', messageKey: 'notifs.forecastUpdatedMsg', timeKey: 'notifs.hourAgo', read: false, type: 'info' },
    { id: '3', titleKey: 'notifs.newStore', messageKey: 'notifs.newStoreMsg', timeKey: 'notifs.hoursAgo', read: true, type: 'success' },
    { id: '4', titleKey: 'notifs.salesMilestone', messageKey: 'notifs.salesMilestoneMsg', timeKey: 'notifs.dayAgo', read: true, type: 'success' },
    { id: '5', titleKey: 'notifs.demandSurge', messageKey: 'notifs.demandSurgeMsg', timeKey: 'notifs.daysAgo', read: true, type: 'info' },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-accent" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-chart-4" />;
      case 'info': return <TrendingUp className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">{unreadCount}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />{t("notifs.title")}</SheetTitle>
            {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllAsRead}>{t("notifs.markAllRead")}</Button>}
          </div>
          <SheetDescription>{t("notifs.subtitle")}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg border transition-colors cursor-pointer ${notification.read ? 'bg-card border-border/50' : 'bg-primary/5 border-primary/20'}`} onClick={() => markAsRead(notification.id)}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground text-sm">{t(notification.titleKey)}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-1" onClick={(e) => { e.stopPropagation(); clearNotification(notification.id); }}><X className="h-3 w-3" /></Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t(notification.messageKey)}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t(notification.timeKey)}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t("notifs.empty")}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsSheet;
