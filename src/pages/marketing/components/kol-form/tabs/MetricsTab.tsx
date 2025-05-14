
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
          Enter initial metrics for this KOL
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="card bg-gray-50 p-6 rounded-lg flex-1">
            <h4 className="font-medium text-gray-800">Engagement Metrics</h4>
            <p className="text-sm text-gray-500 mb-4">Initial engagement data</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Likes</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.likes || 0}
                  onChange={(e) => handleChange('likes', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Comments</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.comments || 0}
                  onChange={(e) => handleChange('comments', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shares</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.shares || 0}
                  onChange={(e) => handleChange('shares', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Impressions</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.impressions || 0}
                  onChange={(e) => handleChange('impressions', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <div className="card bg-gray-50 p-6 rounded-lg flex-1">
            <h4 className="font-medium text-gray-800">Conversion Metrics</h4>
            <p className="text-sm text-gray-500 mb-4">Initial conversion data</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Link Clicks</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.clicks || 0}
                  onChange={(e) => handleChange('clicks', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Purchases</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.purchases || 0}
                  onChange={(e) => handleChange('purchases', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Revenue Generated</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.revenue || 0}
                  onChange={(e) => handleChange('revenue', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Cost</label>
                <input
                  type="number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.cost || 0}
                  onChange={(e) => handleChange('cost', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
