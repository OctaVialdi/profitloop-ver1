
import React from "react";
import { Badge } from "@/components/ui/badge";

interface KolGeneralTabProps {
  kolData: {
    id: string;
    full_name: string;
    category: string;
    total_followers: number;
    engagement_rate: number;
    photo_url: string | null;
    is_active: boolean;
    created_at: string;
  };
}

const KolGeneralTab: React.FC<KolGeneralTabProps> = ({ kolData }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-square bg-muted/30 rounded-md overflow-hidden">
            {kolData.photo_url ? (
              <img 
                src={kolData.photo_url} 
                alt={kolData.full_name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{kolData.full_name}</h2>
            <Badge variant={kolData.is_active ? "default" : "outline"}>
              {kolData.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
              <p>{kolData.category}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Total Followers</h4>
              <p>{kolData.total_followers?.toLocaleString() || 0}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Engagement Rate</h4>
              <p>{kolData.engagement_rate?.toFixed(2) || 0}%</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Date Added</h4>
              <p>{new Date(kolData.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KolGeneralTab;
