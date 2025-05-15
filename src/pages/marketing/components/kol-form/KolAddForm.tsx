import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useKols } from "@/hooks/useKols";
import { PlusIcon, ImageIcon } from "lucide-react";
import { KolFormTabs } from "./KolFormTabs";

export const KolAddForm = ({ setCurrentView }: { setCurrentView: (view: string) => void }) => {
  const categories = [
    "Fashion", "Beauty", "Food", "Travel", "Fitness", "Lifestyle", 
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];

  const { addKol, isLoading, fetchKols, uploadKolPhoto, addPlatform, addRateCard, updateMetrics } = useKols();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    category: "",
    total_followers: 0,
    engagement_rate: 0,
    is_active: false,
    tempSocialMedia: [] as any[],
    tempRates: [] as any[],
    // Metrics data
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    cost: 0,
    impressions: 0
  });

  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setLocalPhotoUrl(objectUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSocialMedia = (platform: string, handle: string, url: string, followers: number, engagement: number) => {
    const newPlatform = {
      platform,
      handle,
      profile_url: url,
      followers: Number(followers),
      engagement: Number(engagement)
    };
    
    setFormData(prev => ({
      ...prev,
      tempSocialMedia: [...prev.tempSocialMedia, newPlatform],
      // Update total followers
      total_followers: Number(prev.total_followers) + Number(followers)
    }));
  };

  const handleRemoveSocialMedia = (index: number) => {
    const platformToRemove = formData.tempSocialMedia[index];
    const followersToRemove = platformToRemove.followers || 0;
    
    setFormData(prev => ({
      ...prev,
      tempSocialMedia: prev.tempSocialMedia.filter((_, i) => i !== index),
      // Update total followers
      total_followers: Math.max(0, Number(prev.total_followers) - Number(followersToRemove))
    }));
  };

  const handleAddRate = (platform: string, currency: string, minRate: number, maxRate: number) => {
    const newRate = {
      platform,
      currency,
      min_rate: minRate,
      max_rate: maxRate
    };
    
    setFormData(prev => ({
      ...prev,
      tempRates: [...prev.tempRates, newRate]
    }));
  };
  
  const handleRemoveRate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tempRates: prev.tempRates.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.full_name || !formData.category) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Extract only the needed fields for KOL creation
      const kolData = {
        full_name: formData.full_name,
        category: formData.category,
        total_followers: formData.total_followers,
        engagement_rate: formData.engagement_rate,
        is_active: formData.is_active,
      };
      
      // Create the KOL
      const result = await addKol(kolData);
      
      if (result) {
        // Upload photo if selected
        if (photoFile) {
          await uploadKolPhoto(result.id, photoFile);
        }
        
        // Add social media platforms if any are defined
        if (formData.tempSocialMedia && formData.tempSocialMedia.length > 0) {
          for (const platform of formData.tempSocialMedia) {
            await addPlatform(result.id, platform);
          }
        }
        
        // Add rate cards if any are defined
        if (formData.tempRates && formData.tempRates.length > 0) {
          for (const rate of formData.tempRates) {
            await addRateCard(result.id, {
              platform: rate.platform,
              currency: rate.currency,
              min_rate: rate.min_rate,
              max_rate: rate.max_rate
            });
          }
        }
        
        // Add metrics data if available
        const metricsData = {
          likes: formData.likes || 0,
          comments: formData.comments || 0,
          shares: formData.shares || 0,
          clicks: formData.clicks || 0,
          purchases: formData.purchases || 0,
          revenue: formData.revenue || 0,
          cost: formData.cost || 0,
          impressions: formData.impressions || 0
        };
        
        await updateMetrics(result.id, metricsData);
        
        toast.success("KOL has been added successfully");
        
        // Reset form and go back to list view
        await fetchKols();
        setCurrentView("list");
      }
    } catch (error) {
      console.error("Error adding KOL:", error);
      toast.error("Failed to add KOL");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Add New KOL</h3>
          <p className="text-sm text-gray-500">Create a new Key Opinion Leader profile</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView("list")}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : "Add KOL"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Card className="p-4 h-fit">
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden"
              onClick={triggerFileInput}
            >
              {localPhotoUrl ? (
                <img 
                  src={localPhotoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-10 w-10 text-gray-400 mx-auto" />
                  <span className="text-sm text-gray-500 block mt-2">Upload Photo</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={triggerFileInput}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> 
              {localPhotoUrl ? "Change Photo" : "Add Photo"}
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Recommended: Square image, 300x300px or larger
            </div>
          </div>
        </Card>
        
        <Tabs defaultValue="general" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-4">
            <div className="space-y-4 p-4 border rounded-md">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Total Followers</label>
                  <input
                    type="number"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={formData.total_followers}
                    onChange={(e) => handleChange('total_followers', Number(e.target.value))}
                    disabled={formData.tempSocialMedia.length > 0}
                    title={formData.tempSocialMedia.length > 0 ? "This is calculated from social media platforms" : ""}
                  />
                  {formData.tempSocialMedia.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">Automatically calculated from platforms</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={formData.engagement_rate}
                    onChange={(e) => handleChange('engagement_rate', Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="is_active"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.is_active}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                />
                <label htmlFor="is_active" className="ml-2 text-sm">Active KOL</label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-6">
            <KolFormTabs 
              formData={formData}
              handleChange={handleChange}
              categories={categories}
              activeTab="social"
            />
          </TabsContent>
          
          <TabsContent value="rates" className="mt-6">
            <KolFormTabs 
              formData={formData}
              handleChange={handleChange}
              categories={categories}
              activeTab="rates"
            />
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6">
            <KolFormTabs 
              formData={formData}
              handleChange={handleChange}
              categories={categories}
              activeTab="metrics"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
