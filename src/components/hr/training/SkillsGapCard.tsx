
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SkillsGapCard: React.FC = () => {
  const skills = [
    { name: "Digital Marketing", proficiency: 60 },
    { name: "Leadership", proficiency: 75 },
    { name: "Java Programming", proficiency: 45 },
    { name: "Financial Planning", proficiency: 70 },
    { name: "Customer Service", proficiency: 82 },
    { name: "Agile Project Management", proficiency: 55 },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Skills Gap Analysis</h2>
          <Button variant="outline" size="sm" className="text-xs">
            View Full Analysis
          </Button>
        </div>
        
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{skill.name}</span>
                <span className="text-sm font-medium">{skill.proficiency}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-purple-600 rounded-full" 
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
