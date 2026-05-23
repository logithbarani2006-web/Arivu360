DROP POLICY IF EXISTS "Authenticated users can view courses" ON public.courses;
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);