
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

interface GeneralTabProps {
  formData: {
    full_name: string;
    category: string;
    total_followers: number;
    engagement_rate: number;
    is_active: boolean;
  };
  handleChange: (field: string, value: any) => void;
  categories: string[];
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  formData,
  handleChange,
  categories
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-semibold mb-1">Profile Photo</h4>
        <p className="text-sm text-gray-500 mb-4">Upload a profile photo for this KOL</p>
        
        <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full relative mx-auto md:mx-0">
          <div className="text-5xl font-light text-gray-400">K</div>
          <div className="absolute -right-2 -bottom-2 bg-white rounded-full p-2 shadow-sm border">
            <Upload size={16} className="text-gray-500" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center md:text-left">Upload a square photo of the KOL. Recommended size 500×500px.</p>
      </div>
      
      <div className="col-span-2 space-y-6">
        <h4 className="font-semibold mb-2">Basic Information</h4>
        <p className="text-sm text-gray-500 mb-4">KOL profile information</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input 
              placeholder="Enter KOL name" 
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed across the platform.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select 
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Primary content category for the KOL.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Followers</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.total_followers.toString()}
                onChange={(e) => handleChange("total_followers", parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.engagement_rate.toString()}
                onChange={(e) => handleChange("engagement_rate", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="active" 
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange("is_active", checked)}
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active Status
            </label>
            <span className="text-xs text-gray-500 ml-2">
              {formData.is_active ? "Active - available for campaigns" : "Inactive - not available for campaigns"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
