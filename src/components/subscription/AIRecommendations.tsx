
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CirclePlay, BarChart3, Users, ExternalLink, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIRecommendationsProps {
  organizationId: string | null;
  onUpgrade?: () => void;
  className?: string;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  organizationId,
  onUpgrade,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription');
    }
  };

  // This would typically be determined by analyzing user behavior
  // For now, we'll use static recommendations
  const recommendations = [
    {
      id: 'teams',
      title: 'Team Collaboration',
      description: 'Based on your usage, you would benefit from our team collaboration features.',
      icon: <Users className="h-8 w-8 text-blue-500" />,
      benefit: 'Enables seamless work with up to 25 team members'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'You\'ve viewed the analytics tab 12 times during your trial.',
      icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
      benefit: 'Get deeper insights with premium analytics tools'
    },
    {
      id: 'performance',
      title: 'Performance Boost',
      description: 'Upgrade to remove usage limits and speed up your workflow.',
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      benefit: '3x faster processing for your data-heavy operations'
    }
  ];

  return (
    <Card className={`border-primary/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CirclePlay className="h-5 w-5 mr-2 text-primary" />
          AI-Powered Recommendations
        </CardTitle>
        <CardDescription>
          Based on your usage patterns, we recommend these premium features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map(rec => (
            <Card key={rec.id} className="overflow-hidden">
              <div className="flex items-start p-4">
                <div className="bg-muted/50 p-2 rounded mr-3 flex-shrink-0">
                  {rec.icon}
                </div>
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  <p className="text-sm font-semibold mt-1 text-primary">{rec.benefit}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={handleUpgrade}>
          Upgrade to Access All Features
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <a href="https://example.com/premium-features" target="_blank" rel="noopener">
            Learn More <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
