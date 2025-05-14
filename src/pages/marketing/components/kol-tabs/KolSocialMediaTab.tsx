
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, ExternalLink, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KolSocialMediaTabProps {
  selectedKol: any;
  formatNumber: (num: number) => string;
}

export const KolSocialMediaTab: React.FC<KolSocialMediaTabProps> = ({ selectedKol, formatNumber }) => {
  const [socialAccounts, setSocialAccounts] = useState(selectedKol?.kol_social_media || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    platform: "",
    handle: "",
    profile_url: "",
    followers: 0,
    engagement_rate: 0
  });
  
  // Open dialog for adding new platform
  const openAddDialog = () => {
    setFormData({
      platform: "",
      handle: "",
      profile_url: "",
      followers: 0,
      engagement_rate: 0
    });
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
  };
  
  // Open dialog for editing platform
  const openEditDialog = (account: any) => {
    setFormData({
      platform: account.platform,
      handle: account.handle,
      profile_url: account.profile_url,
      followers: account.followers,
      engagement_rate: account.engagement_rate
    });
    setIsEditing(true);
    setEditingId(account.id);
    setIsDialogOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "followers" || name === "engagement_rate" ? parseFloat(value) : value 
    }));
  };
  
  // Save social media account
  const handleSaveSocialMedia = async () => {
    try {
      if (isEditing) {
        // Update existing account
        const { error } = await supabase
          .from('kol_social_media')
          .update({
            platform: formData.platform,
            handle: formData.handle,
            profile_url: formData.profile_url,
            followers: formData.followers,
            engagement_rate: formData.engagement_rate,
          })
          .eq('id', editingId);
          
        if (error) throw error;
        
        // Update local state
        setSocialAccounts(prev => prev.map(acc => 
          acc.id === editingId ? { ...acc, ...formData } : acc
        ));
        
        toast.success('Platform updated successfully');
      } else {
        // Add new account
        const { data, error } = await supabase
          .from('kol_social_media')
          .insert({
            kol_id: selectedKol.id,
            platform: formData.platform,
            handle: formData.handle,
            profile_url: formData.profile_url,
            followers: formData.followers,
            engagement_rate: formData.engagement_rate,
          })
          .select();
          
        if (error) throw error;
        
        // Update local state
        setSocialAccounts(prev => [...prev, data[0]]);
        
        toast.success('Platform added successfully');
      }
      
      // Update total followers on the KOL record
      const totalFollowers = socialAccounts.reduce((sum, acc) => sum + (acc.followers || 0), 0);
      const { error: updateError } = await supabase
        .from('data_kol')
        .update({
          total_followers: totalFollowers
        })
        .eq('id', selectedKol.id);
        
      if (updateError) console.error('Error updating total followers:', updateError);
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving social media:', error);
      toast.error('Failed to save platform');
    }
  };
  
  // Delete social media account
  const handleDeleteSocialMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('kol_social_media')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setSocialAccounts(prev => prev.filter(acc => acc.id !== id));
      
      toast.success('Platform deleted successfully');
    } catch (error) {
      console.error('Error deleting social media:', error);
      toast.error('Failed to delete platform');
    }
  };
  
  // Calculate platform icon based on platform name
  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    
    if (platformLower.includes('instagram')) return 'instagram.svg';
    if (platformLower.includes('facebook')) return 'facebook.svg';
    if (platformLower.includes('twitter') || platformLower.includes('x')) return 'twitter.svg';
    if (platformLower.includes('tiktok')) return 'tiktok.svg';
    if (platformLower.includes('youtube')) return 'youtube.svg';
    if (platformLower.includes('linkedin')) return 'linkedin.svg';
    
    return 'globe.svg';
  };
  
  return (
    <div className="space-y-6">
      {/* Social Media Accounts */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Social Media Accounts</h3>
            <Button 
              onClick={openAddDialog}
              variant="outline" 
              className="flex items-center gap-1"
            >
              <PlusCircle size={16} />
              <span>Add Platform</span>
            </Button>
          </div>
          
          {socialAccounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
              <p>No social media accounts added yet</p>
              <Button 
                onClick={openAddDialog} 
                variant="link" 
                className="mt-2 text-blue-600"
              >
                Add your first platform
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {socialAccounts.map((account) => (
                <div key={account.id} className="border rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center mr-4">
                      <img 
                        src={`/icons/${getPlatformIcon(account.platform)}`} 
                        alt={account.platform} 
                        className="h-5 w-5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/icons/globe.svg';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{account.platform}</h4>
                      <p className="text-sm text-gray-600">@{account.handle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right mr-6">
                      <span className="block text-gray-500 text-sm">Followers</span>
                      <span className="font-medium">{formatNumber(account.followers)}</span>
                    </div>
                    <div className="text-right mr-6">
                      <span className="block text-gray-500 text-sm">Engagement</span>
                      <span className="font-medium">{account.engagement_rate}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => window.open(account.profile_url, '_blank')}
                      >
                        <ExternalLink size={16} className="text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(account)}
                      >
                        <Edit size={16} className="text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteSocialMedia(account.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Social Media Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Social Media Account' : 'Add Social Media Account'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details of this social media account' 
                : 'Add a new social media platform for this KOL'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input 
                id="platform" 
                name="platform"
                value={formData.platform} 
                onChange={handleInputChange}
                placeholder="e.g. Instagram, TikTok, YouTube" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="handle">Account Handle</Label>
              <Input 
                id="handle" 
                name="handle"
                value={formData.handle} 
                onChange={handleInputChange}
                placeholder="e.g. username (without @)" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile_url">Profile URL</Label>
              <Input 
                id="profile_url" 
                name="profile_url"
                value={formData.profile_url} 
                onChange={handleInputChange}
                placeholder="https://..." 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="followers">Followers</Label>
                <Input 
                  id="followers" 
                  name="followers"
                  type="number"
                  value={formData.followers} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="engagement_rate">Engagement Rate (%)</Label>
                <Input 
                  id="engagement_rate" 
                  name="engagement_rate"
                  type="number"
                  value={formData.engagement_rate} 
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSocialMedia}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Add'} Platform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
