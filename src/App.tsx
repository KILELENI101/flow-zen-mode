import { useState } from "react";
import AuthGuard from "@/components/layout/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import TimerView from "@/views/TimerView";
import BlockerView from "@/views/BlockerView";
import StatsView from "@/views/StatsView";
import SettingsView from "@/views/SettingsView";

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
    <AuthGuard>
      <AppLayout currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderCurrentView()}
      </AppLayout>
    </AuthGuard>
  );
};

export default App;
