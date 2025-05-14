
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Kol } from "@/hooks/useKols";
import { supabase } from "@/integrations/supabase/client";

interface KolAddFormProps {
  setCurrentView: (view: string) => void;
  onCreateKol: (kol: Omit<Kol, 'id' | 'created_at' | 'updated_at'>) => Promise<Kol | null>;
  organizationId?: string;
}

export const KolAddForm: React.FC<KolAddFormProps> = ({ 
  setCurrentView, 
  onCreateKol,
  organizationId
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    followers: 0,
    engagement: 0,
    status: "Active",
    score: 0,
    avatar: ""
  });

  // Categories for new KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Update form data with new avatar
      handleInputChange('avatar', urlData.publicUrl);
      
      toast({
        title: "Image Uploaded",
        description: "Profile photo has been uploaded successfully",
      });
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
  
  const handleStatusToggle = (checked: boolean) => {
    handleInputChange('status', checked ? 'Active' : 'Inactive');
  };
  
  const handleSubmit = async () => {
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "KOL name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!organizationId) {
      toast({
        title: "Organization Error",
        description: "Could not determine organization ID",
        variant: "destructive"
      });
      return;
    }
    
    const result = await onCreateKol({
      ...formData,
      organization_id: organizationId
    });
    
    if (result) {
      setCurrentView("list");
    }
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Add New KOL</h3>
          <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={!formData.name}
          >
            Create KOL
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-gray-100/50 rounded-md">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">General</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white" disabled>Social Media</TabsTrigger>
          <TabsTrigger value="rates" className="data-[state=active]:bg-white" disabled>Rates</TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white" disabled>Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-1">Profile Photo</h4>
              <p className="text-sm text-gray-500 mb-4">Upload a profile photo for this KOL</p>
              
              <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full relative mx-auto md:mx-0">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Profile Preview" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-light text-gray-400">K</div>
                )}
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
                      value={formData.followers || ''}
                      onChange={(e) => handleInputChange('followers', parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.engagement || ''}
                      onChange={(e) => handleInputChange('engagement', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="active" 
                    checked={formData.status === 'Active'} 
                    onCheckedChange={handleStatusToggle}
                  />
                  <label htmlFor="active" className="text-sm font-medium">
                    Active Status
                  </label>
                  <span className="text-xs text-gray-500 ml-2">
                    {formData.status === "Active" ? "Active - available for campaigns" : "Inactive - not available for campaigns"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          <div className="flex items-center justify-center flex-col py-12 text-gray-500">
            <p>Please save the KOL first to add social media accounts</p>
          </div>
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          <div className="flex items-center justify-center flex-col py-12 text-gray-500">
            <p>Please save the KOL first to add rate cards</p>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <div className="flex items-center justify-center flex-col py-12 text-gray-500">
            <p>Please save the KOL first to add metrics</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
