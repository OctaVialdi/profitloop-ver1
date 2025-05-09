
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus } from 'lucide-react';
import { GoalCard } from './GoalCard';
import { CompanyGoal } from '@/types/dashboard';
import { Checkbox } from '@/components/ui/checkbox';

interface CompanyGoalsSectionProps {
  goals: CompanyGoal[];
  onAddGoal?: (goal: Partial<CompanyGoal>) => void;
}

export function CompanyGoalsSection({ goals, onAddGoal }: CompanyGoalsSectionProps) {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<CompanyGoal>>({
    name: '',
    targetAmount: 0,
    currentProgress: 0,
    deadline: new Date().toISOString().split('T')[0],
    isCritical: false,
    icon: '🎯'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddGoal) {
      onAddGoal(newGoal);
    }
    setIsAddGoalOpen(false);
    setNewGoal({
      name: '',
      targetAmount: 0,
      currentProgress: 0,
      deadline: new Date().toISOString().split('T')[0],
      isCritical: false,
      icon: '🎯'
    });
  };

  // List of emoji icons for goals
  const goalIcons = ['🎯', '💰', '🚀', '🏆', '📈', '💪', '🏝️', '🏠', '🚗', '💻'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Company Goals</h2>
        <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Clear Debt"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (Rp)</Label>
                <Input 
                  id="targetAmount" 
                  type="number"
                  placeholder="e.g., 50000000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentProgress">Current Progress (Rp)</Label>
                <Input 
                  id="currentProgress" 
                  type="number"
                  placeholder="e.g., 10000000"
                  value={newGoal.currentProgress}
                  onChange={(e) => setNewGoal({...newGoal, currentProgress: Number(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <div className="relative">
                  <Input 
                    id="deadline" 
                    type="date"
                    value={newGoal.deadline?.toString().split('T')[0]}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isCritical" 
                  checked={newGoal.isCritical}
                  onCheckedChange={(checked) => setNewGoal({...newGoal, isCritical: checked === true})}
                />
                <Label htmlFor="isCritical">Mark as Critical Priority</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Choose Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {goalIcons.map(icon => (
                    <Button
                      key={icon}
                      type="button"
                      variant={newGoal.icon === icon ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewGoal({...newGoal, icon})}
                      className="text-lg"
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button type="submit" className="w-full">Add Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              name={goal.name}
              targetAmount={goal.targetAmount}
              currentProgress={goal.currentProgress}
              deadline={goal.deadline}
              isCritical={goal.isCritical}
              icon={goal.icon}
            />
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No Goals Set</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You haven't set any company goals yet. Click the "Add Goal" button to create your first goal.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
