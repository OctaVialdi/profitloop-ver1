
import React, { useState, useEffect } from "react";
import { KolList } from "./KolList";
import { KolDetailView } from "./KolDetailView";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

const KolManagement = () => {
  const [kols, setKols] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list"); // "list" or "detail"
  const [selectedKol, setSelectedKol] = useState(null);
  const { user } = useUser();

  // Fetch KOLs when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchKols();
      
      // Subscribe to real-time updates
      const channel = supabase
        .channel('kol-changes')
        .on('postgres_changes', 
          {
            event: '*', 
            schema: 'public',
            table: 'data_kol'
          }, 
          (payload) => {
            fetchKols();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Fetch all KOLs for the organization
  const fetchKols = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('data_kol')
        .select(`
          *,
          kol_social_media(*),
          kol_rates(*)
        `);
        
      if (error) throw error;
      
      setKols(data || []);
    } catch (error) {
      console.error('Error fetching KOLs:', error);
      toast.error('Failed to load KOLs');
    } finally {
      setLoading(false);
    }
  };

  // Filter kols based on search query
  const filteredKols = kols.filter(kol => 
    kol.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kol.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Score badge color based on value
  const getScoreBadgeColor = (score) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Status badge color based on value
  const getStatusBadgeColor = (status) => {
    if (status === 'Active') return "bg-green-100 text-green-800";
    if (status === 'Pending') return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  // Format large numbers with K, M suffixes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  // Handle KOL selection
  const handleKolSelect = (kol) => {
    setSelectedKol(kol);
    setCurrentView("detail");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">KOL Management</h2>
      
      {currentView === "list" ? (
        <KolList 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredKols={filteredKols}
          handleKolSelect={handleKolSelect}
          formatNumber={formatNumber}
          getScoreBadgeColor={getScoreBadgeColor}
          getStatusBadgeColor={getStatusBadgeColor}
        />
      ) : (
        <KolDetailView 
          selectedKol={selectedKol}
          setCurrentView={setCurrentView}
          formatNumber={formatNumber}
        />
      )}
    </div>
  );
};

export default KolManagement;
