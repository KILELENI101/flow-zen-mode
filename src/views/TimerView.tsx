import { useState, useEffect } from "react";
import TimerCard from "@/components/timer/TimerCard";
import BreakOverlay from "@/components/timer/BreakOverlay";
import { useStats } from "@/hooks/useStats";

export default function TimerView() {
  const [showBreakOverlay, setShowBreakOverlay] = useState(false);
  const [breakDuration, setBreakDuration] = useState(5);
  const { addSession } = useStats();

  const handleBreakStart = (duration: number) => {
    setBreakDuration(duration);
    setShowBreakOverlay(true);
  };

  const handleTimerComplete = async (sessionType: 'focus' | 'break', duration: number) => {
    await addSession(sessionType, duration);
  };

  const handleCloseBreak = () => {
    setShowBreakOverlay(false);
    // Exit fullscreen when break ends
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-maroon">Focus Timer</h1>
        <p className="text-muted-foreground">
          Choose your productivity method and stay focused
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <TimerCard 
          onBreakStart={handleBreakStart} 
          onTimerComplete={handleTimerComplete}
        />
      </div>

      <BreakOverlay
        isVisible={showBreakOverlay}
        onClose={handleCloseBreak}
        duration={breakDuration}
      />
    </div>
  );
}