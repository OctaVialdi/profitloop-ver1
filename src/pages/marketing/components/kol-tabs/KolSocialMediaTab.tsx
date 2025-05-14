
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface KolSocialMediaTabProps {
  kolId: string;
}

interface SocialMedia {
  id: string;
  platform: string;
  handle: string;
  profile_url: string;
  followers: number;
  engagement_rate: number;
}

const KolSocialMediaTab: React.FC<KolSocialMediaTabProps> = ({ kolId }) => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("kol_social_media")
          .select("*")
          .eq("kol_id", kolId)
          .order("platform");

        if (error) throw error;
        setSocialMedia(data || []);
      } catch (error) {
        console.error("Error fetching social media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel(`kol_social_media_${kolId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kol_social_media', filter: `kol_id=eq.${kolId}` }, () => {
        fetchSocialMedia();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [kolId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Social Media Platforms</h3>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-1" /> Add Platform
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : socialMedia.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No social media platforms added yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left">Platform</th>
                <th className="px-4 py-2 text-left">Handle</th>
                <th className="px-4 py-2 text-left">Profile URL</th>
                <th className="px-4 py-2 text-left">Followers</th>
                <th className="px-4 py-2 text-left">Engagement</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {socialMedia.map((platform) => (
                <tr key={platform.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">{platform.platform}</td>
                  <td className="px-4 py-3">{platform.handle}</td>
                  <td className="px-4 py-3">
                    <a href={platform.profile_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {platform.profile_url}
                    </a>
                  </td>
                  <td className="px-4 py-3">{platform.followers?.toLocaleString()}</td>
                  <td className="px-4 py-3">{platform.engagement_rate?.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KolSocialMediaTab;
