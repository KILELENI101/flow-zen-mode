import { useState, useEffect, useRef } from 'react';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: "focus" | "break";
  totalMinutes: number;
  currentCycle: number;
  maxCycles: number;
  startTime: number | null;
  pausedTime: number;
}

const STORAGE_KEY = 'focusflow_timer_state';

export const usePersistentTimer = () => {
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Calculate actual time remaining based on when timer was started
      if (parsed.isRunning && parsed.startTime) {
        const now = Date.now();
        const elapsed = Math.floor((now - parsed.startTime) / 1000);
        const totalSeconds = parsed.totalMinutes * 60;
        const timePassed = elapsed + parsed.pausedTime;
        const remaining = Math.max(0, totalSeconds - timePassed);
        
        return {
          ...parsed,
          minutes: Math.floor(remaining / 60),
          seconds: remaining % 60,
        };
      }
      return parsed;
    }
    
    return {
      minutes: 25,
      seconds: 0,
      isRunning: false,
      mode: "focus",
      totalMinutes: 25,
      currentCycle: 1,
      maxCycles: 4,
      startTime: null,
      pausedTime: 0,
    };
  });

  // Save to localStorage whenever timer state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  }, [timer]);

  // Handle timer countdown
  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished - will be handled by caller
            return { ...prev, isRunning: false };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning]);

  const startTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: Date.now() - prev.pausedTime * 1000,
    }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      pausedTime: (prev.totalMinutes * 60) - (prev.minutes * 60 + prev.seconds),
    }));
  };

  const resetTimer = (newState: Partial<TimerState>) => {
    setTimer(prev => ({
      ...prev,
      ...newState,
      isRunning: false,
      startTime: null,
      pausedTime: 0,
    }));
  };

  const updateTimer = (updates: Partial<TimerState>) => {
    setTimer(prev => ({ ...prev, ...updates }));
  };

  return {
    timer,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimer,
  };
};