import { Settings, Palette, Calendar, User, Target, Download, Shield, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import SoundSettings from "@/components/settings/SoundSettings";
import BreakReminderSettings from "@/components/settings/BreakReminderSettings";
import GoalSetting from "@/components/features/GoalSetting";
import FocusMode from "@/components/features/FocusMode";
import NotificationSystem from "@/components/features/NotificationSystem";

export default function SettingsView() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [animations, setAnimations] = useLocalStorage('animations', true);
  const [defaultTimer, setDefaultTimer] = useLocalStorage('defaultTimer', 'pomodoro');
  const [autoStartBreaks, setAutoStartBreaks] = useLocalStorage('autoStartBreaks', true);
  const [autoStartNext, setAutoStartNext] = useLocalStorage('autoStartNext', false);
  const [longBreakAfter, setLongBreakAfter] = useLocalStorage('longBreakAfter', 4);
  const [analytics, setAnalytics] = useLocalStorage('analytics', true);
  const [crashReports, setCrashReports] = useLocalStorage('crashReports', true);
  const [marketing, setMarketing] = useLocalStorage('marketing', false);
  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-maroon flex items-center justify-center gap-2">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your FocusFlow experience
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Goals & Targets */}
        <div className="lg:col-span-2">
          <GoalSetting />
        </div>

        {/* Focus Mode */}
        <div className="lg:col-span-2">
          <FocusMode />
        </div>

        {/* Notifications */}
        <div className="lg:col-span-2">
          <NotificationSystem />
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-maroon">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Enable Animations</Label>
              <Switch 
                id="animations" 
                checked={animations} 
                onCheckedChange={setAnimations}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio & Focus Sounds */}
        <SoundSettings />

        {/* Break Reminders */}
        <BreakReminderSettings />

        {/* Timer Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-maroon">
              <Calendar className="w-5 h-5" />
              Timer Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Default Timer Mode</Label>
              <Select value={defaultTimer} onValueChange={setDefaultTimer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pomodoro">Pomodoro (25/5)</SelectItem>
                  <SelectItem value="52-17">52/17 Method</SelectItem>
                  <SelectItem value="90-20">90/20 Method</SelectItem>
                  <SelectItem value="20-20-20">20/20/20 Rule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-breaks">Auto-start Breaks</Label>
              <Switch 
                id="auto-start-breaks"
                checked={autoStartBreaks} 
                onCheckedChange={setAutoStartBreaks}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-next">Auto-start Next Session</Label>
              <Switch 
                id="auto-start-next"
                checked={autoStartNext} 
                onCheckedChange={setAutoStartNext}
              />
            </div>

            <div className="space-y-3">
              <Label>Long Break After (cycles)</Label>
              <Input 
                type="number" 
                value={longBreakAfter} 
                onChange={(e) => setLongBreakAfter(parseInt(e.target.value) || 4)}
                min="1" 
                max="10" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-maroon">
              <User className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Export & Backup</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    // Export all localStorage data
                    const data = {
                      timer: localStorage.getItem('focusflow_timer_state'),
                      goals: localStorage.getItem('focusflow_goals'),
                      stats: localStorage.getItem('focusflow_stats'),
                      settings: {
                        theme,
                        animations,
                        defaultTimer,
                        autoStartBreaks,
                        autoStartNext,
                        longBreakAfter
                      }
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `focusflow-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all your data permanently.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & App Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-maroon">
              <Settings className="w-5 h-5" />
              Privacy & App Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Anonymous Usage Analytics</Label>
                  <Switch 
                    id="analytics" 
                    checked={analytics} 
                    onCheckedChange={setAnalytics}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="crash-reports">Crash Reports</Label>
                  <Switch 
                    id="crash-reports" 
                    checked={crashReports} 
                    onCheckedChange={setCrashReports}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">App Updates Notifications</Label>
                  <Switch 
                    id="marketing" 
                    checked={marketing} 
                    onCheckedChange={setMarketing}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Privacy First</h4>
                  <p className="text-sm text-muted-foreground">
                    All your data is stored locally on your device. No personal information is shared with third parties. Analytics are anonymous and help improve the app.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>App Version</Label>
                <p className="text-sm text-muted-foreground">FocusFlow Web v1.2.0</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://github.com/focusflow/web-app/releases', '_blank')}
              >
                View Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}