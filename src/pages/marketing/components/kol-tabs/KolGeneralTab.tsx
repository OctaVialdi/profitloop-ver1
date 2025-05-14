
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KolGeneralTabProps {
  selectedKol: any;
  formatNumber: (num: number) => string;
}

export const KolGeneralTab: React.FC<KolGeneralTabProps> = ({ selectedKol, formatNumber }) => {
  const [formData, setFormData] = useState({
    full_name: selectedKol?.full_name || "",
    category: selectedKol?.category || "",
    is_active: selectedKol?.is_active || false,
    photo_url: selectedKol?.photo_url || "",
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle photo upload change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, photo_url: previewUrl }));
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle toggle switch
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };
  
  // Upload photo to Supabase storage and return the URL
  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return formData.photo_url;
    
    setIsUploading(true);
    try {
      const fileExt = photoFile.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data, error } = await supabase
        .storage
        .from('kol_photos')
        .upload(filePath, photoFile);
        
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('kol_photos')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Photo upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  // Save changes to the KOL
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Upload photo if changed
      const photoUrl = await uploadPhoto();
      
      // Update KOL data
      const { error } = await supabase
        .from('data_kol')
        .update({
          full_name: formData.full_name,
          category: formData.category,
          is_active: formData.is_active,
          photo_url: photoUrl,
        })
        .eq('id', selectedKol.id);
        
      if (error) throw error;
      
      toast.success('KOL updated successfully!');
    } catch (error) {
      console.error('Error updating KOL:', error);
      toast.error('Failed to update KOL');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* KOL Photo */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100">
                {formData.photo_url ? (
                  <img 
                    src={formData.photo_url} 
                    alt={formData.full_name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Photo</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <Label htmlFor="photo" className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-md">
                  Change Photo
                </Label>
                <Input 
                  id="photo" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  className="hidden" 
                />
                <p className="text-xs text-gray-500 mt-2">Recommended: 400x400px</p>
              </div>
            </div>
            
            {/* KOL Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  name="full_name"
                  value={formData.full_name} 
                  onChange={handleInputChange}
                  placeholder="Enter KOL's full name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  name="category"
                  value={formData.category} 
                  onChange={handleInputChange}
                  placeholder="e.g. Beauty, Technology, Fashion" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="is_active" className="mb-2 block">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is_active" 
                    checked={formData.is_active} 
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_active">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* KOL Stats Summary */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">KOL Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-600">Total Followers</p>
              <p className="text-2xl font-bold">{formatNumber(selectedKol.total_followers || 0)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-green-600">Engagement Rate</p>
              <p className="text-2xl font-bold">{selectedKol.engagement_rate || 0}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-sm text-purple-600">Active Platforms</p>
              <p className="text-2xl font-bold">{selectedKol.kol_social_media?.length || 0}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-md">
              <p className="text-sm text-amber-600">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {selectedKol.kol_metrics?.[0]?.conversion_rate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isUploading || isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
