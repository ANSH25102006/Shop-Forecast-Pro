import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, BarChart3, TrendingUp, Package, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import ExportReportDialog from "@/components/dashboard/ExportReportDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ReportDetail {
  titleKey: string;
  rows: { label: string; value: string }[];
}

const Reports = () => {
  const [exportOpen, setExportOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [viewReport, setViewReport] = useState<ReportDetail | null>(null);
  const { t } = useLanguage();

  const reportTypes = [
    { titleKey: "reports.salesPerf", descKey: "reports.salesPerfDesc", icon: TrendingUp, color: "text-accent", bgColor: "bg-accent/10" },
    { titleKey: "reports.inventoryStatus", descKey: "reports.inventoryStatusDesc", icon: Package, color: "text-chart-3", bgColor: "bg-chart-3/10" },
    { titleKey: "reports.demandForecast", descKey: "reports.demandForecastDesc", icon: BarChart3, color: "text-primary", bgColor: "bg-primary/10" },
    { titleKey: "reports.financial", descKey: "reports.financialDesc", icon: FileText, color: "text-chart-4", bgColor: "bg-chart-4/10" },
  ];

  const reportDetails: Record<string, ReportDetail> = {
    "reports.salesPerf": {
      titleKey: "reports.salesPerf",
      rows: [
        { label: "Daily Average Sales", value: "₹2,080" },
        { label: "Weekly Sales", value: "₹14,560" },
        { label: "Monthly Sales", value: "₹62,400" },
        { label: "Top Selling Product", value: "Rice 5kg Bag" },
        { label: "Sales Growth", value: "+18.2%" },
        { label: "Total Transactions", value: "1,248" },
      ],
    },
    "reports.inventoryStatus": {
      titleKey: "reports.inventoryStatus",
      rows: [
        { label: "Total SKUs", value: "248" },
        { label: "In Stock", value: "196 items" },
        { label: "Low Stock", value: "38 items" },
        { label: "Out of Stock", value: "14 items" },
        { label: "Inventory Turnover", value: "4.2x" },
        { label: "Average Reorder Time", value: "3.5 days" },
      ],
    },
    "reports.demandForecast": {
      titleKey: "reports.demandForecast",
      rows: [
        { label: "7-Day Forecast", value: "₹48,200" },
        { label: "30-Day Forecast", value: "₹1,85,600" },
        { label: "Model Accuracy", value: "94.2%" },
        { label: "Products Analyzed", value: "248" },
        { label: "Restock Alerts", value: "6 items" },
        { label: "Demand Surge Items", value: "3 items" },
      ],
    },
    "reports.financial": {
      titleKey: "reports.financial",
      rows: [
        { label: "Total Revenue", value: "₹62,400" },
        { label: "Cost of Goods", value: "₹41,600" },
        { label: "Gross Profit", value: "₹20,800" },
        { label: "Profit Margin", value: "33.3%" },
        { label: "Operating Expenses", value: "₹8,200" },
        { label: "Net Profit", value: "₹12,600" },
      ],
    },
  };

  const recentReports = [
    { name: "Weekly Sales Report - Jan 15, 2026", date: "Jan 15, 2026", type: "reports.salesPerf" },
    { name: "Monthly Inventory Report - Dec 2025", date: "Jan 1, 2026", type: "reports.inventoryStatus" },
    { name: "Q4 Forecast Accuracy Report", date: "Dec 31, 2025", type: "reports.demandForecast" },
    { name: "Annual Financial Summary 2025", date: "Dec 30, 2025", type: "reports.financial" },
  ];

  const handleDownload = (reportName: string) => {
    toast.success(t("export.exported"), { description: reportName });
  };

  const handleSchedule = () => {
    setScheduleOpen(true);
  };

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
            <Button variant="outline" onClick={handleSchedule}><Calendar className="h-4 w-4 mr-2" />{t("reports.schedule")}</Button>
            <Button variant="hero" onClick={() => setExportOpen(true)}><Download className="h-4 w-4 mr-2" />{t("reports.generate")}</Button>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{t("reports.available")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {reportTypes.map((report, index) => (
            <Card
              key={report.titleKey}
              className="cursor-pointer hover:shadow-elevated transition-all hover:scale-[1.01] animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              onClick={() => setViewReport(reportDetails[report.titleKey])}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl ${report.bgColor} flex items-center justify-center`}><report.icon className={`h-6 w-6 ${report.color}`} /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{t(report.titleKey)}</h4>
                    <p className="text-sm text-muted-foreground">{t(report.descKey)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDownload(t(report.titleKey)); }}><Download className="h-4 w-4" /></Button>
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
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setViewReport(reportDetails[report.type])}>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setViewReport(reportDetails[report.type])}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(report.name)}><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Report Detail Dialog */}
      <Dialog open={!!viewReport} onOpenChange={(open) => !open && setViewReport(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewReport ? t(viewReport.titleKey) : ""}</DialogTitle>
            <DialogDescription>{t("reports.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {viewReport?.rows.map((row, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-foreground">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => { handleDownload(viewReport ? t(viewReport.titleKey) : ""); setViewReport(null); }}>
              <Download className="h-4 w-4 mr-2" />{t("export.export")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("reports.schedule")}</DialogTitle>
            <DialogDescription>{t("reports.subtitle")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {["Daily", "Weekly", "Monthly", "Quarterly"].map((freq) => (
              <Button
                key={freq}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  toast.success(t("reports.schedule"), { description: `${freq} schedule set` });
                  setScheduleOpen(false);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />{freq}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ExportReportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
};

export default Reports;
