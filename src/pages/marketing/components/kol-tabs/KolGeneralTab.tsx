
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useKols } from "@/hooks/useKols";

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
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadKolPhoto, removeKolPhoto } = useKols();
  
  // Set initial preview URL from selectedKol
  useEffect(() => {
    if (selectedKol?.photo_url) {
      setPreviewUrl(selectedKol.photo_url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedKol?.photo_url]);
  
  // Categories for KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];
  
  // Get the first letter of the KOL name or a fallback
  const getNameInitial = () => {
    if (selectedKol && selectedKol.name && typeof selectedKol.name === 'string') {
      return selectedKol.name.charAt(0);
    }
    // Use full_name as a fallback if name is not available
    if (selectedKol && selectedKol.full_name && typeof selectedKol.full_name === 'string') {
      return selectedKol.full_name.charAt(0);
    }
    // Default fallback
    return 'K';
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Photo size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPEG, PNG, GIF, and WebP formats are supported",
        variant: "destructive",
      });
      return;
    }
    
    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    setIsUploading(true);
    try {
      await uploadKolPhoto(selectedKol.id, file);
    } finally {
      setIsUploading(false);
      // Reset the file input for future uploads
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!selectedKol || !selectedKol.photo_url) return;
    
    setIsUploading(true);
    try {
      await removeKolPhoto(selectedKol.id);
      setPreviewUrl(null); // Remove preview immediately
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-semibold mb-1">Profile Photo</h4>
        <p className="text-sm text-gray-500 mb-4">Upload a profile photo for this KOL</p>
        
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage 
                src={previewUrl || selectedKol?.photo_url} 
                alt={selectedKol?.full_name || 'KOL'} 
                className="object-cover"
              />
              <AvatarFallback className="text-5xl font-light text-gray-400">
                {getNameInitial()}
              </AvatarFallback>
            </Avatar>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
            />
            
            {/* Photo Upload Button */}
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute -right-2 -bottom-2 rounded-full p-2 h-auto w-auto bg-white shadow-sm border"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              <Upload size={16} className="text-gray-500" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="text-xs flex items-center gap-1"
            >
              <Upload size={14} />
              Upload Photo
            </Button>
            
            {(previewUrl || selectedKol?.photo_url) && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <Trash2 size={14} />
                Remove
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Upload a square photo of the KOL.<br />Recommended size 500×500px.
          </p>
        </div>
      </div>
      
      <div className="col-span-2 space-y-6">
        <h4 className="font-semibold mb-2">Basic Information</h4>
        <p className="text-sm text-gray-500 mb-4">KOL profile information</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input 
              placeholder="Enter KOL name" 
              defaultValue={selectedKol?.name || selectedKol?.full_name || ''} 
              onChange={(e) => onDataChange('full_name', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed across the platform.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select 
              defaultValue={selectedKol?.category ? selectedKol.category.toLowerCase() : undefined}
              onValueChange={(value) => onDataChange('category', value)}
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
                defaultValue={selectedKol?.followers || selectedKol?.total_followers || 0} 
                onChange={(e) => onDataChange('total_followers', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Combined followers across all platforms.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
              <Input 
                type="number" 
                placeholder="0" 
                defaultValue={selectedKol?.engagement || selectedKol?.engagement_rate || 0} 
                onChange={(e) => onDataChange('engagement_rate', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">Average engagement rate across posts.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="active" 
              defaultChecked={selectedKol?.status === "Active" || selectedKol?.is_active === true} 
              onCheckedChange={(checked) => onDataChange('is_active', checked)}
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active Status
            </label>
            <span className="text-xs text-gray-500 ml-2">
              {selectedKol?.status === "Active" || selectedKol?.is_active === true 
                ? "Active - available for campaigns" 
                : "Inactive - not available for campaigns"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
