
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, LineChart, BarChart3, Wallet } from "lucide-react";

interface KolDashboardCardsProps {
  activeKols: number;
  totalKols: number;
}

export const KolDashboardCards: React.FC<KolDashboardCardsProps> = ({ activeKols, totalKols }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total KOLs */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="flex items-center p-6">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Total KOLs</p>
            <h3 className="text-3xl font-bold mt-1">{totalKols}</h3>
            <p className="text-xs text-gray-500 mt-1">{activeKols} active KOLs</p>
          </div>
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="text-purple-500" size={20} />
          </div>
        </CardContent>
      </Card>
      
      {/* Active Projects */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="flex items-center p-6">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Active Projects</p>
            <h3 className="text-3xl font-bold mt-1">13</h3>
            <p className="text-xs text-gray-500 mt-1">Live campaigns</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <LineChart className="text-blue-500" size={20} />
          </div>
        </CardContent>
      </Card>
      
      {/* Avg. Engagement */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="flex items-center p-6">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Avg. Engagement</p>
            <h3 className="text-3xl font-bold mt-1">330%</h3>
            <p className="text-xs text-gray-500 mt-1">Across all platforms</p>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-green-500" size={20} />
          </div>
        </CardContent>
      </Card>
      
      {/* Total Revenue */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="flex items-center p-6">
          <div className="flex-1">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-3xl font-bold mt-1">Rp 234.500.000</h3>
            <p className="text-xs text-gray-500 mt-1">From all KOL campaigns</p>
          </div>
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Wallet className="text-amber-500" size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
