-- Create simple registrations table for tracking interest
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public inserts and reads for count
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to register (insert)
CREATE POLICY "Anyone can register" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to count registrations (select)
CREATE POLICY "Anyone can view registrations count" 
ON public.registrations 
FOR SELECT 
USING (true);