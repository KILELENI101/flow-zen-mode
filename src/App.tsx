import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import TimerView from "@/views/TimerView";
import BlockerView from "@/views/BlockerView";
import StatsView from "@/views/StatsView";
import SettingsView from "@/views/SettingsView";

const queryClient = new QueryClient();

const App = () => {
  const [currentTab, setCurrentTab] = useState("timer");

  const renderCurrentView = () => {
    switch (currentTab) {
      case "timer":
        return <TimerView />;
      case "blocker":
        return <BlockerView />;
      case "stats":
        return <StatsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <TimerView />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppLayout currentTab={currentTab} onTabChange={setCurrentTab}>
          {renderCurrentView()}
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
