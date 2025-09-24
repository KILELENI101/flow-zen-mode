import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching stats for user:', user.id);

    // Get user's timer sessions
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from('timer_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user statistics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate statistics
    const totalSessions = sessions?.length || 0;
    const completedSessions = sessions?.filter(s => s.status === 'completed').length || 0;
    const focusSessions = sessions?.filter(s => s.session_type === 'focus' && s.status === 'completed').length || 0;
    const totalFocusMinutes = sessions
      ?.filter(s => s.session_type === 'focus' && s.status === 'completed')
      .reduce((sum, s) => sum + (s.completed_duration_minutes || 0), 0) || 0;

    // Calculate today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= today;
    }).length || 0;

    // Calculate this week's sessions
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= weekStart;
    }).length || 0;

    const stats = {
      totalSessions,
      completedSessions,
      focusSessions,
      totalFocusMinutes,
      todaySessions,
      weekSessions,
      averageSessionLength: focusSessions > 0 ? Math.round(totalFocusMinutes / focusSessions) : 0,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
    };

    console.log('Calculated stats:', stats);

    return new Response(
      JSON.stringify({ stats }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-user-stats function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});