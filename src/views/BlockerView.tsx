import { useState } from "react";
import { Shield, Plus, Trash2, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const commonDistractingSites = [
  "youtube.com", "facebook.com", "instagram.com", "twitter.com", "reddit.com",
  "tiktok.com", "netflix.com", "twitch.tv", "linkedin.com", "pinterest.com"
];

const productiveSites = [
  "github.com", "stackoverflow.com", "docs.google.com", "notion.so",
  "trello.com", "slack.com", "zoom.us", "calendar.google.com"
];

export default function BlockerView() {
  const [extensionEnabled, setExtensionEnabled] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-maroon flex items-center justify-center gap-2">
          <Shield className="w-8 h-8" />
          Website Blocker
        </h1>
        <p className="text-muted-foreground">
          Install the browser extension to block distracting websites
        </p>
      </div>

      {/* Extension Status */}
      <Card className="border-info/20 bg-gradient-to-r from-info/5 to-transparent">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-info/20 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-info" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">FocusFlow Browser Extension</h2>
              <Badge variant={extensionEnabled ? "default" : "secondary"} className={
                extensionEnabled ? "bg-success" : "bg-muted"
              }>
                {extensionEnabled ? "Extension Active" : "Extension Not Installed"}
              </Badge>
            </div>
            
            <p className="text-muted-foreground max-w-md mx-auto">
              The FocusFlow browser extension blocks distracting websites during your focus sessions. 
              Install it to get the full productivity experience.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-primary text-white"
                onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
              >
                Install Chrome Extension
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://addons.mozilla.org', '_blank')}
              >
                Install Firefox Add-on
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Label className="text-sm">Extension Status:</Label>
              <Switch 
                checked={extensionEnabled}
                onCheckedChange={setExtensionEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}