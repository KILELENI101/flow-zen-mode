import { BarChart3, Clock, Target, TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - in a real app, this would come from a state management solution
const mockStats = {
  today: {
    focusTime: 180, // minutes
    breakTime: 45,
    sessionsCompleted: 7,
    overrides: 1,
    streak: 5,
  },
  week: {
    focusTime: 1260, // minutes
    breakTime: 315,
    sessionsCompleted: 49,
    overrides: 3,
    streak: 5,
  },
  topBlockedSites: [
    { site: "youtube.com", blocks: 23, timeSaved: 45 },
    { site: "facebook.com", blocks: 18, timeSaved: 32 },
    { site: "reddit.com", blocks: 15, timeSaved: 28 },
    { site: "twitter.com", blocks: 12, timeSaved: 22 },
  ],
  weeklyData: [
    { day: "Mon", focus: 210, break: 52 },
    { day: "Tue", focus: 195, break: 48 },
    { day: "Wed", focus: 180, break: 45 },
    { day: "Thu", focus: 225, break: 56 },
    { day: "Fri", focus: 240, break: 60 },
    { day: "Sat", focus: 90, break: 22 },
    { day: "Sun", focus: 120, break: 30 },
  ],
};

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export default function StatsView() {
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
                    <p className="text-2xl font-bold">{formatTime(mockStats.today.focusTime)}</p>
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
                    <p className="text-2xl font-bold">{mockStats.today.sessionsCompleted}</p>
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
                    <p className="text-2xl font-bold">{formatTime(mockStats.today.breakTime)}</p>
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
                    <p className="text-2xl font-bold text-golden-dark">{mockStats.today.streak} days</p>
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
                  <span className="text-sm text-muted-foreground">{formatTime(mockStats.today.focusTime)}</span>
                </div>
                <Progress value={(mockStats.today.focusTime / (mockStats.today.focusTime + mockStats.today.breakTime)) * 100} className="[&>div]:bg-primary" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Break Time</span>
                  <span className="text-sm text-muted-foreground">{formatTime(mockStats.today.breakTime)}</span>
                </div>
                <Progress value={(mockStats.today.breakTime / (mockStats.today.focusTime + mockStats.today.breakTime)) * 100} className="[&>div]:bg-success" />
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
                    <p className="text-2xl font-bold">{formatTime(mockStats.week.focusTime)}</p>
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
                    <p className="text-2xl font-bold">{formatTime(Math.round(mockStats.week.focusTime / 7))}</p>
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
                    <p className="text-2xl font-bold">{mockStats.week.sessionsCompleted}</p>
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
                    <p className="text-2xl font-bold text-warning-foreground">{mockStats.week.overrides}</p>
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
                {mockStats.weeklyData.map((day) => (
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
                        style={{ width: `${(day.focus / 240) * 100}%` }}
                      />
                      <div 
                        className="bg-success transition-all duration-500"
                        style={{ width: `${(day.break / 60) * 100}%` }}
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
            <CardTitle className="text-maroon">Top Blocked Sites</CardTitle>
            <Badge variant="secondary" className="bg-success/10 text-success">
              {mockStats.topBlockedSites.reduce((acc, site) => acc + site.timeSaved, 0)}min saved
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Sites you've been blocked from and time saved this week
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.topBlockedSites.map((site, index) => (
              <div key={site.site} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{site.site}</p>
                    <p className="text-xs text-muted-foreground">{site.blocks} blocks</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  +{site.timeSaved}min saved
                </Badge>
              </div>
            ))}
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