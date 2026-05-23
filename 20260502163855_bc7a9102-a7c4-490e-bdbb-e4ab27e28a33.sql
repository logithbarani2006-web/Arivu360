
-- Public storage bucket for course videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-videos', 'course-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
CREATE POLICY "Course videos are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

CREATE POLICY "Admins can upload course videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  lessons INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  video_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view courses"
ON public.courses FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert courses"
ON public.courses FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
ON public.courses FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
ON public.courses FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial course list (matches the hard-coded list)
INSERT INTO public.courses (slug, title, description, category, language, lessons, icon, sort_order) VALUES
  ('physics-fundamentals', 'Physics Fundamentals', 'Explore mechanics, electricity, and optics with interactive simulations and video lessons.', 'Science', 'Kannada / English', 42, 'FlaskConical', 1),
  ('algebra-geometry', 'Algebra & Geometry', 'Master equations, proofs, and geometric constructions with step-by-step guidance.', 'Mathematics', 'Tamil / English', 38, 'Calculator', 2),
  ('kannada-literature', 'Kannada Literature', 'Dive into Kannada poetry, prose, and grammar through engaging storytelling.', 'Languages', 'Kannada', 30, 'BookOpen', 3),
  ('biology-life-sciences', 'Biology & Life Sciences', 'Study human anatomy, ecosystems, and genetics with rich visual aids.', 'Science', 'English', 45, 'FlaskConical', 4),
  ('creative-drawing', 'Creative Drawing', 'Learn sketching, color theory, and digital illustration from professional artists.', 'Arts', 'English', 24, 'Palette', 5),
  ('intro-to-coding', 'Intro to Coding', 'Build your first programs with beginner-friendly Python and Scratch lessons.', 'Technology', 'English / Tamil', 35, 'Code', 6),
  ('tamil-for-beginners', 'Tamil for Beginners', 'Learn Tamil reading, writing, and conversation from scratch with native speakers.', 'Languages', 'Tamil', 28, 'Globe', 7),
  ('statistics-probability', 'Statistics & Probability', 'Understand data analysis, probability, and real-world statistical applications.', 'Mathematics', 'English', 32, 'Calculator', 8),
  ('indian-classical-music', 'Indian Classical Music', 'Explore ragas, talas, and Carnatic music fundamentals with audio lessons.', 'Arts', 'Kannada / Tamil', 20, 'Palette', 9);
