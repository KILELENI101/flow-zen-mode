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

    // Parse query parameters for time period
    const url = new URL(req.url);
    const period = url.searchParams.get('period') || 'all';
    
    console.log(`Fetching stats for user ${user.id} with period: ${period}`);

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

    // Calculate date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Filter sessions based on period
    let filteredSessions = sessions || [];
    
    switch (period) {
      case 'today':
        filteredSessions = sessions?.filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate >= today;
        }) || [];
        break;
      case 'week':
        filteredSessions = sessions?.filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate >= weekStart;
        }) || [];
        break;
      case 'month':
        filteredSessions = sessions?.filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate >= monthStart;
        }) || [];
        break;
      case '6months':
        filteredSessions = sessions?.filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate >= sixMonthsAgo;
        }) || [];
        break;
      case 'year':
        filteredSessions = sessions?.filter(s => {
          const sessionDate = new Date(s.created_at);
          return sessionDate >= yearStart;
        }) || [];
        break;
      default:
        // 'all' - use all sessions
        break;
    }

    const focusSessions = filteredSessions.filter(s => s.session_type === 'focus');
    const completedSessions = filteredSessions.filter(s => s.status === 'completed');
    
    // Always calculate these for comparison
    const todaySessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= today;
    }) || [];

    const weekSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= weekStart;
    }) || [];

    const monthSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= monthStart;
    }) || [];

    const sixMonthSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= sixMonthsAgo;
    }) || [];

    const yearSessions = sessions?.filter(s => {
      const sessionDate = new Date(s.created_at);
      return sessionDate >= yearStart;
    }) || [];

    const totalFocusMinutes = focusSessions.reduce((sum, session) => {
      return sum + (session.completed_duration_minutes || 0);
    }, 0);

    const averageSessionLength = focusSessions.length > 0 
      ? Math.round(totalFocusMinutes / focusSessions.length) 
      : 0;

    const completionRate = filteredSessions.length > 0
      ? Math.round((completedSessions.length / filteredSessions.length) * 100)
      : 0;

    const stats = {
      totalSessions: filteredSessions.length,
      completedSessions: completedSessions.length,
      focusSessions: focusSessions.length,
      totalFocusMinutes,
      todaySessions: todaySessions.length,
      weekSessions: weekSessions.length,
      monthSessions: monthSessions.length,
      sixMonthSessions: sixMonthSessions.length,
      yearSessions: yearSessions.length,
      averageSessionLength,
      completionRate,
      period
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