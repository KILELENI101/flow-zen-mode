import { useState } from "react";
import { BarChart3, Clock, Target, TrendingUp, Calendar, Award, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStats } from "@/hooks/useStats";

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

const timePeriods = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'year', label: 'This Year' },
];

export default function StatsView() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const { stats, loading, fetchStats } = useStats(selectedPeriod);
  
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
  };

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
        <Button onClick={() => fetchStats(selectedPeriod)} variant="outline">
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

      {/* Time Period Selector */}
      <div className="flex justify-center">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-maroon/10 to-maroon/5 border-maroon/20">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-maroon" />
                <div className="text-2xl font-bold text-maroon">
                  {formatTime(stats.totalFocusMinutes)}
                </div>
                <p className="text-sm text-muted-foreground">Focus Time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald/10 to-emerald/5 border-emerald/20">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-emerald" />
                <div className="text-2xl font-bold text-emerald-dark">
                  {stats.focusSessions}
                </div>
                <p className="text-sm text-muted-foreground">Focus Sessions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-violet/10 to-violet/5 border-violet/20">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-violet" />
                <div className="text-2xl font-bold text-violet-dark">
                  {stats.todaySessions}
                </div>
                <p className="text-sm text-muted-foreground">Today</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-golden/10 to-golden/5 border-golden/20">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 mx-auto mb-2 text-golden-dark" />
                <div className="text-2xl font-bold text-golden-dark">
                  {stats.completionRate}%
                </div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Time-based Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-maroon/10 to-maroon/5 border-maroon/20 hover:shadow-lg transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-maroon">
                  {stats.todaySessions}
                </div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald/10 to-emerald/5 border-emerald/20 hover:shadow-lg transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-emerald-dark">
                  {stats.weekSessions}
                </div>
                <p className="text-xs text-muted-foreground">This Week</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-violet/10 to-violet/5 border-violet/20 hover:shadow-lg transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-violet-dark">
                  {stats.monthSessions}
                </div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-golden/10 to-golden/5 border-golden/20 hover:shadow-lg transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-golden-dark">
                  {stats.sixMonthSessions}
                </div>
                <p className="text-xs text-muted-foreground">6 Months</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-cyan/10 to-cyan/5 border-cyan/20 hover:shadow-lg transition-smooth">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-cyan-dark">
                  {stats.yearSessions}
                </div>
                <p className="text-xs text-muted-foreground">This Year</p>
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
                      <span className="text-sm">Period: {stats.period === 'all' ? 'All Time' : timePeriods.find(p => p.value === stats.period)?.label}</span>
                    </div>
                    <Badge variant="secondary">{stats.totalSessions}</Badge>
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
                  You complete {stats.completedSessions} out of {stats.totalSessions} sessions
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
                    {stats.focusSessions}
                  </div>
                  <p className="text-sm text-muted-foreground">Focus Sessions</p>
                </div>
              </div>

              {/* Time Period Comparison */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <div className="text-lg font-bold text-foreground">
                    {stats.weekSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-success/10 to-success/5">
                  <div className="text-lg font-bold text-foreground">
                    {stats.monthSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5">
                  <div className="text-lg font-bold text-foreground">
                    {stats.sixMonthSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">6 Months</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5">
                  <div className="text-lg font-bold text-foreground">
                    {stats.yearSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">This Year</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button onClick={() => fetchStats(selectedPeriod)} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Statistics
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}