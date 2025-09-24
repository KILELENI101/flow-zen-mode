import { useState, useEffect } from 'react';

export interface SessionStats {
  date: string;
  focusTime: number; // minutes
  breakTime: number;
  sessionsCompleted: number;
  overrides: number;
  mode: 'focus' | 'break';
}

export interface DailyStats {
  date: string;
  focusTime: number;
  breakTime: number;
  sessionsCompleted: number;
  overrides: number;
  streak: number;
}

const STATS_STORAGE_KEY = 'focusflow_stats';

export function useStats() {
  const [stats, setStats] = useState<SessionStats[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch {
        setStats([]);
      }
    }
  }, []);

  const saveStats = (newStats: SessionStats[]) => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  const addSession = (sessionData: Omit<SessionStats, 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newSession: SessionStats = {
      ...sessionData,
      date: today,
    };

    const updatedStats = [...stats, newSession];
    saveStats(updatedStats);
  };

  const getTodayStats = (): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = stats.filter(s => s.date === today);
    
    return {
      date: today,
      focusTime: todaySessions.reduce((acc, s) => acc + (s.mode === 'focus' ? s.focusTime : 0), 0),
      breakTime: todaySessions.reduce((acc, s) => acc + (s.mode === 'break' ? s.breakTime : 0), 0),
      sessionsCompleted: todaySessions.filter(s => s.mode === 'focus').length,
      overrides: todaySessions.reduce((acc, s) => acc + s.overrides, 0),
      streak: calculateStreak(),
    };
  };

  const getWeekStats = (): DailyStats => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const weekSessions = stats.filter(s => s.date >= weekAgoStr);
    
    return {
      date: 'week',
      focusTime: weekSessions.reduce((acc, s) => acc + (s.mode === 'focus' ? s.focusTime : 0), 0),
      breakTime: weekSessions.reduce((acc, s) => acc + (s.mode === 'break' ? s.breakTime : 0), 0),
      sessionsCompleted: weekSessions.filter(s => s.mode === 'focus').length,
      overrides: weekSessions.reduce((acc, s) => acc + s.overrides, 0),
      streak: calculateStreak(),
    };
  };

  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const daySessions = stats.filter(s => s.date === dateStr);
      
      weekData.push({
        day: days[date.getDay()],
        focus: daySessions.reduce((acc, s) => acc + (s.mode === 'focus' ? s.focusTime : 0), 0),
        break: daySessions.reduce((acc, s) => acc + (s.mode === 'break' ? s.breakTime : 0), 0),
      });
    }
    
    return weekData;
  };

  const calculateStreak = (): number => {
    const uniqueDates = [...new Set(stats.map(s => s.date))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (date === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    addSession,
    getTodayStats,
    getWeekStats,
    getWeeklyData,
    stats,
  };
}