import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "GET") {
      // Get reaction count for a story
      const url = new URL(req.url);
      const storySlug = url.searchParams.get("story_slug");

      if (!storySlug) {
        console.log("GET request missing story_slug parameter");
        return new Response(
          JSON.stringify({ error: "story_slug is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Fetching reaction count for story: ${storySlug}`);

      const { count, error } = await supabase
        .from("story_reactions")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", storySlug);

      if (error) {
        console.error("Error fetching reaction count:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Reaction count for ${storySlug}: ${count}`);

      return new Response(
        JSON.stringify({ count: count || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "POST") {
      // Add a reaction to a story
      const { story_slug } = await req.json();

      if (!story_slug) {
        console.log("POST request missing story_slug in body");
        return new Response(
          JSON.stringify({ error: "story_slug is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Adding reaction to story: ${story_slug}`);

      const { error } = await supabase
        .from("story_reactions")
        .insert({ story_slug });

      if (error) {
        console.error("Error adding reaction:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get updated count
      const { count } = await supabase
        .from("story_reactions")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", story_slug);

      console.log(`Reaction added successfully. New count: ${count}`);

      return new Response(
        JSON.stringify({ success: true, count: count || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === "DELETE") {
      // Remove a reaction from a story
      const url = new URL(req.url);
      const storySlug = url.searchParams.get("story_slug");

      if (!storySlug) {
        console.log("DELETE request missing story_slug parameter");
        return new Response(
          JSON.stringify({ error: "story_slug is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Removing reaction from story: ${storySlug}`);

      // Get one reaction to delete (since we don't track users, we delete the most recent one)
      const { data: reactions, error: fetchError } = await supabase
        .from("story_reactions")
        .select("id")
        .eq("story_slug", storySlug)
        .order("created_at", { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error("Error fetching reaction to delete:", fetchError);
        return new Response(
          JSON.stringify({ error: fetchError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!reactions || reactions.length === 0) {
        // No reactions to remove
        const { count } = await supabase
          .from("story_reactions")
          .select("*", { count: "exact", head: true })
          .eq("story_slug", storySlug);

        return new Response(
          JSON.stringify({ success: true, count: count || 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Delete the most recent reaction
      const { error: deleteError } = await supabase
        .from("story_reactions")
        .delete()
        .eq("id", reactions[0].id);

      if (deleteError) {
        console.error("Error deleting reaction:", deleteError);
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get updated count
      const { count } = await supabase
        .from("story_reactions")
        .select("*", { count: "exact", head: true })
        .eq("story_slug", storySlug);

      console.log(`Reaction removed successfully. New count: ${count}`);

      return new Response(
        JSON.stringify({ success: true, count: count || 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
