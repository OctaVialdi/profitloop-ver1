
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Kol, KolSocialMedia } from "@/hooks/useKols";
import { MoreHorizontal, Trash2, Edit, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface KolSocialMediaTabProps {
  selectedKol: Kol;
  socialMedia: KolSocialMedia[];
  formatNumber: (num: number) => string;
  onAddSocialMedia: (socialMedia: Omit<KolSocialMedia, 'id' | 'created_at' | 'updated_at'>) => Promise<KolSocialMedia[] | null>;
  onUpdateSocialMedia: (id: string, updates: Partial<KolSocialMedia>) => Promise<KolSocialMedia[] | null>;
  onDeleteSocialMedia: (id: string, kolId: string) => Promise<boolean>;
}

export const KolSocialMediaTab: React.FC<KolSocialMediaTabProps> = ({ 
  selectedKol, 
  socialMedia, 
  formatNumber,
  onAddSocialMedia,
  onUpdateSocialMedia,
  onDeleteSocialMedia
}) => {
  const [newPlatform, setNewPlatform] = useState({
    platform: "",
    username: "",
    profile_url: "",
    followers: 0,
    engagement_rate: 0
  });
  const [editPlatform, setEditPlatform] = useState<KolSocialMedia | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<KolSocialMedia>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [platformToDelete, setPlatformToDelete] = useState<KolSocialMedia | null>(null);
  
  const platformOptions = [
    "Instagram", "TikTok", "YouTube", "Facebook", "Twitter", "LinkedIn", "Pinterest", "Snapchat"
  ];
  
  const handleInputChange = (field: string, value: string | number) => {
    setNewPlatform({
      ...newPlatform,
      [field]: value
    });
  };
  
  const handleEditInputChange = (field: string, value: string | number) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };
  
  const handleAddPlatform = async () => {
    await onAddSocialMedia({
      ...newPlatform,
      kol_id: selectedKol.id
    });
    
    // Reset form
    setNewPlatform({
      platform: "",
      username: "",
      profile_url: "",
      followers: 0,
      engagement_rate: 0
    });
  };
  
  const handleOpenEdit = (platform: KolSocialMedia) => {
    setEditPlatform(platform);
    setEditFormData({
      platform: platform.platform,
      username: platform.username,
      profile_url: platform.profile_url,
      followers: platform.followers,
      engagement_rate: platform.engagement_rate
    });
  };
  
  const handleSaveEdit = async () => {
    if (!editPlatform) return;
    
    await onUpdateSocialMedia(editPlatform.id, editFormData);
    setEditPlatform(null);
  };
  
  const handleOpenDelete = (platform: KolSocialMedia) => {
    setPlatformToDelete(platform);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!platformToDelete) return;
    
    await onDeleteSocialMedia(platformToDelete.id, platformToDelete.kol_id);
    setIsDeleteDialogOpen(false);
    setPlatformToDelete(null);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="text-purple-700" size={20} />;
      case 'facebook':
        return <Facebook className="text-blue-700" size={20} />;
      case 'youtube':
        return <Youtube className="text-red-700" size={20} />;
      case 'twitter':
        return <Twitter className="text-sky-500" size={20} />;
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700">
            <path d="M9 12 11 14 15 10"/>
            <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z"/>
          </svg>
        );
    }
  };

  const isFormValid = newPlatform.platform && newPlatform.username;
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-1">Social Media Platforms</h4>
        <p className="text-sm text-gray-500 mb-6">Manage the KOL's social media platforms and performance metrics</p>
      </div>
      
      <div className="border rounded-md p-6">
        <h5 className="font-medium mb-4">Add New Platform</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <Select value={newPlatform.platform} onValueChange={(value) => handleInputChange('platform', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map(platform => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Handle/Username</label>
            <Input 
              placeholder="@username" 
              value={newPlatform.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile URL</label>
            <Input 
              placeholder="https://" 
              value={newPlatform.profile_url}
              onChange={(e) => handleInputChange('profile_url', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Followers</label>
            <Input 
              type="number" 
              placeholder="Number of followers" 
              value={newPlatform.followers || ''}
              onChange={(e) => handleInputChange('followers', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
            <Input 
              type="number" 
              placeholder="Average engagement rate" 
              value={newPlatform.engagement_rate || ''}
              onChange={(e) => handleInputChange('engagement_rate', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          onClick={handleAddPlatform}
          disabled={!isFormValid}
        >
          Add Platform
        </Button>
      </div>
      
      <div className="border rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="font-medium">Platforms</h5>
            <p className="text-sm text-gray-500">Connected social media accounts</p>
          </div>
        </div>
        
        {socialMedia.length > 0 ? (
          socialMedia.map((platform) => (
            <div key={platform.id} className="border-b py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-md">
                  {getPlatformIcon(platform.platform)}
                </div>
                <div>
                  <div className="font-medium">{platform.platform}</div>
                  <div className="text-sm text-gray-500">@{platform.username}</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {formatNumber(platform.followers || 0)} followers
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {platform.engagement_rate || 0}% engagement
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-500 p-2 h-auto">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenEdit(platform)}>
                      <Edit size={16} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600" 
                      onClick={() => handleOpenDelete(platform)}
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center flex-col py-12">
            <p className="text-gray-500 mb-1">No social media platforms connected yet</p>
            <p className="text-xs text-gray-400">Add platforms using the form above</p>
          </div>
        )}
      </div>
      
      {/* Edit Platform Dialog */}
      <Dialog open={!!editPlatform} onOpenChange={(open) => !open && setEditPlatform(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Platform</label>
              <div className="col-span-3">
                <Select 
                  value={editFormData.platform as string} 
                  onValueChange={(value) => handleEditInputChange('platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(platform => (
                      <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Username</label>
              <div className="col-span-3">
                <Input 
                  value={editFormData.username || ''} 
                  onChange={(e) => handleEditInputChange('username', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Profile URL</label>
              <div className="col-span-3">
                <Input 
                  value={editFormData.profile_url || ''} 
                  onChange={(e) => handleEditInputChange('profile_url', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Followers</label>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  value={editFormData.followers || ''} 
                  onChange={(e) => handleEditInputChange('followers', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Engagement Rate (%)</label>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  value={editFormData.engagement_rate || ''} 
                  onChange={(e) => handleEditInputChange('engagement_rate', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlatform(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Media Platform</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this platform? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
