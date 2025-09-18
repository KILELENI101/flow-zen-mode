import { useState } from "react";
import { Clock, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const quickPresets = [
  { label: "30m", minutes: 30 },
  { label: "45m", minutes: 45 },
  { label: "1h", minutes: 60 },
];

const notificationStyles = [
  { id: 'toast', label: 'Toast', icon: '🔔' },
  { id: 'banner', label: 'Banner', icon: '📢' },
  { id: 'silent', label: 'Silent', icon: '🔕' },
  { id: 'sound', label: 'Sound', icon: '🔊' },
];

export default function BreakReminderSettings() {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customHours, setCustomHours] = useState("01");
  const [customMinutes, setCustomMinutes] = useState("00");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [activeReminders, setActiveReminders] = useState<string[]>([]);
  const [selectedNotificationStyle, setSelectedNotificationStyle] = useState('toast');

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    setIsCustomMode(false);
    const preset = quickPresets[index];
    setActiveReminders(prev => 
      prev.includes(preset.label) 
        ? prev.filter(r => r !== preset.label)
        : [...prev, preset.label]
    );
  };

  const handleCustomReminder = () => {
    const customLabel = `${customHours}:${customMinutes}`;
    setActiveReminders(prev => 
      prev.includes(customLabel) 
        ? prev.filter(r => r !== customLabel)
        : [...prev, customLabel]
    );
    setIsCustomMode(false);
  };

  const removeReminder = (reminder: string) => {
    setActiveReminders(prev => prev.filter(r => r !== reminder));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-maroon">
          <Clock className="w-5 h-5" />
          Break Reminders
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set custom break reminders to maintain healthy work habits
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Reminders</Label>
            <div className="flex flex-wrap gap-2">
              {activeReminders.map((reminder) => (
                <Badge
                  key={reminder}
                  variant="secondary"
                  className="bg-success/10 text-success-foreground border-success/20 cursor-pointer hover:bg-success/20 transition-smooth"
                  onClick={() => removeReminder(reminder)}
                >
                  {reminder} ✕
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="grid grid-cols-3 gap-2">
            {quickPresets.map((preset, index) => (
              <Button
                key={preset.label}
                variant={selectedPreset === index ? "default" : "outline"}
                onClick={() => handlePresetSelect(index)}
                className={cn(
                  "h-12 transition-smooth",
                  activeReminders.includes(preset.label) && "ring-2 ring-success ring-offset-2"
                )}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Time Picker */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Custom Reminder</Label>
          
          {!isCustomMode ? (
            <Button
              variant="outline"
              onClick={() => setIsCustomMode(true)}
              className="w-full h-12 flex items-center gap-2 border-dashed"
            >
              <Plus className="w-4 h-4" />
              Add Custom Time
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="space-y-1">
                  <Label htmlFor="hours" className="text-xs">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value.padStart(2, '0'))}
                    className="w-16 text-center"
                  />
                </div>
                
                <span className="text-2xl font-bold text-muted-foreground pt-6">:</span>
                
                <div className="space-y-1">
                  <Label htmlFor="minutes" className="text-xs">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value.padStart(2, '0'))}
                    className="w-16 text-center"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCustomMode(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCustomReminder}
                  className="flex-1 bg-gradient-primary"
                >
                  Add Reminder
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Notification Style */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notification Style
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {notificationStyles.map((style) => (
              <Button
                key={style.id}
                variant={selectedNotificationStyle === style.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNotificationStyle(style.id)}
                className="h-10 flex items-center gap-2"
              >
                <span>{style.icon}</span>
                <span className="text-xs">{style.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}