import { useState } from "react";
import { Timer, Shield, BarChart3, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "timer", label: "Timer", icon: Timer },
  { id: "blocker", label: "Blocker", icon: Shield },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children, currentTab, onTabChange }: AppLayoutProps) {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-maroon">FocusFlow</h1>
              <p className="text-xs text-muted-foreground">Web Productivity App</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.email || 'Loading...'}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t border-border bg-card px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-3 transition-smooth",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-maroon hover:bg-muted/50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "focus-indicator"
                )} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}