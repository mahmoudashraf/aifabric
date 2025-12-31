-- Add CHECK constraint for email validation and length limit
ALTER TABLE public.registrations 
ADD CONSTRAINT registrations_email_format_check 
CHECK (
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
  AND char_length(email) <= 255
);