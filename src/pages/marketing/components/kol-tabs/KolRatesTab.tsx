
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface KolRatesTabProps {
  kolId: string;
}

interface Rate {
  id: string;
  platform: string;
  min_rate: number;
  max_rate: number;
  currency: string;
}

const KolRatesTab: React.FC<KolRatesTabProps> = ({ kolId }) => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("kol_rates")
          .select("*")
          .eq("kol_id", kolId)
          .order("platform");

        if (error) throw error;
        setRates(data || []);
      } catch (error) {
        console.error("Error fetching rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel(`kol_rates_${kolId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kol_rates', filter: `kol_id=eq.${kolId}` }, () => {
        fetchRates();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [kolId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Rate Cards</h3>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-1" /> Add Rate Card
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : rates.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No rate cards added yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-2 text-left">Platform</th>
                <th className="px-4 py-2 text-left">Min Rate</th>
                <th className="px-4 py-2 text-left">Max Rate</th>
                <th className="px-4 py-2 text-left">Currency</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">{rate.platform}</td>
                  <td className="px-4 py-3">{rate.min_rate?.toLocaleString()}</td>
                  <td className="px-4 py-3">{rate.max_rate?.toLocaleString()}</td>
                  <td className="px-4 py-3">{rate.currency}</td>
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

export default KolRatesTab;
