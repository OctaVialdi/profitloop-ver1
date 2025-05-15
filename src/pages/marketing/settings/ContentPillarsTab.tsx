import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ContentPillarsTab() {
  const [contentPillars, setContentPillars] = useState<any[]>([]);
  const [newContentPillar, setNewContentPillar] = useState("");
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
      toast("Error", {
        description: "Failed to load content pillars",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addContentPillar = async () => {
    if (!newContentPillar.trim()) return;
    
    try {
      const { error } = await supabase
        .from("content_pillars")
        .insert({ name: newContentPillar.trim() });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content pillar added successfully",
      });
      
      setNewContentPillar("");
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter new content pillar"
          value={newContentPillar}
          onChange={(e) => setNewContentPillar(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={addContentPillar} disabled={!newContentPillar.trim() || isLoading}>
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
                  <span>{pillar.name}</span>
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
