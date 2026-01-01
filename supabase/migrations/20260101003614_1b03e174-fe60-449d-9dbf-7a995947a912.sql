-- Make registrations table private for SELECT operations
-- Only service_role can read registrations (no public access to email addresses)
CREATE POLICY "No public read access to registrations"
ON public.registrations
FOR SELECT
USING (false);