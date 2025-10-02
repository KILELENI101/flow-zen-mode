import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Maximize } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useTimer } from "@/contexts/TimerContext";
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

interface TimerCardProps {}

const timerPresets = [
  { name: "Pomodoro", focus: 25, break: 5, cycles: 4 },
  { name: "52/17", focus: 52, break: 17, cycles: 4 },
  { name: "90/20", focus: 90, break: 20, cycles: 4 },
  { name: "20/20/20", focus: 20, break: 2, cycles: 4 },
  { name: "Custom", focus: 25, break: 5, cycles: 4 },
];

export default function TimerCard({}: TimerCardProps) {
  const { playTimerSound, startFocusSound, stopFocusSound, startBreakSound, stopBreakSound } = useSound();
  const { timer, startTimer, pauseTimer, resetTimer, updateTimer, currentPreset, setCurrentPreset } = useTimer();
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    focusMinutes: 25,
    breakMinutes: 5,
    cycles: 4,
  });
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const displayPreset = selectedPreset === 4 ? {
    name: "Custom",
    focus: customSettings.focusMinutes,
    break: customSettings.breakMinutes,
    cycles: customSettings.cycles,
  } : timerPresets[selectedPreset];

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
      minutes: displayPreset.focus,
      seconds: 0,
      mode: "focus",
      totalMinutes: displayPreset.focus,
      currentCycle: 1,
      maxCycles: displayPreset.cycles,
    });
  };

  const selectPreset = (index: number) => {
    setSelectedPreset(index);
    const preset = index === 4 ? {
      name: "Custom",
      focus: customSettings.focusMinutes,
      break: customSettings.breakMinutes,
      cycles: customSettings.cycles,
    } : timerPresets[index];
    
    setCurrentPreset(preset);
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
      const customPreset = {
        name: "Custom",
        focus: customSettings.focusMinutes,
        break: customSettings.breakMinutes,
        cycles: customSettings.cycles,
      };
      setCurrentPreset(customPreset);
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
            onClick={() => index === 4 ? setShowCustomDialog(true) : selectPreset(index)}
            className={cn(
              "h-auto p-3 flex flex-col items-center gap-1 transition-smooth relative",
              selectedPreset === index && index !== 4 && "bg-gradient-primary",
              index === 4 && "bg-gradient-primary text-primary-foreground"
            )}
          >
            <span className="font-semibold text-sm">{preset.name}</span>
            <span className="text-xs opacity-80">
              {index === 4 ? "Your Time" : `${preset.focus}m / ${preset.break}m`}
            </span>
          </Button>
        ))}
      </div>

      {/* Custom Timer Dialog */}
      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
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
                  focusMinutes: parseInt(e.target.value) || 1
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
                  breakMinutes: parseInt(e.target.value) || 1
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

      {/* Main Timer Card - Circular Display */}
      <Card className={cn(
        "relative overflow-hidden transition-smooth border-0 shadow-lg",
        timer.mode === "focus" 
          ? "bg-gradient-to-br from-background to-primary/5" 
          : "bg-gradient-to-br from-background to-success/5"
      )}>
        <CardContent className="py-12">
          {/* Circular Timer Display */}
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Circle Timer */}
            <div className="relative">
              {/* Background Circle */}
              <svg className="transform -rotate-90" width="280" height="280">
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted/20"
                />
                {/* Progress Circle */}
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className={cn(
                    "transition-all duration-1000 ease-linear",
                    timer.mode === "focus" ? "text-maroon" : "text-success"
                  )}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Timer Text in Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={cn(
                  "text-6xl font-mono font-bold transition-smooth",
                  timer.mode === "focus" ? "text-maroon" : "text-success"
                )}>
                  {timeString}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {timer.mode === "focus" ? "Focus Time" : "Break Time"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Session {timer.currentCycle} of {timer.maxCycles}
                </p>
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
                    ? "bg-success hover:bg-success/90 text-success-foreground" 
                    : "bg-success hover:bg-success/90 text-success-foreground"
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
                    {timer.mode === "focus" ? "Start Focus" : "Start Break"}
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
                Fullscreen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}