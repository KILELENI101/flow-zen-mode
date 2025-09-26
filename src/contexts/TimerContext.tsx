import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersistentTimer } from '@/hooks/usePeristentTimer';
import { useSound } from '@/hooks/useSound';
import { useStats } from '@/hooks/useStats';

interface TimerContextType {
  timer: any;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newState: any) => void;
  updateTimer: (updates: any) => void;
  showBreakOverlay: boolean;
  setShowBreakOverlay: () => void;
  breakDuration: number;
  setBreakDuration: (duration: number) => void;
  currentPreset: any;
  setCurrentPreset: (preset: any) => void;
  isInBreak: boolean;
}

const TimerContext = createContext<TimerContextType | null>(null);

const timerPresets = [
  { name: "Pomodoro", focus: 25, break: 5, cycles: 4 },
  { name: "52/17", focus: 52, break: 17, cycles: 4 },
  { name: "90/20", focus: 90, break: 20, cycles: 4 },
  { name: "20/20/20", focus: 20, break: 2, cycles: 4 },
];

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { timer, startTimer, pauseTimer, resetTimer, updateTimer } = usePersistentTimer();
  const { playTimerSound, startFocusSound, stopFocusSound, startBreakSound, stopBreakSound } = useSound();
  const { addSession } = useStats();
  
  const [showBreakOverlay, setShowBreakOverlay] = useState(false);
  const [breakDuration, setBreakDuration] = useState(5);
  const [currentPreset, setCurrentPreset] = useState(timerPresets[0]);
  const [isInBreak, setIsInBreak] = useState(false);

  // Handle timer completion and break management
  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0 && !timer.isRunning) {
      if (timer.mode === "focus") {
        // Focus session ended, start break
        playTimerSound('END');
        stopFocusSound();
        
        // Add session stats
        addSession('focus', timer.totalMinutes);
        
        const breakDuration = currentPreset.break;
        setBreakDuration(breakDuration);
        setShowBreakOverlay(true);
        setIsInBreak(true);
        startBreakSound();
        
        updateTimer({ 
          mode: "break",
          minutes: breakDuration,
          seconds: 0,
          totalMinutes: breakDuration,
        });
      } else {
        // Break ended, check if we should start another cycle
        playTimerSound('BREAK_END');
        stopBreakSound();
        setShowBreakOverlay(false);
        setIsInBreak(false);
        
        // Add break stats
        addSession('break', timer.totalMinutes);
        
        const nextCycle = timer.currentCycle + 1;
        if (nextCycle <= timer.maxCycles) {
          // Next cycle in current loop
          updateTimer({ 
            mode: "focus",
            minutes: currentPreset.focus,
            seconds: 0,
            totalMinutes: currentPreset.focus,
            currentCycle: nextCycle,
          });
        } else {
          // All cycles completed - start new loop
          updateTimer({ 
            mode: "focus",
            minutes: currentPreset.focus,
            seconds: 0,
            totalMinutes: currentPreset.focus,
            currentCycle: 1,
          });
        }
      }
    }
  }, [timer.minutes, timer.seconds, timer.isRunning, timer.mode, currentPreset]);

  // Auto-show break overlay when in break mode
  useEffect(() => {
    if (timer.mode === "break" && timer.isRunning && !showBreakOverlay) {
      setShowBreakOverlay(true);
      setIsInBreak(true);
      startBreakSound();
    }
  }, [timer.mode, timer.isRunning, showBreakOverlay]);

  const handleCloseBreak = () => {
    setShowBreakOverlay(false);
    setIsInBreak(false);
    stopBreakSound();
    // Exit fullscreen when break ends
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  };

  const value = {
    timer,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimer,
    showBreakOverlay,
    setShowBreakOverlay: handleCloseBreak,
    breakDuration,
    setBreakDuration,
    currentPreset,
    setCurrentPreset,
    isInBreak,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}