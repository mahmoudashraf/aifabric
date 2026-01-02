import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pagePath = url.searchParams.get('page_path')

    if (req.method === 'GET') {
      // Get page view count for a specific path
      if (!pagePath) {
        return new Response(
          JSON.stringify({ error: 'page_path parameter is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Fetching page view count for: ${pagePath}`)

      const { count, error } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .eq('page_path', pagePath)

      if (error) {
        console.error('Error fetching count:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Page view count for ${pagePath}: ${count}`)

      return new Response(
        JSON.stringify({ count: count ?? 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Track a new page view
      const body = await req.json()
      const { page_path, user_agent, referrer } = body

      if (!page_path) {
        return new Response(
          JSON.stringify({ error: 'page_path is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Tracking page view for: ${page_path}`)

      const { error } = await supabase
        .from('page_views')
        .insert({
          page_path,
          user_agent: user_agent || null,
          referrer: referrer || null,
        })

      if (error) {
        console.error('Error inserting page view:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Successfully tracked page view for: ${page_path}`)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
