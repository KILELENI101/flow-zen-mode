import { useState, useEffect } from "react";
import { Shield, Globe, Plus, X, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTimer } from "@/contexts/TimerContext";

interface BlockedSite {
  id: string;
  url: string;
  category: string;
  addedAt: string;
}

const defaultBlockedSites = [
  { id: '1', url: 'facebook.com', category: 'Social Media', addedAt: new Date().toISOString() },
  { id: '2', url: 'twitter.com', category: 'Social Media', addedAt: new Date().toISOString() },
  { id: '3', url: 'instagram.com', category: 'Social Media', addedAt: new Date().toISOString() },
  { id: '4', url: 'youtube.com', category: 'Entertainment', addedAt: new Date().toISOString() },
  { id: '5', url: 'reddit.com', category: 'Social Media', addedAt: new Date().toISOString() },
];

export default function FocusMode() {
  const { timer, isInBreak } = useTimer();
  const [isEnabled, setIsEnabled] = useLocalStorage('focusMode_enabled', false);
  const [blockedSites, setBlockedSites] = useLocalStorage<BlockedSite[]>('focusMode_blockedSites', defaultBlockedSites);
  const [whitelistMode, setWhitelistMode] = useLocalStorage('focusMode_whitelist', false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSite, setNewSite] = useState('');
  const [newCategory, setNewCategory] = useState('Distracting');

  // Focus mode is active during focus sessions
  const isFocusModeActive = isEnabled && timer.isRunning && timer.mode === 'focus';

  // Monitor current tab for blocking (in a real browser extension, this would work differently)
  useEffect(() => {
    if (isFocusModeActive) {
      // This is for demonstration - in a real app, you'd use browser APIs
      const currentHostname = window.location.hostname;
      const isBlocked = blockedSites.some(site => 
        currentHostname.includes(site.url) || site.url.includes(currentHostname)
      );
      
      if (isBlocked && !whitelistMode) {
        // In a real implementation, this would redirect or block the page
        console.log('Site would be blocked:', currentHostname);
      }
    }
  }, [isFocusModeActive, blockedSites, whitelistMode]);

  const addSite = () => {
    if (!newSite.trim()) return;
    
    const site: BlockedSite = {
      id: Date.now().toString(),
      url: newSite.trim().toLowerCase().replace(/^https?:\/\//, ''),
      category: newCategory,
      addedAt: new Date().toISOString(),
    };
    
    setBlockedSites([...blockedSites, site]);
    setNewSite('');
    setShowAddDialog(false);
  };

  const removeSite = (id: string) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
  };

  const categories = [...new Set(blockedSites.map(site => site.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-maroon">Focus Mode</h2>
            <p className="text-sm text-muted-foreground">
              Block distracting websites during focus sessions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="focus-mode-toggle">Enable Focus Mode</Label>
            <Switch 
              id="focus-mode-toggle"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
          {isFocusModeActive && (
            <Badge variant="default" className="bg-success">
              <Shield className="w-3 h-3 mr-1" />
              Active
            </Badge>
          )}
        </div>
      </div>

      {isFocusModeActive && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Focus Mode is active! Distracting websites are being blocked to help you stay focused.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Blocked Sites List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {whitelistMode ? 'Allowed Sites' : 'Blocked Sites'}
                </CardTitle>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Site
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add {whitelistMode ? 'Allowed' : 'Blocked'} Site</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="site-url">Website URL</Label>
                        <Input
                          id="site-url"
                          value={newSite}
                          onChange={(e) => setNewSite(e.target.value)}
                          placeholder="e.g., facebook.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="site-category">Category</Label>
                        <Input
                          id="site-category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="e.g., Social Media"
                        />
                      </div>
                      <Button onClick={addSite} disabled={!newSite.trim()} className="w-full">
                        Add Site
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {blockedSites.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No sites added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">
                        {category}
                      </h4>
                      <div className="space-y-2 mb-4">
                        {blockedSites
                          .filter(site => site.category === category)
                          .map(site => (
                            <div
                              key={site.id}
                              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <span className="font-mono text-sm">{site.url}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSite(site.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Focus Mode Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whitelist-mode">Whitelist Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Only allow listed sites instead of blocking them
                  </p>
                </div>
                <Switch 
                  id="whitelist-mode"
                  checked={whitelistMode}
                  onCheckedChange={setWhitelistMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const socialMediaSites = [
                    'facebook.com', 'instagram.com', 'twitter.com', 
                    'tiktok.com', 'snapchat.com', 'linkedin.com'
                  ];
                  const newSites = socialMediaSites.map(url => ({
                    id: Date.now() + Math.random().toString(),
                    url,
                    category: 'Social Media',
                    addedAt: new Date().toISOString(),
                  }));
                  setBlockedSites([...blockedSites, ...newSites.filter(
                    newSite => !blockedSites.some(existing => existing.url === newSite.url)
                  )]);
                }}
              >
                Block Social Media
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const entertainmentSites = [
                    'youtube.com', 'netflix.com', 'twitch.tv', 
                    'reddit.com', 'imgur.com', 'pinterest.com'
                  ];
                  const newSites = entertainmentSites.map(url => ({
                    id: Date.now() + Math.random().toString(),
                    url,
                    category: 'Entertainment',
                    addedAt: new Date().toISOString(),
                  }));
                  setBlockedSites([...blockedSites, ...newSites.filter(
                    newSite => !blockedSites.some(existing => existing.url === newSite.url)
                  )]);
                }}
              >
                Block Entertainment
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  if (confirm('Clear all blocked sites?')) {
                    setBlockedSites([]);
                  }
                }}
              >
                Clear All Sites
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Sites:</span>
                <span className="font-medium">{blockedSites.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mode:</span>
                <Badge variant="outline">
                  {whitelistMode ? 'Whitelist' : 'Blacklist'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Focus Active:</span>
                <Badge variant={isFocusModeActive ? 'default' : 'secondary'}>
                  {isFocusModeActive ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}