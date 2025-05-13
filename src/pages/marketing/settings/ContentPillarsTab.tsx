
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
  const [newName, setNewName] = useState("");
  const [funnelStage, setFunnelStage] = useState("top");
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
    if (!newName.trim()) return;
    
    try {
      const { error } = await supabase
        .from("content_pillars")
        .insert({ name: newName.trim(), funnel_stage: funnelStage });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content pillar added successfully",
      });
      
      setNewName("");
      setFunnelStage("top");
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

  const getFunnelStageLabel = (stage: string) => {
    switch(stage) {
      case "top": return "Top of Funnel";
      case "middle": return "Middle of Funnel";
      case "bottom": return "Bottom of Funnel";
      default: return stage;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter content pillar name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1"
        />
        <Select
          value={funnelStage}
          onValueChange={setFunnelStage}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select funnel stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top of Funnel</SelectItem>
            <SelectItem value="middle">Middle of Funnel</SelectItem>
            <SelectItem value="bottom">Bottom of Funnel</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addContentPillar} disabled={!newName.trim() || isLoading}>
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
                  <div>
                    <span>{pillar.name}</span>
                    {pillar.funnel_stage && (
                      <span className="text-xs text-gray-500 ml-2">
                        {getFunnelStageLabel(pillar.funnel_stage)}
                      </span>
                    )}
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
