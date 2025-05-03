
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const TrainingBudgetCard: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Budget Training</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Budget</span>
            <span className="font-semibold">Rp 150.000.000</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Terpakai</span>
            <span className="font-semibold text-amber-600">Rp 68.500.000</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sisa</span>
            <span className="font-semibold text-green-600">Rp 81.500.000</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-gray-600">Penggunaan Budget</div>
          <div className="flex items-center mt-2">
            <div className="h-2 bg-purple-600 rounded-full w-[46%]"></div>
            <span className="text-sm text-gray-700 ml-2">46%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
