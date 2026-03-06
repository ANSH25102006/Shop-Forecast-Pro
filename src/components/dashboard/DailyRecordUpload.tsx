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

interface DailyRecord {
  id: string;
  record_date: string;
  image_url: string;
  notes: string | null;
  created_at: string;
}

const DailyRecordUpload = () => {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("daily_records")
      .select("*")
      .eq("user_id", user.id)
      .order("record_date", { ascending: false })
      .limit(30);

    if (!error && data) {
      setRecords(data as DailyRecord[]);
    }
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not logged in", description: "Please log in to upload records.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("daily-records")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("daily-records")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("daily_records")
        .insert({
          user_id: user.id,
          image_url: publicUrl,
          notes: notes.trim() || null,
          record_date: new Date().toISOString().split("T")[0],
        });

      if (insertError) throw insertError;

      toast({ title: "Record uploaded!", description: "Your daily material record has been saved." });

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setNotes("");
      fetchRecords();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (record: DailyRecord) => {
    try {
      // Extract file path from URL
      const urlParts = record.image_url.split("/daily-records/");
      if (urlParts[1]) {
        await supabase.storage.from("daily-records").remove([urlParts[1]]);
      }

      const { error } = await supabase
        .from("daily_records")
        .delete()
        .eq("id", record.id);

      if (error) throw error;

      toast({ title: "Record deleted" });
      fetchRecords();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setNotes("");
  };

  return (
    <Card className="p-6 border-border/50">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Daily Material Records</h3>
      </div>

      {/* Upload Area */}
      {!previewUrl ? (
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            className="flex-1 h-24 flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Take Photo</span>
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-24 flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Upload Image</span>
          </Button>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        </div>
      ) : (
        <div className="mb-6 space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-border">
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
              onClick={clearSelection}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Add notes about today's materials (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearSelection} className="flex-1">Cancel</Button>
            <Button variant="gradient" onClick={handleUpload} disabled={isUploading} className="flex-1">
              {isUploading ? "Uploading..." : "Save Record"}
            </Button>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Recent Records</span>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-4">Loading records...</p>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No records yet. Upload your first daily record!</p>
          </div>
        ) : (
          <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors"
              >
                <img
                  src={record.image_url}
                  alt="Record"
                  className="h-12 w-12 rounded-lg object-cover cursor-pointer border border-border"
                  onClick={() => setViewImage(record.image_url)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(record.record_date), "dd MMM yyyy")}
                  </p>
                  {record.notes && (
                    <p className="text-xs text-muted-foreground truncate">{record.notes}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewImage(record.image_url)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => handleDelete(record)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Preview</DialogTitle>
            <DialogDescription>Daily material record photo</DialogDescription>
          </DialogHeader>
          {viewImage && (
            <img src={viewImage} alt="Full record" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DailyRecordUpload;
