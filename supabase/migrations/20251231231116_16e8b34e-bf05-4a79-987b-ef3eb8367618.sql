-- Drop the insecure SELECT policy
DROP POLICY IF EXISTS "Anyone can view registrations count" ON public.registrations;

-- Create a secure function to get registration count only
CREATE OR REPLACE FUNCTION public.get_registration_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.registrations;
$$;