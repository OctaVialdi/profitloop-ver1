
import React from "react";
import { Input } from "@/components/ui/input";

interface KolMetricsTabProps {
  selectedKol: any;
}

export const KolMetricsTab: React.FC<KolMetricsTabProps> = ({ selectedKol }) => {
  return (
    <div>
      <h4 className="font-semibold mb-1">Performance Metrics</h4>
      <p className="text-sm text-gray-500 mb-6">Track and update key performance metrics for this KOL</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-purple-800 text-lg font-bold">{selectedKol.engagement}%</p>
          <p className="text-sm text-purple-700">Engagement Rate</p>
          <p className="text-xs text-purple-600 mt-1">(Likes + Comments + Shares) / Followers * 100</p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-bold">212%</p>
          <p className="text-sm text-blue-700">ROI</p>
          <p className="text-xs text-blue-600 mt-1">(Revenue - Cost) / Cost * 100</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-green-800 text-lg font-bold">3.8%</p>
          <p className="text-sm text-green-700">Conversion Rate</p>
          <p className="text-xs text-green-600 mt-1">Purchases / Clicks * 100</p>
        </div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h5 className="font-medium mb-4">Engagement Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Likes</label>
              <Input type="number" placeholder="0" defaultValue="12500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comments</label>
              <Input type="number" placeholder="0" defaultValue="1840" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shares</label>
              <Input type="number" placeholder="0" defaultValue="726" />
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Conversion Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Clicks</label>
              <Input type="number" placeholder="0" defaultValue="8745" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purchases</label>
              <Input type="number" placeholder="0" defaultValue="332" />
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Financial Metrics</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Revenue (IDR)</label>
              <Input type="number" placeholder="0" defaultValue="45000000" />
              <p className="text-xs text-gray-500 mt-1">Current value: Rp 45,000,000</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost (IDR)</label>
              <Input type="number" placeholder="0" defaultValue="15000000" />
              <p className="text-xs text-gray-500 mt-1">Current value: Rp 15,000,000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
