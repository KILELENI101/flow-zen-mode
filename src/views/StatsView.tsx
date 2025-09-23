import { BarChart3, Clock, Target, TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStats } from "@/hooks/useStats";

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export default function StatsView() {
  const { getTodayStats, getWeekStats, getWeeklyData } = useStats();
  
  const todayStats = getTodayStats();
  const weekStats = getWeekStats();
  const weeklyData = getWeeklyData();
  
  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-maroon flex items-center justify-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Productivity Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your focus progress and build better habits
        </p>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Today's Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="productivity-card text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Focus Time</p>
                    <p className="text-2xl font-bold">{formatTime(todayStats.focusTime)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-success text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Sessions</p>
                    <p className="text-2xl font-bold">{todayStats.sessionsCompleted}</p>
                  </div>
                  <Target className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-accent text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Break Time</p>
                    <p className="text-2xl font-bold">{formatTime(todayStats.breakTime)}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-golden bg-golden/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-golden-dark text-sm">Streak</p>
                    <p className="text-2xl font-bold text-golden-dark">{todayStats.streak} days</p>
                  </div>
                  <Award className="w-8 h-8 text-golden" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Focus vs Break Ratio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-maroon">Today's Focus Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Focus Time</span>
                  <span className="text-sm text-muted-foreground">{formatTime(todayStats.focusTime)}</span>
                </div>
                <Progress value={todayStats.focusTime + todayStats.breakTime > 0 ? (todayStats.focusTime / (todayStats.focusTime + todayStats.breakTime)) * 100 : 0} className="[&>div]:bg-primary" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Break Time</span>
                  <span className="text-sm text-muted-foreground">{formatTime(todayStats.breakTime)}</span>
                </div>
                <Progress value={todayStats.focusTime + todayStats.breakTime > 0 ? (todayStats.breakTime / (todayStats.focusTime + todayStats.breakTime)) * 100 : 0} className="[&>div]:bg-success" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          {/* Week Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="productivity-card text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Total Focus</p>
                    <p className="text-2xl font-bold">{formatTime(weekStats.focusTime)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-success text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Avg/Day</p>
                    <p className="text-2xl font-bold">{formatTime(Math.round(weekStats.focusTime / 7))}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-accent text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Sessions</p>
                    <p className="text-2xl font-bold">{weekStats.sessionsCompleted}</p>
                  </div>
                  <Target className="w-8 h-8 text-white/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-warning bg-warning/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-warning-foreground text-sm">Overrides</p>
                    <p className="text-2xl font-bold text-warning-foreground">{weekStats.overrides}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <span className="text-warning-foreground text-sm">!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-maroon">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">
                        {formatTime(day.focus)} focus • {formatTime(day.break)} break
                      </span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
                      <div 
                        className="bg-primary transition-all duration-500"
                        style={{ width: `${Math.max(5, (day.focus / 240) * 100)}%` }}
                      />
                      <div 
                        className="bg-success transition-all duration-500"
                        style={{ width: `${Math.max(5, (day.break / 60) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Blocked Sites */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-maroon">Website Blocking</CardTitle>
            <Badge variant="secondary" className="bg-info/10 text-info">
              Feature Coming Soon
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Install browser extension to track blocked sites and time saved
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Website blocking statistics will appear here once you install the browser extension.
            </p>
            <Button variant="outline" className="bg-info/10 text-info">
              Install Extension
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card className="border-info/20 bg-gradient-to-r from-info/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-maroon">Export Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Download your productivity data as CSV for further analysis
              </p>
            </div>
            <Button variant="outline" className="bg-info text-info-foreground hover:bg-info/90">
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}