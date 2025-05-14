
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import KolGeneralTab from "./kol-tabs/KolGeneralTab";
import KolSocialMediaTab from "./kol-tabs/KolSocialMediaTab";
import KolRatesTab from "./kol-tabs/KolRatesTab";
import KolMetricsTab from "./kol-tabs/KolMetricsTab";

interface KolDetailViewProps {
  kolId: string;
  onBack: () => void;
}

const KolDetailView: React.FC<KolDetailViewProps> = ({ kolId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [kolData, setKolData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchKolDetails = async () => {
      try {
        setLoading(true);
        const { data: kol, error } = await supabase
          .from("data_kol")
          .select("*")
          .eq("id", kolId)
          .single();

        if (error) throw error;
        setKolData(kol);
      } catch (error) {
        console.error("Error fetching KOL details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKolDetails();
    
    // Set up realtime subscription for updates
    const subscription = supabase
      .channel(`kol_detail_${kolId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'data_kol', filter: `id=eq.${kolId}` }, payload => {
        setKolData(payload.new);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [kolId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (!kolData) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button variant="outline" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <p>KOL not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{kolData.full_name}</CardTitle>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <KolGeneralTab kolData={kolData} />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <KolSocialMediaTab kolId={kolId} />
          </TabsContent>

          <TabsContent value="rates" className="mt-6">
            <KolRatesTab kolId={kolId} />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <KolMetricsTab kolId={kolId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KolDetailView;
