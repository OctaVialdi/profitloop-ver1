
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { AIRecommendation } from '@/types/dashboard';

interface AIRecommendationCardProps {
  recommendations: AIRecommendation[];
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ recommendations }) => {
  // Check if we have recommendations to display
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            AI Recommendations
          </CardTitle>
          <CardDescription>No recommendations available at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            As your organization collects more data, our AI will provide actionable insights here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get the priority icon based on recommendation priority
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <HelpCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Actionable insights based on your data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="rounded-md border p-3 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {getPriorityIcon(recommendation.priority)}
                <div>
                  <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{recommendation.description}</p>
                </div>
              </div>
              {recommendation.actionable && (
                <Button variant="ghost" size="sm" className="h-8">
                  <span className="mr-1 text-xs">Take Action</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
