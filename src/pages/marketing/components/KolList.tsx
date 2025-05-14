
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface KolListProps {
  onKolSelect: (kolId: string) => void;
}

interface Kol {
  id: string;
  full_name: string;
  category: string;
  total_followers: number;
  engagement_rate: number;
  photo_url: string | null;
  is_active: boolean;
}

const KolList: React.FC<KolListProps> = ({ onKolSelect }) => {
  const [kols, setKols] = useState<Kol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchKols = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("data_kol")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setKols(data || []);
      } catch (error) {
        console.error("Error fetching KOLs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKols();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('public:data_kol')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'data_kol' }, (payload) => {
        fetchKols();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredKols = kols.filter(kol => 
    kol.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kol.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Search KOLs..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline">Add New KOL</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredKols.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No KOLs found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Followers</th>
                <th className="px-4 py-2 text-left">Engagement</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredKols.map((kol) => (
                <tr key={kol.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted/50 overflow-hidden">
                        {kol.photo_url && (
                          <img src={kol.photo_url} alt={kol.full_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span>{kol.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{kol.category}</td>
                  <td className="px-4 py-3">{kol.total_followers?.toLocaleString()}</td>
                  <td className="px-4 py-3">{kol.engagement_rate?.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${kol.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {kol.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => onKolSelect(kol.id)}>
                      View
                    </Button>
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

export default KolList;
