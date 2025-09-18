import { Settings, Palette, Calendar, User, Shield, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SoundSettings from "@/components/settings/SoundSettings";
import BreakReminderSettings from "@/components/settings/BreakReminderSettings";

export default function SettingsView() {
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
              <Select defaultValue="light">
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

            <div className="space-y-3">
              <Label>Break Screen Background</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-20 bg-gradient-break">
                  <span className="text-xs">Nature</span>
                </Button>
                <Button variant="outline" className="h-20 bg-gradient-primary">
                  <span className="text-xs">Ocean</span>
                </Button>
                <Button variant="outline" className="h-20 bg-gradient-accent">
                  <span className="text-xs">Space</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Enable Animations</Label>
              <Switch id="animations" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Audio & Focus Sounds */}
        <SoundSettings />

        {/* Break Reminders */}
        <BreakReminderSettings />

        {/* Timer Defaults */}
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
              <Select defaultValue="pomodoro">
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

            <div className="space-y-3">
              <Label>Auto-start Breaks</Label>
              <Switch defaultChecked />
            </div>

            <div className="space-y-3">
              <Label>Auto-start Next Session</Label>
              <Switch />
            </div>

            <div className="space-y-3">
              <Label>Long Break After (cycles)</Label>
              <Input type="number" defaultValue="4" min="1" max="10" />
            </div>
          </CardContent>
        </Card>

        {/* Account & Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-maroon">
              <User className="w-5 h-5" />
              Account & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Cloud Sync</Label>
                  <p className="text-xs text-muted-foreground">Sync settings across devices</p>
                </div>
                <Badge variant="outline" className="text-xs">Pro Feature</Badge>
              </div>
              <Switch disabled />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Data Management</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Clear All Data
                </Button>
              </div>
            </div>

            <div className="p-4 bg-info/5 border border-info/20 rounded-lg">
              <h4 className="font-semibold text-info mb-2">Upgrade to Pro</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get cloud sync, advanced analytics, and premium features
              </p>
              <Button size="sm" className="bg-gradient-primary">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-maroon">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Anonymous Usage Analytics</Label>
                  <Switch id="analytics" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="crash-reports">Crash Reports</Label>
                  <Switch id="crash-reports" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing Communications</Label>
                  <Switch id="marketing" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    We only collect anonymous usage data to improve the app. 
                    Your focus sessions and blocked sites are stored locally on your device.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>App Version</Label>
                <p className="text-sm text-muted-foreground">FocusFlow Web v1.0.0</p>
              </div>
              <Button variant="outline" size="sm">
                Check for Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}