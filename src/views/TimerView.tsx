import { useState } from "react";
import TimerCard from "@/components/timer/TimerCard";
import BreakOverlay from "@/components/timer/BreakOverlay";


export default function TimerView() {
  const [showBreakOverlay, setShowBreakOverlay] = useState(false);

  const [breakDuration, setBreakDuration] = useState(5);

  const handleFullscreen = () => {
    setShowBreakOverlay(true);
  };

  const handleBreakStart = (duration: number) => {
    setBreakDuration(duration);
    setShowBreakOverlay(true);
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
        <TimerCard onFullscreen={handleFullscreen} onBreakStart={handleBreakStart} />
      </div>

      <BreakOverlay
        isVisible={showBreakOverlay}
        onClose={handleCloseBreak}
        duration={breakDuration}
      />
    </div>
  );
}