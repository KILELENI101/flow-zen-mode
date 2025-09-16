import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: "focus" | "break";
  totalMinutes: number;
}

interface TimerCardProps {
  onFullscreen?: () => void;
}

const timerPresets = [
  { name: "Pomodoro", focus: 25, break: 5, cycles: 4 },
  { name: "52/17", focus: 52, break: 17, cycles: 1 },
  { name: "90/20", focus: 90, break: 20, cycles: 1 },
  { name: "20/20/20", focus: 20, break: 20, cycles: 3 },
];

export default function TimerCard({ onFullscreen }: TimerCardProps) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: "focus",
    totalMinutes: 25,
  });

  const currentPreset = timerPresets[selectedPreset];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            return { 
              ...prev, 
              isRunning: false,
              mode: prev.mode === "focus" ? "break" : "focus"
            };
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    const newDuration = timer.mode === "focus" ? currentPreset.focus : currentPreset.break;
    setTimer({
      minutes: newDuration,
      seconds: 0,
      isRunning: false,
      mode: "focus",
      totalMinutes: newDuration,
    });
  };

  const selectPreset = (index: number) => {
    setSelectedPreset(index);
    const preset = timerPresets[index];
    setTimer({
      minutes: preset.focus,
      seconds: 0,
      isRunning: false,
      mode: "focus",
      totalMinutes: preset.focus,
    });
  };

  const progress = ((timer.totalMinutes * 60 - (timer.minutes * 60 + timer.seconds)) / (timer.totalMinutes * 60)) * 100;
  const timeString = `${timer.minutes.toString().padStart(2, '0')}:${timer.seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Preset Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {timerPresets.map((preset, index) => (
          <Button
            key={preset.name}
            variant={selectedPreset === index ? "default" : "outline"}
            onClick={() => selectPreset(index)}
            className={cn(
              "h-auto p-3 flex flex-col items-center gap-1 transition-smooth",
              selectedPreset === index && "bg-gradient-primary"
            )}
          >
            <span className="font-semibold text-sm">{preset.name}</span>
            <span className="text-xs opacity-80">
              {preset.focus}m / {preset.break}m
            </span>
          </Button>
        ))}
      </div>

      {/* Main Timer Card */}
      <Card className={cn(
        "relative overflow-hidden transition-smooth",
        timer.mode === "focus" 
          ? "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" 
          : "border-success/20 bg-gradient-to-br from-success/5 to-transparent"
      )}>
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant={timer.mode === "focus" ? "default" : "secondary"} className={cn(
              timer.mode === "focus" ? "bg-primary" : "bg-success"
            )}>
              {timer.mode === "focus" ? "Focus Session" : "Break Time"}
            </Badge>
          </div>
          <CardTitle className="text-lg text-muted-foreground">
            {currentPreset.name} - {timer.mode === "focus" ? "Stay Focused" : "Take a Break"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={cn(
              "text-6xl md:text-7xl font-mono font-bold transition-smooth timer-ring",
              timer.mode === "focus" ? "text-primary" : "text-success"
            )}>
              {timeString}
            </div>
            <div className="mt-2">
              <Progress 
                value={progress} 
                className={cn(
                  "h-2 transition-smooth",
                  timer.mode === "focus" ? "[&>div]:bg-primary" : "[&>div]:bg-success"
                )}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={resetTimer}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            <Button
              size="lg"
              onClick={toggleTimer}
              className={cn(
                "flex items-center gap-2 px-8 text-lg transition-smooth",
                timer.mode === "focus" 
                  ? "bg-gradient-primary hover:opacity-90" 
                  : "bg-gradient-success hover:opacity-90"
              )}
            >
              {timer.isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onFullscreen}
              className="flex items-center gap-2"
            >
              <Maximize className="w-4 h-4" />
              Fullscreen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}