import { useState } from "react";
import { Target, Plus, Edit2, Trash2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Goal {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  current: number;
  unit: "minutes" | "sessions" | "cycles";
  createdAt: string;
  completed: boolean;
}

export default function GoalSetting() {
  const [goals, setGoals] = useLocalStorage<Goal[]>("focusflow_goals", []);
  const [showDialog, setShowDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "daily" as Goal["type"],
    target: 60,
    unit: "minutes" as Goal["unit"],
  });

  const addGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      current: 0,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      type: "daily",
      target: 60,
      unit: "minutes",
    });
    setShowDialog(false);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const markCompleted = (id: string) => {
    updateGoal(id, { completed: true, current: goals.find(g => g.id === id)?.target || 0 });
  };

  const resetGoal = (id: string) => {
    updateGoal(id, { completed: false, current: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-maroon">Goals & Targets</h2>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Daily Focus Time"
                />
              </div>
              <div>
                <Label htmlFor="goal-description">Description</Label>
                <Input
                  id="goal-description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Brief description of your goal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-type">Time Period</Label>
                  <Select value={newGoal.type} onValueChange={(value: Goal["type"]) => setNewGoal({ ...newGoal, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goal-unit">Unit</Label>
                  <Select value={newGoal.unit} onValueChange={(value: Goal["unit"]) => setNewGoal({ ...newGoal, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="sessions">Sessions</SelectItem>
                      <SelectItem value="cycles">Cycles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="goal-target">Target ({newGoal.unit})</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                  min="1"
                />
              </div>
              <Button onClick={addGoal} disabled={!newGoal.title.trim()} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals set yet</h3>
            <p className="text-muted-foreground mb-4">
              Set daily, weekly, or monthly goals to stay motivated
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const isCompleted = goal.completed || goal.current >= goal.target;
            
            return (
              <Card key={goal.id} className={isCompleted ? "border-success bg-success/5" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge variant={goal.type === "daily" ? "default" : goal.type === "weekly" ? "secondary" : "outline"}>
                        {goal.type}
                      </Badge>
                      {isCompleted && (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => deleteGoal(goal.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <div className="text-right text-xs text-muted-foreground">
                      {Math.round(progress)}% complete
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => resetGoal(goal.id)}>
                        Reset Goal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}