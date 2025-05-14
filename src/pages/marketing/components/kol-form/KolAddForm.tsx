
import React, { useState, useRef } from "react";
import { NewKolData, useKols } from "@/hooks/useKols";
import { toast } from "@/components/ui/use-toast";
import { KolFormTabs } from "./KolFormTabs";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KolAddFormProps {
  setCurrentView: (view: string) => void;
}

export const KolAddForm: React.FC<KolAddFormProps> = ({ setCurrentView }) => {
  // Categories for new KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];

  const { addKol, isLoading, fetchKols, uploadKolPhoto, addPlatform, addRateCard } = useKols();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    category: "",
    total_followers: 0,
    engagement_rate: 0,
    is_active: false,
    tempSocialMedia: [] as any[],
    tempRates: [] as any[]
  });

  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (field: keyof typeof formData | string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the file immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLocalPhotoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Store the file for later upload
    setPhotoFile(file);
  };

  const handleSubmit = async () => {
    if (!formData.full_name) {
      toast({
        title: "Error",
        description: "Please enter the KOL name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    try {
      const newKolData: Omit<NewKolData, 'organization_id'> = {
        full_name: formData.full_name,
        category: formData.category,
        total_followers: Number(formData.total_followers),
        engagement_rate: Number(formData.engagement_rate),
        is_active: formData.is_active
      };

      const result = await addKol(newKolData);
      if (result) {
        // If we have a photo file, upload it
        if (photoFile && result.id) {
          await uploadKolPhoto(result.id, photoFile);
        }
        
        // Now add any social media platforms
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
        
        // Make sure to call fetchKols to update the KOL list
        await fetchKols();
        setCurrentView("list");
        
        toast({
          title: "Success",
          description: "KOL has been added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding KOL:", error);
      toast({
        title: "Error",
        description: "Failed to add KOL",
        variant: "destructive",
      });
    }
  };

  // Generate display name for avatar fallback
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "K";
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-transparent p-0"
              onClick={() => setCurrentView("list")}
            >
              <ArrowLeftCircle size={20} className="mr-2 text-gray-500" />
            </Button>
            Add New KOL
          </h3>
          <p className="text-sm text-gray-500 mt-1">Create a new KOL profile with details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add KOL"}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-2 border-gray-200">
                <AvatarImage src={localPhotoUrl || undefined} alt={formData.full_name} className="object-cover" />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl">
                  {getInitials(formData.full_name)}
                </AvatarFallback>
              </Avatar>
              
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full bg-white h-8 w-8"
                onClick={handlePhotoClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="animate-spin">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  <Camera size={14} />
                )}
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Recommended: Square image, at least 300x300px
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 space-y-4">
          <div>
            <Label htmlFor="kol-name">Full Name</Label>
            <Input
              id="kol-name"
              placeholder="Enter KOL's full name"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="kol-category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="kol-followers">Total Followers</Label>
              <Input
                id="kol-followers"
                placeholder="0"
                type="number"
                value={formData.total_followers || ""}
                onChange={(e) => handleChange("total_followers", e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <Label htmlFor="kol-engagement">Engagement Rate (%)</Label>
              <Input
                id="kol-engagement"
                placeholder="0"
                type="number"
                step="0.01"
                value={formData.engagement_rate || ""}
                onChange={(e) => handleChange("engagement_rate", e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="kol-active" 
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange("is_active", checked)}
            />
            <Label htmlFor="kol-active">Active KOL</Label>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 bg-gray-100/50 rounded-md">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">General</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white">Social Media</TabsTrigger>
          <TabsTrigger value="rates" className="data-[state=active]:bg-white">Rates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          {/* General tab content */}
          <div className="space-y-4 p-4">
            <h4 className="font-medium">Basic Information</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add basic information about the KOL here.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          {/* Use the SocialMediaTab here */}
          <KolFormTabs 
            formData={formData}
            handleChange={handleChange}
            categories={categories}
            activeTab="social"
          />
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          {/* Rates tab content */}
          <KolFormTabs 
            formData={formData}
            handleChange={handleChange}
            categories={categories}
            activeTab="rates"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
