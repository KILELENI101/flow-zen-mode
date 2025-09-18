import { useState, useEffect } from "react";
import { Volume2, Play, Pause, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSound, SOUND_CATEGORIES, SoundSettings as SoundSettingsType } from "@/hooks/useSound";
import { useToast } from "@/hooks/use-toast";

export default function SoundSettings() {
  const { getSettings, saveSettings, testSound, SOUND_CATEGORIES: categories } = useSound();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SoundSettingsType>(getSettings());
  const [testingSound, setTestingSound] = useState<string | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, [getSettings]);

  const updateSetting = <K extends keyof SoundSettingsType>(
    key: K,
    value: SoundSettingsType[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings({ [key]: value });
  };

  const handleTestSound = (category: keyof typeof categories, soundKey: string) => {
    const testKey = `${category}-${soundKey}`;
    setTestingSound(testKey);
    testSound(category, soundKey);
    
    // Stop testing after 3 seconds
    setTimeout(() => {
      setTestingSound(null);
    }, 3000);
  };

  const handleDownloadSounds = () => {
    toast({
      title: "Sound Pack Installation",
      description: "Download our curated sound pack for the best experience. Follow the setup guide in Settings > Help.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-maroon">
          <Volume2 className="w-5 h-5" />
          Audio & Focus Sounds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Master Volume */}
        <div className="space-y-3">
          <Label>Master Volume</Label>
          <Slider
            value={[settings.masterVolume * 100]}
            onValueChange={([value]) => updateSetting('masterVolume', value / 100)}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-primary"
          />
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(settings.masterVolume * 100)}%
          </div>
        </div>

        <Separator />

        {/* Timer Sounds */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="timer-sounds">Timer Notification Sounds</Label>
              <p className="text-xs text-muted-foreground">Play sounds when sessions start/end</p>
            </div>
            <Switch
              id="timer-sounds"
              checked={settings.timerSoundsEnabled}
              onCheckedChange={(checked) => updateSetting('timerSoundsEnabled', checked)}
            />
          </div>

          {settings.timerSoundsEnabled && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categories.TIMER.sounds).map(([key, sound]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestSound('TIMER', key)}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                  disabled={testingSound === `TIMER-${key}`}
                >
                  {testingSound === `TIMER-${key}` ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="text-xs">{sound.name}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Focus Sounds */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="focus-sounds">Focus Background Sounds</Label>
              <p className="text-xs text-muted-foreground">Play ambient sounds during focus sessions</p>
            </div>
            <Switch
              id="focus-sounds"
              checked={settings.focusSoundEnabled}
              onCheckedChange={(checked) => updateSetting('focusSoundEnabled', checked)}
            />
          </div>

          {settings.focusSoundEnabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categories.FOCUS.sounds).map(([key, sound]) => (
                  <Button
                    key={key}
                    variant={settings.currentFocusSound === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      updateSetting('currentFocusSound', key);
                      handleTestSound('FOCUS', key);
                    }}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                    disabled={testingSound === `FOCUS-${key}`}
                  >
                    {testingSound === `FOCUS-${key}` ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span className="text-xs">{sound.name}</span>
                  </Button>
                ))}
              </div>
              
              {settings.currentFocusSound && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    Selected: {categories.FOCUS.sounds[settings.currentFocusSound as keyof typeof categories.FOCUS.sounds]?.name}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <Separator />

        {/* Break Sounds */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="break-sounds">Break Relaxation Sounds</Label>
              <p className="text-xs text-muted-foreground">Play calming sounds during breaks</p>
            </div>
            <Switch
              id="break-sounds"
              checked={settings.breakSoundEnabled}
              onCheckedChange={(checked) => updateSetting('breakSoundEnabled', checked)}
            />
          </div>

          {settings.breakSoundEnabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categories.BREAK.sounds).map(([key, sound]) => (
                  <Button
                    key={key}
                    variant={settings.currentBreakSound === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      updateSetting('currentBreakSound', key);
                      handleTestSound('BREAK', key);
                    }}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                    disabled={testingSound === `BREAK-${key}`}
                  >
                    {testingSound === `BREAK-${key}` ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span className="text-xs">{sound.name}</span>
                  </Button>
                ))}
              </div>
              
              {settings.currentBreakSound && (
                <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                  <p className="text-sm text-success font-medium">
                    Selected: {categories.BREAK.sounds[settings.currentBreakSound as keyof typeof categories.BREAK.sounds]?.name}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <Separator />

        {/* Sound Pack Download */}
        <div className="p-4 bg-info/5 border border-info/20 rounded-lg">
          <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Premium Sound Pack
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Download high-quality focus and relaxation sounds to enhance your productivity sessions.
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleDownloadSounds} className="bg-gradient-primary">
              Download Sound Pack
            </Button>
            <Badge variant="outline" className="text-xs">Free</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}