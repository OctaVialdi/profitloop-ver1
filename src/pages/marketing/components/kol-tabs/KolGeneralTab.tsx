
import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { Kol } from "@/hooks/useKols";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface KolGeneralTabProps {
  selectedKol: Kol;
  formatNumber: (num: number) => string;
  onUpdate: (id: string, updates: Partial<Kol>) => Promise<Kol | null>;
  onStatusToggle: () => Promise<void>;
}

export const KolGeneralTab: React.FC<KolGeneralTabProps> = ({ 
  selectedKol, 
  formatNumber,
  onUpdate,
  onStatusToggle
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: selectedKol.name,
    category: selectedKol.category || "",
    followers: selectedKol.followers || 0,
    engagement: selectedKol.engagement || 0,
  });
  const [uploading, setUploading] = useState(false);
  
  // Categories for KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];
  
  const handleInputChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSaveChanges = async () => {
    const result = await onUpdate(selectedKol.id, formData);
    if (result) {
      toast({
        title: "KOL Updated",
        description: "KOL information has been updated successfully",
      });
    }
  };
  
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `kol-avatars/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      if (!urlData) throw new Error("Couldn't get public URL");
      
      // Update KOL with new avatar
      const result = await onUpdate(selectedKol.id, {
        avatar: urlData.publicUrl
      });
      
      if (result) {
        toast({
          title: "Avatar Updated",
          description: "Profile photo has been updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Error uploading image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
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
          <label className="absolute -right-2 -bottom-2 bg-white rounded-full p-2 shadow-sm border cursor-pointer">
            <Upload size={16} className={`text-gray-500 ${uploading ? 'animate-spin' : ''}`} />
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              accept="image/*"
              disabled={uploading}
            />
          </label>
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
              value={formData.name} 
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed across the platform.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
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
                value={formData.followers} 
                onChange={(e) => handleInputChange('followers', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={formData.engagement} 
                onChange={(e) => handleInputChange('engagement', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="active" 
              checked={selectedKol.status === "Active"} 
              onCheckedChange={onStatusToggle}
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active Status
            </label>
            <span className="text-xs text-gray-500 ml-2">
              {selectedKol.status === "Active" ? "Active - available for campaigns" : "Inactive - not available for campaigns"}
            </span>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
