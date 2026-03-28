import { useState } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExportReportDialogProps { open: boolean; onOpenChange: (open: boolean) => void; }

const ExportReportDialog = ({ open, onOpenChange }: ExportReportDialogProps) => {
  const { t } = useLanguage();
  const [reportType, setReportType] = useState("summary");
  const [isExporting, setIsExporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false); setIsComplete(true);
    const reportContent = `ForecastPro Report - ${new Date().toLocaleDateString()}\n\nReport Type: ${reportType}\n\nKey Metrics:\n- Total Products: 248\n- Monthly Sales: ₹62,400\n- Forecast Accuracy: 94.2%\n- Low Stock Alerts: 6`;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `forecastpro-report-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: t("export.exported"), description: t("export.exportedDesc") });
    setTimeout(() => { setIsComplete(false); onOpenChange(false); }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />{t("export.title")}</DialogTitle>
          <DialogDescription>{t("export.desc")}</DialogDescription>
        </DialogHeader>
        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4"><CheckCircle className="h-8 w-8 text-accent" /></div>
            <h3 className="text-lg font-semibold text-foreground">{t("export.complete")}</h3>
            <p className="text-muted-foreground text-sm">{t("export.checkDownloads")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={reportType} onValueChange={setReportType}>
              {[
                { value: "summary", labelKey: "export.summary", descKey: "export.summaryDesc" },
                { value: "detailed", labelKey: "export.detailed", descKey: "export.detailedDesc" },
                { value: "raw", labelKey: "export.raw", descKey: "export.rawDesc" },
              ].map(({ value, labelKey, descKey }) => (
                <div key={value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={value} id={value} />
                  <div className="flex-1">
                    <Label htmlFor={value} className="font-medium cursor-pointer">{t(labelKey)}</Label>
                    <p className="text-xs text-muted-foreground">{t(descKey)}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("export.cancel")}</Button>
              <Button variant="gradient" onClick={handleExport} disabled={isExporting}>
                {isExporting ? t("export.exporting") : <><Download className="h-4 w-4" />{t("export.export")}</>}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportDialog;
