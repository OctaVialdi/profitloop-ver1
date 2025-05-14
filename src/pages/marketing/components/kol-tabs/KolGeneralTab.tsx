
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface KolGeneralTabProps {
  selectedKol: any;
  formatNumber: (num: number) => string;
}

export const KolGeneralTab: React.FC<KolGeneralTabProps> = ({ 
  selectedKol, 
  formatNumber 
}) => {
  // Categories for KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-semibold mb-1">Profile Photo</h4>
        <p className="text-sm text-gray-500 mb-4">Upload a profile photo for this KOL</p>
        
        <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full relative mx-auto md:mx-0">
          <Avatar className="w-32 h-32">
            <AvatarImage src={selectedKol.avatar} alt={selectedKol.name} className="object-cover" />
            <AvatarFallback className="text-5xl font-light text-gray-400">
              {selectedKol.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
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
            <Input placeholder="Enter KOL name" defaultValue={selectedKol.name} />
            <p className="text-xs text-gray-500 mt-1">This will be displayed across the platform.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select defaultValue={selectedKol.category.toLowerCase()}>
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
              <Input type="number" placeholder="0" defaultValue={selectedKol.followers} />
              <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
              <Input type="number" placeholder="0" defaultValue={selectedKol.engagement} />
              <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="active" defaultChecked={selectedKol.status === "Active"} />
            <label htmlFor="active" className="text-sm font-medium">
              Active Status
            </label>
            <span className="text-xs text-gray-500 ml-2">
              {selectedKol.status === "Active" ? "Active - available for campaigns" : "Inactive - not available for campaigns"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
