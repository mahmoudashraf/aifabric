-- Create a table to store story reactions
CREATE TABLE public.story_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_slug text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reactions (anonymous)
CREATE POLICY "Anyone can add reactions"
ON public.story_reactions
FOR INSERT
WITH CHECK (true);

-- Allow reading reaction counts (via edge function with service role)
CREATE POLICY "No direct read access"
ON public.story_reactions
FOR SELECT
USING (false);

-- Create index for faster counting
CREATE INDEX idx_story_reactions_slug ON public.story_reactions(story_slug);