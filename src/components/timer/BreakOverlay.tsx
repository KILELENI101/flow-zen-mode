import { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import breakHero from "@/assets/break-hero.jpg";

interface BreakOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  duration: number; // in minutes
}

const motivationalMessages = [
  "Time for a break! Look away from the screen.",
  "Rest your eyes and mind. You've earned this break.",
  "Take a deep breath and relax.",
  "Stand up, stretch, and give your body some love.",
  "20/20/20 Rule: Look at something 20 feet away for 20 seconds.",
  "Hydrate! Your brain needs water to function optimally.",
];

const wellnessTips = [
  "Roll your shoulders back and release tension",
  "Take 5 deep breaths in through your nose",
  "Look out a window and focus on distant objects",
  "Do some gentle neck stretches",
  "Close your eyes and listen to your surroundings",
];

export default function BreakOverlay({ isVisible, onClose, duration }: BreakOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [reason, setReason] = useState("");

  const currentMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const currentTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(duration * 60);
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(console.error);
      }
    }
  }, [isVisible, duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVisible && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onClose(); // Break finished
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isVisible, timeLeft, onClose]);

  const handleEmergencyOverride = () => {
    if (!reason.trim()) return;
    
    // Log the override (in a real app, this would go to analytics)
    console.log("Emergency override:", { reason, timeRemaining: timeLeft });
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
    
    onClose();
    setShowEmergencyConfirm(false);
    setReason("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-break flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${breakHero})` }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* Main Break Content */}
      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
        {/* Break Animation Element */}
        <div className="break-animation">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Eye className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Message */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-8 space-y-6">
            <h1 className="text-4xl font-bold text-white">
              {currentMessage}
            </h1>
            
            <div className="text-6xl font-mono font-bold text-white">
              {formatTime(timeLeft)}
            </div>

            <Progress 
              value={progress} 
              className="h-3 bg-white/20 [&>div]:bg-white/80"
            />

            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Wellness Tip</h3>
              <p className="text-white/90">{currentTip}</p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Override */}
        <div className="space-y-4">
          {!showEmergencyConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowEmergencyConfirm(true)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Emergency Override
            </Button>
          ) : (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Emergency Override
                </h3>
                <p className="text-white/90 text-sm">
                  Please provide a reason for ending your break early:
                </p>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., urgent meeting, client call..."
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowEmergencyConfirm(false)}
                    className="bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEmergencyOverride}
                    disabled={!reason.trim()}
                    className="bg-warning text-warning-foreground hover:bg-warning/90"
                  >
                    Confirm Override
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Text */}
        <p className="text-white/70 text-sm">
          Press F11 or click the fullscreen button to stay in focus mode
        </p>
      </div>
    </div>
  );
}