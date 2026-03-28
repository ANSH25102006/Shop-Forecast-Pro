import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Calendar, Trash2, Eye, ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyRecord {
  id: string;
  record_date: string;
  image_url: string;
  notes: string | null;
  created_at: string;
}

const DailyRecordUpload = () => {
  const { t } = useLanguage();
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    fetchRecords();
    return () => {
      stopCamera();
    };
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("daily_records")
      .select("*")
      .eq("user_id", user.id)
      .order("record_date", { ascending: false })
      .limit(30);
    if (!error && data) setRecords(data as DailyRecord[]);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: t("records.invalidFile"), description: t("records.selectImage"), variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: t("records.fileTooLarge"), description: t("records.maxSize"), variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      // Fallback to file input with capture
      cameraInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
    }, "image/jpeg", 0.9);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: t("records.notLoggedIn"), description: t("records.pleaseLogin"), variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("daily-records").upload(fileName, selectedFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("daily-records").getPublicUrl(fileName);
      const { error: insertError } = await supabase.from("daily_records").insert({
        user_id: user.id, image_url: publicUrl, notes: notes.trim() || null,
        record_date: new Date().toISOString().split("T")[0],
      });
      if (insertError) throw insertError;
      toast({ title: t("records.uploaded"), description: t("records.uploadedDesc") });
      setSelectedFile(null); setPreviewUrl(null); setNotes("");
      fetchRecords();
    } catch (err: any) {
      toast({ title: t("records.uploadFailed"), description: err.message || t("common.something_wrong"), variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (record: DailyRecord) => {
    try {
      const urlParts = record.image_url.split("/daily-records/");
      if (urlParts[1]) await supabase.storage.from("daily-records").remove([urlParts[1]]);
      const { error } = await supabase.from("daily_records").delete().eq("id", record.id);
      if (error) throw error;
      toast({ title: t("records.deleted") });
      fetchRecords();
    } catch (err: any) {
      toast({ title: t("records.deleteFailed"), description: err.message, variant: "destructive" });
    }
  };

  const clearSelection = () => { setSelectedFile(null); setPreviewUrl(null); setNotes(""); };

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">{t("records.title")}</h3>
      </div>

      {/* Camera View */}
      {showCamera && (
        <div className="mb-6 space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-border bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={stopCamera} className="flex-1">{t("records.cancel")}</Button>
            <Button variant="default" onClick={capturePhoto} className="flex-1">
              <Camera className="h-4 w-4 mr-2" />
              {t("records.takePhoto")}
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!previewUrl && !showCamera ? (
        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1 h-24 flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5" onClick={startCamera}>
            <Camera className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{t("records.takePhoto")}</span>
          </Button>
          <Button variant="outline" className="flex-1 h-24 flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">{t("records.uploadImage")}</span>
          </Button>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : previewUrl ? (
        <div className="mb-6 space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground" onClick={clearSelection}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea placeholder={t("records.addNotes")} value={notes} onChange={(e) => setNotes(e.target.value)} className="resize-none" rows={2} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearSelection} className="flex-1">{t("records.cancel")}</Button>
            <Button variant="gradient" onClick={handleUpload} disabled={isUploading} className="flex-1">
              {isUploading ? t("records.uploading") : t("records.save")}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{t("records.recent")}</span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t("records.loading")}</p>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">{t("records.empty")}</p>
          </div>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
            {records.map((record) => (
              <div key={record.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
                <img src={record.image_url} alt="Record" className="h-12 w-12 rounded-lg object-cover cursor-pointer border border-border" onClick={() => setViewImage(record.image_url)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{format(new Date(record.record_date), "dd MMM yyyy")}</p>
                  {record.notes && <p className="text-xs text-muted-foreground truncate">{record.notes}</p>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewImage(record.image_url)}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(record)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("records.preview")}</DialogTitle>
            <DialogDescription>{t("records.previewDesc")}</DialogDescription>
          </DialogHeader>
          {viewImage && <img src={viewImage} alt="Full record" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DailyRecordUpload;
