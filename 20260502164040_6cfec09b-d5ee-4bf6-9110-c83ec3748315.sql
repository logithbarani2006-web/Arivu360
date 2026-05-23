
CREATE TABLE public.video_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_video_downloads_user ON public.video_downloads(user_id, downloaded_at DESC);

ALTER TABLE public.video_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
ON public.video_downloads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can record own downloads"
ON public.video_downloads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
