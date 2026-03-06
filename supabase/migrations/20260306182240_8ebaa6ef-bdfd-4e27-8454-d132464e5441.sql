
-- Create storage bucket for daily record photos
INSERT INTO storage.buckets (id, name, public) VALUES ('daily-records', 'daily-records', true);

-- Create table for daily material records
CREATE TABLE public.daily_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  image_url text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_records ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own records" ON public.daily_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own records" ON public.daily_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" ON public.daily_records
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Authenticated users can upload daily records" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'daily-records');

CREATE POLICY "Users can view daily record images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'daily-records');

CREATE POLICY "Users can delete their own daily record images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'daily-records');

-- Trigger for updated_at
CREATE TRIGGER update_daily_records_updated_at
  BEFORE UPDATE ON public.daily_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_records;
