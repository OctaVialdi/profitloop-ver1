import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Upload, X, Trash, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useKols } from "@/hooks/useKols";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface KolGeneralTabProps {
  selectedKol: any;
  formatNumber: (num: number) => string;
  onDataChange: (field: string, value: any) => void;
}

export const KolGeneralTab: React.FC<KolGeneralTabProps> = ({ 
  selectedKol, 
  formatNumber,
  onDataChange 
}) => {
  const [name, setName] = useState(selectedKol?.full_name || "");
  const [category, setCategory] = useState(selectedKol?.category || "");
  const [followers, setFollowers] = useState(selectedKol?.total_followers?.toString() || "0");
  const [engagement, setEngagement] = useState(selectedKol?.engagement_rate?.toString() || "0");
  const [isActive, setIsActive] = useState(selectedKol?.is_active || false);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const [isDeletePhotoDialogOpen, setIsDeletePhotoDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadKolPhoto, removeKolPhoto } = useKols();
  
  // Initialize state with selectedKol data when it changes
  useEffect(() => {
    if (selectedKol) {
      setName(selectedKol.full_name || "");
      setCategory(selectedKol.category || "");
      setFollowers(selectedKol.total_followers?.toString() || "0");
      setEngagement(selectedKol.engagement_rate?.toString() || "0");
      setIsActive(selectedKol.is_active || false);
      setLocalPhotoUrl(null);
      setPhotoRemoved(false);
    }
  }, [selectedKol]);
  
  // Update parent component with changes
  useEffect(() => {
    onDataChange("full_name", name);
  }, [name, onDataChange]);
  
  useEffect(() => {
    onDataChange("category", category);
  }, [category, onDataChange]);
  
  useEffect(() => {
    onDataChange("total_followers", parseInt(followers) || 0);
  }, [followers, onDataChange]);
  
  useEffect(() => {
    onDataChange("engagement_rate", parseFloat(engagement) || 0);
  }, [engagement, onDataChange]);
  
  useEffect(() => {
    onDataChange("is_active", isActive);
  }, [isActive, onDataChange]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the file immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLocalPhotoUrl(e.target.result as string);
        setPhotoRemoved(false);
      }
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    setIsUploading(true);
    try {
      const updatedKol = await uploadKolPhoto(selectedKol.id, file);
      if (updatedKol && updatedKol.photo_url) {
        toast({
          title: "Success",
          description: "Profile photo uploaded successfully",
        });
        // Don't need to set localPhotoUrl as we already have the preview
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemovePhoto = async () => {
    setIsRemoving(true);
    try {
      await removeKolPhoto(selectedKol.id);
      
      // Immediately update the UI
      setLocalPhotoUrl(null);
      setPhotoRemoved(true);
      setIsDeletePhotoDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Photo removed successfully",
      });
    } catch (error) {
      console.error("Error removing photo:", error);
      toast({
        title: "Error",
        description: "Failed to remove photo",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };
  
  // Get display photo URL (local preview or stored URL)
  const displayPhotoUrl = photoRemoved ? null : (localPhotoUrl || selectedKol?.photo_url);
  
  // Check if KOL has a photo (either locally or stored)
  const hasPhoto = !!displayPhotoUrl;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-2 border-gray-200">
                <AvatarImage src={displayPhotoUrl || undefined} alt={name} className="object-cover" />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl">
                  {name ? name.charAt(0).toUpperCase() : "K"}
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
            
            {hasPhoto && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => setIsDeletePhotoDialogOpen(true)}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removing...
                  </span>
                ) : (
                  <>
                    <Trash size={14} className="mr-1" /> Remove Photo
                  </>
                )}
              </Button>
            )}
            
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="kol-category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beauty">Beauty</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Tech">Tech</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
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
                value={followers}
                onChange={(e) => setFollowers(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-1/2">
              <Label htmlFor="kol-engagement">Engagement Rate (%)</Label>
              <Input
                id="kol-engagement"
                placeholder="0"
                type="number"
                step="0.01"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="kol-active" 
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="kol-active">Active KOL</Label>
          </div>
        </div>
      </div>
      
      {/* Delete Photo Confirmation Dialog */}
      <AlertDialog open={isDeletePhotoDialogOpen} onOpenChange={setIsDeletePhotoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Profile Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the profile photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleRemovePhoto}
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
