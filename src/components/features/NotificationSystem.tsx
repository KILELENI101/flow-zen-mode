import { useState, useEffect } from "react";
import { Bell, Volume2, VolumeX, Smartphone, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/contexts/TimerContext";
import { toast } from "sonner";

interface NotificationSettings {
  enabled: boolean;
  browserNotifications: boolean;
  soundNotifications: boolean;
  sessionStart: boolean;
  sessionEnd: boolean;
  breakStart: boolean;
  breakEnd: boolean;
  cycleComplete: boolean;
  reminderInterval: number; // minutes
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  browserNotifications: true,
  soundNotifications: true,
  sessionStart: true,
  sessionEnd: true,
  breakStart: true,
  breakEnd: true,
  cycleComplete: true,
  reminderInterval: 5,
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00"
  }
};

export default function NotificationSystem() {
  const { timer } = useTimer();
  const [settings, setSettings] = useLocalStorage<NotificationSettings>('notification_settings', defaultSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        toast.success('Browser notifications enabled!');
      }
    }
  };

  const isInQuietHours = () => {
    if (!settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours cross midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  const sendNotification = (title: string, body: string, icon?: string) => {
    if (!settings.enabled || isInQuietHours()) return;

    // Browser notification
    if (settings.browserNotifications && permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'focusflow-timer'
      });
    }

    // Toast notification (always show as fallback)
    toast(title, {
      description: body,
      duration: 5000,
    });
  };

  // Monitor timer state for notifications
  useEffect(() => {
    const now = Date.now();
    
    // Prevent duplicate notifications within 1 second
    if (now - lastNotificationTime < 1000) return;

    if (timer.minutes === 0 && timer.seconds === 0 && !timer.isRunning) {
      if (timer.mode === "focus" && settings.sessionEnd) {
        sendNotification(
          "Focus Session Complete! 🎉",
          "Great job! Time for a well-deserved break."
        );
        setLastNotificationTime(now);
      } else if (timer.mode === "break" && settings.breakEnd) {
        sendNotification(
          "Break Time Over! ⚡",
          "Ready to get back to focused work?"
        );
        setLastNotificationTime(now);
      }
    }
  }, [timer.minutes, timer.seconds, timer.isRunning, timer.mode, settings, lastNotificationTime]);

  // Cycle completion notifications
  useEffect(() => {
    if (settings.cycleComplete && timer.currentCycle === timer.maxCycles && timer.mode === "break") {
      sendNotification(
        "Cycle Complete! 🔄",
        `You've completed ${timer.maxCycles} focus sessions. Great work!`
      );
    }
  }, [timer.currentCycle, timer.maxCycles, timer.mode, settings.cycleComplete]);

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateQuietHours = <K extends keyof NotificationSettings['quietHours']>(
    key: K,
    value: NotificationSettings['quietHours'][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [key]: value }
    }));
  };

  const testNotification = () => {
    sendNotification(
      "Test Notification",
      "This is how your notifications will look!"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-maroon">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Stay informed about your focus sessions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={settings.enabled ? "default" : "secondary"}>
            {settings.enabled ? "Enabled" : "Disabled"}
          </Badge>
          {isInQuietHours() && (
            <Badge variant="outline">Quiet Hours</Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <Switch 
                id="notifications-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Notification Types</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="session-start">Session Start</Label>
                  <Switch 
                    id="session-start"
                    checked={settings.sessionStart}
                    onCheckedChange={(checked) => updateSetting('sessionStart', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="session-end">Session End</Label>
                  <Switch 
                    id="session-end"
                    checked={settings.sessionEnd}
                    onCheckedChange={(checked) => updateSetting('sessionEnd', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="break-start">Break Start</Label>
                  <Switch 
                    id="break-start"
                    checked={settings.breakStart}
                    onCheckedChange={(checked) => updateSetting('breakStart', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="break-end">Break End</Label>
                  <Switch 
                    id="break-end"
                    checked={settings.breakEnd}
                    onCheckedChange={(checked) => updateSetting('breakEnd', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="cycle-complete">Cycle Complete</Label>
                  <Switch 
                    id="cycle-complete"
                    checked={settings.cycleComplete}
                    onCheckedChange={(checked) => updateSetting('cycleComplete', checked)}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Methods & Advanced */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Delivery Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <Label htmlFor="browser-notifications">Browser Notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  {permission !== 'granted' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={requestPermission}
                    >
                      Enable
                    </Button>
                  )}
                  <Switch 
                    id="browser-notifications"
                    checked={settings.browserNotifications && permission === 'granted'}
                    onCheckedChange={(checked) => updateSetting('browserNotifications', checked)}
                    disabled={!settings.enabled || permission !== 'granted'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <Label htmlFor="sound-notifications">Sound Notifications</Label>
                </div>
                <Switch 
                  id="sound-notifications"
                  checked={settings.soundNotifications}
                  onCheckedChange={(checked) => updateSetting('soundNotifications', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              <Button 
                variant="outline" 
                onClick={testNotification}
                disabled={!settings.enabled}
                className="w-full"
              >
                Test Notification
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                <Switch 
                  id="quiet-hours"
                  checked={settings.quietHours.enabled}
                  onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
                  disabled={!settings.enabled}
                />
              </div>

              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Select 
                      value={settings.quietHours.start}
                      onValueChange={(value) => updateQuietHours('start', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Select 
                      value={settings.quietHours.end}
                      onValueChange={(value) => updateQuietHours('end', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {isInQuietHours() && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  🔕 Quiet hours are currently active. Notifications are muted.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}