import { useState } from "react";
import TimerCard from "@/components/timer/TimerCard";
import BreakOverlay from "@/components/timer/BreakOverlay";
import ReminderSettings from "@/components/timer/ReminderSettings";

export default function TimerView() {
  const [showBreakOverlay, setShowBreakOverlay] = useState(false);

  const handleFullscreen = () => {
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TimerCard onFullscreen={handleFullscreen} />
        </div>
        
        <div className="space-y-6">
          <ReminderSettings />
        </div>
      </div>

      <BreakOverlay
        isVisible={showBreakOverlay}
        onClose={handleCloseBreak}
        duration={5} // 5 minute break
      />
    </div>
  );
}