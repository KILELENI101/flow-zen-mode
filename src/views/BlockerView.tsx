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
  const [blockedSites, setBlockedSites] = useState<string[]>(["youtube.com", "facebook.com"]);
  const [allowedSites, setAllowedSites] = useState<string[]>(["github.com", "stackoverflow.com"]);
  const [newSite, setNewSite] = useState("");
  const [extensionEnabled, setExtensionEnabled] = useState(false);
  const [allowlistMode, setAllowlistMode] = useState(false);

  const addSite = (site: string, list: "blocked" | "allowed") => {
    if (!site.trim()) return;
    
    const cleanSite = site.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    if (list === "blocked") {
      setBlockedSites(prev => prev.includes(cleanSite) ? prev : [...prev, cleanSite]);
    } else {
      setAllowedSites(prev => prev.includes(cleanSite) ? prev : [...prev, cleanSite]);
    }
    setNewSite("");
  };

  const removeSite = (site: string, list: "blocked" | "allowed") => {
    if (list === "blocked") {
      setBlockedSites(prev => prev.filter(s => s !== site));
    } else {
      setAllowedSites(prev => prev.filter(s => s !== site));
    }
  };

  const addCommonSite = (site: string, list: "blocked" | "allowed") => {
    addSite(site, list);
  };

  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-maroon flex items-center justify-center gap-2">
          <Shield className="w-8 h-8" />
          Website Blocker
        </h1>
        <p className="text-muted-foreground">
          Block distracting websites during focus sessions
        </p>
      </div>

      {/* Extension Status */}
      <Card className="border-info/20 bg-gradient-to-r from-info/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-info" />
                <Label className="text-lg font-semibold">Browser Extension</Label>
                <Badge variant={extensionEnabled ? "default" : "secondary"} className={
                  extensionEnabled ? "bg-success" : "bg-muted"
                }>
                  {extensionEnabled ? "Active" : "Not Installed"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Install the FocusFlow extension for system-wide blocking
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!extensionEnabled && (
                <Button variant="outline" className="bg-info text-info-foreground hover:bg-info/90">
                  Install Extension
                </Button>
              )}
              <Switch 
                checked={extensionEnabled}
                onCheckedChange={setExtensionEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="blocklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blocklist">Block List</TabsTrigger>
          <TabsTrigger value="allowlist">Allow List</TabsTrigger>
        </TabsList>

        <TabsContent value="blocklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-maroon">Blocked Websites</span>
                <Badge variant="secondary">{blockedSites.length} sites</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                These sites will be blocked during focus sessions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Site */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter website (e.g., example.com)"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSite(newSite, "blocked")}
                />
                <Button onClick={() => addSite(newSite, "blocked")}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Common Distracting Sites */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Add - Common Distracting Sites</Label>
                <div className="flex flex-wrap gap-2">
                  {commonDistractingSites.map((site) => (
                    <Button
                      key={site}
                      variant="outline"
                      size="sm"
                      onClick={() => addCommonSite(site, "blocked")}
                      disabled={blockedSites.includes(site)}
                      className="h-8 text-xs"
                    >
                      {blockedSites.includes(site) ? <CheckCircle className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                      {site}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Blocked Sites List */}
              {blockedSites.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Currently Blocked</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {blockedSites.map((site) => (
                      <div key={site} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-mono text-sm">{site}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSite(site, "blocked")}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allowlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-maroon">Allowed Websites</span>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={allowlistMode}
                    onCheckedChange={setAllowlistMode}
                  />
                  <Label className="text-sm">Allowlist Mode</Label>
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {allowlistMode 
                  ? "Only these sites will be accessible during focus sessions"
                  : "These sites will always be accessible, even during focus sessions"
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Site */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter website (e.g., docs.google.com)"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSite(newSite, "allowed")}
                />
                <Button onClick={() => addSite(newSite, "allowed")} className="bg-gradient-success">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Common Productive Sites */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Add - Productive Sites</Label>
                <div className="flex flex-wrap gap-2">
                  {productiveSites.map((site) => (
                    <Button
                      key={site}
                      variant="outline"
                      size="sm"
                      onClick={() => addCommonSite(site, "allowed")}
                      disabled={allowedSites.includes(site)}
                      className="h-8 text-xs border-success/30 text-success hover:bg-success/10"
                    >
                      {allowedSites.includes(site) ? <CheckCircle className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                      {site}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Allowed Sites List */}
              {allowedSites.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Currently Allowed</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allowedSites.map((site) => (
                      <div key={site} className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                        <span className="font-mono text-sm">{site}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSite(site, "allowed")}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Block */}
      <Card className="border-warning/20 bg-gradient-to-r from-warning/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-maroon">Test Your Blocking Rules</h3>
              <p className="text-sm text-muted-foreground">
                Click to test if your current rules are working correctly
              </p>
            </div>
            <Button variant="outline" className="bg-warning text-warning-foreground hover:bg-warning/90">
              Test Block Rules
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}