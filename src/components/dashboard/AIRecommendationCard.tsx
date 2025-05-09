
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIRecommendationCardProps {
  recommendations: string[];
}

export function AIRecommendationCard({ recommendations }: AIRecommendationCardProps) {
  const [currentRecommendation, setCurrentRecommendation] = useState(0);

  const nextRecommendation = () => {
    setCurrentRecommendation((prev) => (prev + 1) % recommendations.length);
  };

  const prevRecommendation = () => {
    setCurrentRecommendation((prev) => 
      prev === 0 ? recommendations.length - 1 : prev - 1
    );
  };

  return (
    <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-500" />
          <CardTitle className="text-sm text-indigo-900">AI Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-indigo-800">
            {recommendations[currentRecommendation]}
          </div>

          {recommendations.length > 1 && (
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {recommendations.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === currentRecommendation
                        ? 'bg-indigo-500'
                        : 'bg-indigo-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={prevRecommendation}>
                  Prev
                </Button>
                <Button variant="ghost" size="sm" onClick={nextRecommendation}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
