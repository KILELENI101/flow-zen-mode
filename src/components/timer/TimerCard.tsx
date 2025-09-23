import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Maximize, Settings } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { usePersistentTimer } from "@/hooks/usePeristentTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: "focus" | "break";
  totalMinutes: number;
  currentCycle: number;
  maxCycles: number;
}

interface CustomSettings {
  focusMinutes: number;
  breakMinutes: number;
  cycles: number;
}

interface TimerCardProps {
  onBreakStart?: (duration: number) => void;
}

const timerPresets = [
  { name: "Pomodoro", focus: 25, break: 5, cycles: 4 },
  { name: "52/17", focus: 52, break: 17, cycles: 1 },
  { name: "90/20", focus: 90, break: 20, cycles: 1 },
  { name: "20/20/20", focus: 20, break: 2, cycles: 3 },
  { name: "Custom", focus: 25, break: 5, cycles: 1 },
];

export default function TimerCard({ onBreakStart }: TimerCardProps) {
  const { playTimerSound, startFocusSound, stopFocusSound, startBreakSound, stopBreakSound } = useSound();
  const { timer, startTimer, pauseTimer, resetTimer, updateTimer } = usePersistentTimer();
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    focusMinutes: 25,
    breakMinutes: 5,
    cycles: 1,
  });
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentPreset = selectedPreset === 4 ? {
    name: "Custom",
    focus: customSettings.focusMinutes,
    break: customSettings.breakMinutes,
    cycles: customSettings.cycles,
  } : timerPresets[selectedPreset];

  // Check for timer completion
  useEffect(() => {
    if (timer.minutes === 0 && timer.seconds === 0 && !timer.isRunning) {
      if (timer.mode === "focus") {
        // Focus session ended, start break
        playTimerSound('END');
        stopFocusSound();
        const breakDuration = currentPreset.break;
        onBreakStart?.(breakDuration);
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
        const nextCycle = timer.currentCycle + 1;
        if (nextCycle <= timer.maxCycles) {
          updateTimer({ 
            mode: "focus",
            minutes: currentPreset.focus,
            seconds: 0,
            totalMinutes: currentPreset.focus,
            currentCycle: nextCycle,
          });
        } else {
          // All cycles completed
          updateTimer({ 
            currentCycle: 1,
          });
        }
      }
    }
  }, [timer.minutes, timer.seconds, timer.isRunning, timer.mode, currentPreset, onBreakStart]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleTimer = () => {
    if (timer.isRunning) {
      pauseTimer();
      stopFocusSound();
      stopBreakSound();
    } else {
      startTimer();
      playTimerSound('START');
      if (timer.mode === "focus") {
        startFocusSound();
      } else {
        startBreakSound();
      }
    }
  };

  const handleReset = () => {
    stopFocusSound();
    stopBreakSound();
    resetTimer({
      minutes: currentPreset.focus,
      seconds: 0,
      mode: "focus",
      totalMinutes: currentPreset.focus,
      currentCycle: 1,
      maxCycles: currentPreset.cycles,
    });
  };

  const selectPreset = (index: number) => {
    setSelectedPreset(index);
    const preset = index === 4 ? {
      focus: customSettings.focusMinutes,
      break: customSettings.breakMinutes,
      cycles: customSettings.cycles,
    } : timerPresets[index];
    
    resetTimer({
      minutes: preset.focus,
      seconds: 0,
      mode: "focus",
      totalMinutes: preset.focus,
      currentCycle: 1,
      maxCycles: preset.cycles,
    });
  };

  const updateCustomSettings = () => {
    if (selectedPreset === 4) {
      resetTimer({
        minutes: customSettings.focusMinutes,
        seconds: 0,
        mode: "focus",
        totalMinutes: customSettings.focusMinutes,
        currentCycle: 1,
        maxCycles: customSettings.cycles,
      });
    }
    setShowCustomDialog(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const progress = ((timer.totalMinutes * 60 - (timer.minutes * 60 + timer.seconds)) / (timer.totalMinutes * 60)) * 100;
  const timeString = `${timer.minutes.toString().padStart(2, '0')}:${timer.seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Preset Selection */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {timerPresets.map((preset, index) => (
          <Button
            key={preset.name}
            variant={selectedPreset === index ? "default" : "outline"}
            onClick={() => selectPreset(index)}
            className={cn(
              "h-auto p-3 flex flex-col items-center gap-1 transition-smooth relative",
              selectedPreset === index && "bg-gradient-primary"
            )}
          >
            <span className="font-semibold text-sm">{preset.name}</span>
            <span className="text-xs opacity-80">
              {index === 4 ? `${customSettings.focusMinutes}m / ${customSettings.breakMinutes}m` : `${preset.focus}m / ${preset.break}m`}
            </span>
            {index === 4 && (
              <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCustomDialog(true);
                    }}
                  >
                    <Settings className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Custom Timer Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="focus-minutes">Focus Time (minutes)</Label>
                      <Input
                        id="focus-minutes"
                        type="number"
                        min="1"
                        max="180"
                        value={customSettings.focusMinutes}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          focusMinutes: parseInt(e.target.value) || 25
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break-minutes">Break Time (minutes)</Label>
                      <Input
                        id="break-minutes"
                        type="number"
                        min="1"
                        max="60"
                        value={customSettings.breakMinutes}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          breakMinutes: parseInt(e.target.value) || 5
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cycles">Number of Cycles</Label>
                      <Input
                        id="cycles"
                        type="number"
                        min="1"
                        max="10"
                        value={customSettings.cycles}
                        onChange={(e) => setCustomSettings(prev => ({
                          ...prev,
                          cycles: parseInt(e.target.value) || 1
                        }))}
                      />
                    </div>
                    <Button onClick={updateCustomSettings} className="w-full">
                      Apply Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
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
          <p className="text-sm text-muted-foreground">
            Session {timer.currentCycle} of {timer.maxCycles}
          </p>
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
              onClick={handleReset}
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
              onClick={toggleFullscreen}
              className="flex items-center gap-2"
            >
              <Maximize className="w-4 h-4" />
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}