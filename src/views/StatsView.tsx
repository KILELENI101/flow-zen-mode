import { BarChart3, Clock, Target, TrendingUp, Calendar, Award, Loader2 } from "lucide-react";
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
  const { stats, loading, refetch } = useStats();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center space-y-4">
        <div className="text-6xl">📊</div>
        <h2 className="text-2xl font-bold text-foreground">No Stats Yet</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Start using the timer to track your productivity and see your progress here.
        </p>
        <Button onClick={() => refetch()} variant="outline">
          Refresh Stats
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in-scale">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <BarChart3 className="w-8 h-8" />
          Productivity Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your focus progress and build better habits
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="productivity-card">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  {formatTime(stats.totalFocusMinutes)}
                </div>
                <p className="text-sm text-muted-foreground">Total Focus Time</p>
              </CardContent>
            </Card>
            
            <Card className="productivity-card">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.focusSessions}
                </div>
                <p className="text-sm text-muted-foreground">Focus Sessions</p>
              </CardContent>
            </Card>
            
            <Card className="productivity-card">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.todaySessions}
                </div>
                <p className="text-sm text-muted-foreground">Today</p>
              </CardContent>
            </Card>
            
            <Card className="productivity-card">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-warning" />
                <div className="text-2xl font-bold text-foreground">
                  {stats.weekSessions}
                </div>
                <p className="text-sm text-muted-foreground">This Week</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">{stats.completionRate}%</span>
                  </div>
                  <Progress value={stats.completionRate} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Session</span>
                    <span className="font-medium">{stats.averageSessionLength} min</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {stats.totalSessions}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">
                      {stats.completedSessions}
                    </div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Focus Sessions</span>
                    </div>
                    <Badge variant="secondary">{stats.focusSessions}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className="text-sm">Total Time</span>
                    </div>
                    <Badge variant="secondary">{formatTime(stats.totalFocusMinutes)}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent"></div>
                      <span className="text-sm">This Week</span>
                    </div>
                    <Badge variant="secondary">{stats.weekSessions}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {stats.completionRate}%
                </div>
                <p className="text-muted-foreground">Session Completion Rate</p>
                <div className="text-sm text-muted-foreground">
                  You complete {stats.completedSessions} out of {stats.totalSessions} sessions on average
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.averageSessionLength}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg. Minutes/Session</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(stats.totalFocusMinutes / 60 * 10) / 10}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted/20">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.todaySessions}
                  </div>
                  <p className="text-sm text-muted-foreground">Today's Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button onClick={() => refetch()} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Statistics
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}