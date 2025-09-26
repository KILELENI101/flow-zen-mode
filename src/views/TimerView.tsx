import TimerCard from "@/components/timer/TimerCard";
import BreakOverlay from "@/components/timer/BreakOverlay";
import { useTimer } from "@/contexts/TimerContext";

export default function TimerView() {
  const { showBreakOverlay, setShowBreakOverlay, breakDuration } = useTimer();

  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-maroon">Focus Timer</h1>
        <p className="text-muted-foreground">
          Choose your productivity method and stay focused
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <TimerCard />
      </div>

      <BreakOverlay
        isVisible={showBreakOverlay}
        onClose={setShowBreakOverlay}
        duration={breakDuration}
      />
    </div>
  );
}