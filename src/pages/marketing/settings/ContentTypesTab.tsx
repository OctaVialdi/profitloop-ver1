import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ContentTypesTab() {
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [newContentType, setNewContentType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContentTypes();
  }, []);

  const fetchContentTypes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      setContentTypes(data || []);
    } catch (error: any) {
      console.error("Error fetching content types:", error);
      toast("Error", {
        description: "Failed to load content types",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addContentType = async () => {
    if (!newContentType.trim()) return;
    
    try {
      const { error } = await supabase
        .from("content_types")
        .insert({ name: newContentType.trim() });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content type added successfully",
      });
      
      setNewContentType("");
      fetchContentTypes();
    } catch (error: any) {
      console.error("Error adding content type:", error);
      toast({
        title: "Error",
        description: "Failed to add content type",
        variant: "destructive",
      });
    }
  };

  const deleteContentType = async (id: string) => {
    try {
      const { error } = await supabase
        .from("content_types")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content type deleted successfully",
      });
      
      fetchContentTypes();
    } catch (error: any) {
      console.error("Error deleting content type:", error);
      toast({
        title: "Error",
        description: "Failed to delete content type",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter new content type"
          value={newContentType}
          onChange={(e) => setNewContentType(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={addContentType} disabled={!newContentType.trim() || isLoading}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {contentTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content types defined yet.</p>
          ) : (
            <ul className="space-y-2">
              {contentTypes.map((type) => (
                <li key={type.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{type.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteContentType(type.id)}
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
