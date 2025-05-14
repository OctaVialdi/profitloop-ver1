
import React from "react";

interface MetricsTabProps {
  formData: Record<string, any>;
  handleChange: (field: string, value: any) => void;
}

export const MetricsTab: React.FC<MetricsTabProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">KOL Metrics & Analytics</h3>
        <p className="text-sm text-gray-500 mb-4">
          View and manage analytics for this KOL
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="card bg-gray-50 p-6 rounded-lg flex-1">
            <h4 className="font-medium text-gray-800">Performance Metrics</h4>
            <p className="text-sm text-gray-500 mb-4">Key metrics for last 30 days</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500">Engagement Rate</h5>
                <p className="text-2xl font-bold text-gray-800">{formData.engagement_rate || 0}%</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Total Followers</h5>
                <p className="text-2xl font-bold text-gray-800">
                  {Number(formData.total_followers || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">ROI</h5>
                <p className="text-2xl font-bold text-green-600">--%</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Conversion Rate</h5>
                <p className="text-2xl font-bold text-gray-800">--%</p>
              </div>
            </div>
          </div>
          
          <div className="card bg-gray-50 p-6 rounded-lg flex-1">
            <h4 className="font-medium text-gray-800">Revenue Impact</h4>
            <p className="text-sm text-gray-500 mb-4">Financial performance</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500">Revenue Generated</h5>
                <p className="text-2xl font-bold text-green-600">--</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Total Cost</h5>
                <p className="text-2xl font-bold text-red-600">--</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Net Profit</h5>
                <p className="text-2xl font-bold text-gray-800">--</p>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-500">Cost per Conversion</h5>
                <p className="text-2xl font-bold text-gray-800">--</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-500 italic">
            Note: Metrics data will be available after campaigns are created with this KOL.
          </p>
        </div>
      </div>
    </div>
  );
};
