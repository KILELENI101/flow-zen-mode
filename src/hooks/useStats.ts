import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalSessions: number;
  completedSessions: number;
  focusSessions: number;
  totalFocusMinutes: number;
  todaySessions: number;
  weekSessions: number;
  monthSessions: number;
  sixMonthSessions: number;
  yearSessions: number;
  averageSessionLength: number;
  completionRate: number;
  period: string;
}

export const useStats = (period = 'all') => {
  const { user, session } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && session) {
      fetchStats(period);
    } else {
      setStats(null);
      setLoading(false);
    }
  }, [user, session, period]);

  const fetchStats = async (timePeriod = 'all') => {
    if (!session) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('get-user-stats', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { period: timePeriod }
      });

      if (error) {
        console.error('Error fetching stats:', error);
        setStats(null);
      } else {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (sessionType: 'focus' | 'break', durationMinutes: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('timer_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionType,
          duration_minutes: durationMinutes,
          completed_duration_minutes: durationMinutes,
          status: 'completed',
          completed_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error adding session:', error);
        return { error };
      }

      // Refresh stats after adding session
      await fetchStats();
      return { error: null };
    } catch (error) {
      console.error('Error adding session:', error);
      return { error };
    }
  };

  return {
    stats,
    loading,
    addSession,
    refetch: () => fetchStats(period),
    fetchStats,
  };
};