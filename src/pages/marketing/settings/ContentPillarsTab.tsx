
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ContentPillarsTab() {
  const [contentPillars, setContentPillars] = useState<any[]>([]);
  const [newPillarName, setNewPillarName] = useState("");
  const [newPillarFunneling, setNewPillarFunneling] = useState("awareness");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContentPillars();
  }, []);

  const fetchContentPillars = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_pillars")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setContentPillars(data || []);
    } catch (error: any) {
      console.error("Error fetching content pillars:", error);
      toast({
        title: "Error",
        description: "Failed to load content pillars",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addContentPillar = async () => {
    if (!newPillarName.trim()) return;
    
    try {
      const { error } = await supabase
        .from("content_pillars")
        .insert({ 
          name: newPillarName.trim(),
          funneling: newPillarFunneling
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content pillar added successfully",
      });
      
      setNewPillarName("");
      setNewPillarFunneling("awareness");
      fetchContentPillars();
    } catch (error: any) {
      console.error("Error adding content pillar:", error);
      toast({
        title: "Error",
        description: "Failed to add content pillar",
        variant: "destructive",
      });
    }
  };

  const deleteContentPillar = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_pillars")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content pillar deleted successfully",
      });
      
      fetchContentPillars();
    } catch (error: any) {
      console.error("Error deleting content pillar:", error);
      toast({
        title: "Error",
        description: "Failed to delete content pillar",
        variant: "destructive",
      });
    }
  };

  const funnelingOptions = [
    { value: "awareness", label: "Awareness" },
    { value: "consideration", label: "Consideration" },
    { value: "decision", label: "Decision" },
    { value: "retention", label: "Retention" }
  ];

  const getFunnelingLabel = (value: string) => {
    return funnelingOptions.find(option => option.value === value)?.label || value;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter new content pillar"
            value={newPillarName}
            onChange={(e) => setNewPillarName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={newPillarFunneling}
            onValueChange={setNewPillarFunneling}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select funnel stage" />
            </SelectTrigger>
            <SelectContent>
              {funnelingOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addContentPillar} disabled={!newPillarName.trim() || isLoading}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {contentPillars.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content pillars defined yet.</p>
          ) : (
            <ul className="space-y-2">
              {contentPillars.map((pillar) => (
                <li key={pillar.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span>{pillar.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                      {getFunnelingLabel(pillar.funneling || "awareness")}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteContentPillar(pillar.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
