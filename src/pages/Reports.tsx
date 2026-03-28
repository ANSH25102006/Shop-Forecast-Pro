import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, BarChart3, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ExportReportDialog from "@/components/dashboard/ExportReportDialog";
import { useLanguage } from "@/contexts/LanguageContext";

const Reports = () => {
  const [exportOpen, setExportOpen] = useState(false);
  const { t } = useLanguage();

  const reportTypes = [
    { titleKey: "reports.salesPerf", descKey: "reports.salesPerfDesc", icon: TrendingUp, color: "text-accent", bgColor: "bg-accent/10" },
    { titleKey: "reports.inventoryStatus", descKey: "reports.inventoryStatusDesc", icon: Package, color: "text-chart-3", bgColor: "bg-chart-3/10" },
    { titleKey: "reports.demandForecast", descKey: "reports.demandForecastDesc", icon: BarChart3, color: "text-primary", bgColor: "bg-primary/10" },
    { titleKey: "reports.financial", descKey: "reports.financialDesc", icon: FileText, color: "text-chart-4", bgColor: "bg-chart-4/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab="reports" />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t("reports.title")}</h2>
            <p className="text-muted-foreground">{t("reports.subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Calendar className="h-4 w-4 mr-2" />{t("reports.schedule")}</Button>
            <Button variant="hero" onClick={() => setExportOpen(true)}><Download className="h-4 w-4 mr-2" />{t("reports.generate")}</Button>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{t("reports.available")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {reportTypes.map((report, index) => (
            <Card key={report.titleKey} className="cursor-pointer hover:shadow-elevated transition-shadow animate-fade-in" style={{ animationDelay: `${0.1 + index * 0.05}s` }} onClick={() => setExportOpen(true)}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl ${report.bgColor} flex items-center justify-center`}><report.icon className={`h-6 w-6 ${report.color}`} /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{t(report.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(report.descKey)}</p>
                  </div>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-lg">{t("reports.recent")}</CardTitle>
            <CardDescription>{t("reports.recentDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Weekly Sales Report - Jan 15, 2026", date: "Jan 15, 2026" },
                { name: "Monthly Inventory Report - Dec 2025", date: "Jan 1, 2026" },
                { name: "Q4 Forecast Accuracy Report", date: "Dec 31, 2025" },
                { name: "Annual Financial Summary 2025", date: "Dec 30, 2025" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <ExportReportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
};

export default Reports;
