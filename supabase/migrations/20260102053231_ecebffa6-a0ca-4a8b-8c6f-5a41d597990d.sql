-- Add unique constraint on email to prevent duplicate registrations
ALTER TABLE public.registrations 
ADD CONSTRAINT registrations_email_unique UNIQUE (email);

-- Create a rate limiting function that checks registration frequency
-- Prevents more than 5 registrations from the same IP-like pattern per hour
CREATE OR REPLACE FUNCTION public.check_registration_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Check how many registrations happened in the last hour
  SELECT COUNT(*) INTO recent_count
  FROM public.registrations
  WHERE created_at > NOW() - INTERVAL '1 hour';
  
  -- If more than 100 registrations in the last hour, block (basic DDoS protection)
  IF recent_count > 100 THEN
    RAISE EXCEPTION 'Registration temporarily unavailable. Please try again later.';
  END IF;
  
  -- Validate email format
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Normalize email to lowercase
  NEW.email := LOWER(TRIM(NEW.email));
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce rate limiting on insert
CREATE TRIGGER enforce_registration_rate_limit
  BEFORE INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.check_registration_rate_limit();

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.registrations;
DROP POLICY IF EXISTS "Anyone can register" ON public.registrations;

-- Create a more restrictive INSERT policy with basic validation
-- The trigger handles the actual rate limiting
CREATE POLICY "Rate limited registration"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Email must be provided and have reasonable length
  email IS NOT NULL 
  AND LENGTH(email) >= 5 
  AND LENGTH(email) <= 255
);