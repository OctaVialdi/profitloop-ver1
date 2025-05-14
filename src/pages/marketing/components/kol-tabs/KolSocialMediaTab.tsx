
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Kol, KolSocialMedia } from "@/hooks/useKols";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface KolSocialMediaTabProps {
  selectedKol: Kol;
  formatNumber: (num: number) => string;
  socialMedia: KolSocialMedia[];
  onAddSocialMedia: (socialMedia: Omit<KolSocialMedia, 'id' | 'created_at' | 'updated_at'>) => Promise<KolSocialMedia[] | null>;
  onUpdateSocialMedia: (id: string, updates: Partial<KolSocialMedia>) => Promise<KolSocialMedia[] | null>;
  onDeleteSocialMedia: (id: string, kolId: string) => Promise<boolean>;
}

export const KolSocialMediaTab: React.FC<KolSocialMediaTabProps> = ({
  selectedKol,
  formatNumber,
  socialMedia,
  onAddSocialMedia,
  onUpdateSocialMedia,
  onDeleteSocialMedia
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<KolSocialMedia | null>(null);
  
  const [newSocialMedia, setNewSocialMedia] = useState<Omit<KolSocialMedia, 'id' | 'created_at' | 'updated_at'>>({
    kol_id: selectedKol.id,
    platform: '',
    username: '',
    profile_url: '',
    followers: 0,
    engagement_rate: 0
  });
  
  const [editSocialMedia, setEditSocialMedia] = useState<Partial<KolSocialMedia>>({});
  
  const platformOptions = [
    "Instagram", "TikTok", "YouTube", "Facebook", "Twitter", "LinkedIn"
  ];
  
  const handleInputChange = (field: string, value: string | number) => {
    setNewSocialMedia(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleEditInputChange = (field: string, value: string | number) => {
    setEditSocialMedia(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAddSocialMedia = async () => {
    await onAddSocialMedia(newSocialMedia);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewSocialMedia({
      kol_id: selectedKol.id,
      platform: '',
      username: '',
      profile_url: '',
      followers: 0,
      engagement_rate: 0
    });
  };
  
  const handleEditSocialMedia = async () => {
    if (!selectedSocialMedia) return;
    
    await onUpdateSocialMedia(selectedSocialMedia.id, editSocialMedia);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteSocialMedia = async () => {
    if (!selectedSocialMedia) return;
    
    await onDeleteSocialMedia(selectedSocialMedia.id, selectedSocialMedia.kol_id);
    setIsDeleteDialogOpen(false);
  };
  
  const openEditDialog = (socialMedia: KolSocialMedia) => {
    setSelectedSocialMedia(socialMedia);
    setEditSocialMedia({
      platform: socialMedia.platform,
      username: socialMedia.username,
      profile_url: socialMedia.profile_url,
      followers: socialMedia.followers,
      engagement_rate: socialMedia.engagement_rate
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (socialMedia: KolSocialMedia) => {
    setSelectedSocialMedia(socialMedia);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-semibold">Social Media Platforms</h4>
          <p className="text-sm text-gray-500">Manage KOL's social media accounts and metrics</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={16} className="mr-2" /> Add Platform
        </Button>
      </div>
      
      {socialMedia.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialMedia.map(sm => (
            <Card key={sm.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-md text-purple-700 mr-3">
                      {sm.platform === "Instagram" && "IG"}
                      {sm.platform === "TikTok" && "TT"}
                      {sm.platform === "YouTube" && "YT"}
                      {sm.platform === "Facebook" && "FB"}
                      {sm.platform === "Twitter" && "TW"}
                      {sm.platform === "LinkedIn" && "LI"}
                    </div>
                    <div>
                      <h5 className="font-medium">{sm.platform}</h5>
                      <p className="text-sm text-gray-500">@{sm.username}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(sm)}>
                        <Edit size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => openDeleteDialog(sm)}
                      >
                        <Trash2 size={14} className="mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="px-4 py-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Followers</p>
                      <p className="font-medium">{formatNumber(sm.followers)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Engagement</p>
                      <p className="font-medium">{sm.engagement_rate}%</p>
                    </div>
                  </div>
                </div>
                
                {sm.profile_url && (
                  <div className="px-4 pb-3">
                    <a 
                      href={sm.profile_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {sm.profile_url}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">No social media accounts added yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add a platform using the button above.</p>
        </div>
      )}
      
      {/* Add Social Media Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social Media Platform</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <label className="text-sm font-medium">Platform</label>
              <Select 
                value={newSocialMedia.platform} 
                onValueChange={(value) => handleInputChange('platform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid items-center gap-4">
              <label className="text-sm font-medium">Username</label>
              <Input 
                placeholder="e.g., username" 
                value={newSocialMedia.username} 
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
            
            <div className="grid items-center gap-4">
              <label className="text-sm font-medium">Profile URL</label>
              <Input 
                placeholder="https://..." 
                value={newSocialMedia.profile_url} 
                onChange={(e) => handleInputChange('profile_url', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Followers</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={newSocialMedia.followers || ''} 
                  onChange={(e) => handleInputChange('followers', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Engagement Rate (%)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={newSocialMedia.engagement_rate || ''} 
                  onChange={(e) => handleInputChange('engagement_rate', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddSocialMedia}
              disabled={!newSocialMedia.platform || !newSocialMedia.username}
            >
              Add Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Social Media Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Media Platform</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <label className="text-sm font-medium">Platform</label>
              <Select 
                value={editSocialMedia.platform as string} 
                onValueChange={(value) => handleEditInputChange('platform', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid items-center gap-4">
              <label className="text-sm font-medium">Username</label>
              <Input 
                placeholder="e.g., username" 
                value={editSocialMedia.username || ''} 
                onChange={(e) => handleEditInputChange('username', e.target.value)}
              />
            </div>
            
            <div className="grid items-center gap-4">
              <label className="text-sm font-medium">Profile URL</label>
              <Input 
                placeholder="https://..." 
                value={editSocialMedia.profile_url || ''} 
                onChange={(e) => handleEditInputChange('profile_url', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Followers</label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  value={editSocialMedia.followers || ''} 
                  onChange={(e) => handleEditInputChange('followers', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Engagement Rate (%)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={editSocialMedia.engagement_rate || ''} 
                  onChange={(e) => handleEditInputChange('engagement_rate', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditSocialMedia}
              disabled={!editSocialMedia.platform || !editSocialMedia.username}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Media Account</DialogTitle>
          </DialogHeader>
          
          <p className="py-4">
            Are you sure you want to delete this {selectedSocialMedia?.platform} account? This action cannot be undone.
          </p>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSocialMedia}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
