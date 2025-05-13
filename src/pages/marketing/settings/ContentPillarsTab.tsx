
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentPillar {
  id: string;
  name: string;
  funnel_stage?: string | null;
}

export function ContentPillarsTab() {
  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [newContentPillar, setNewContentPillar] = useState("");
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<string>("top");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>(["top", "middle", "bottom"]);

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
    if (!newContentPillar.trim()) return;
    
    try {
      const { error } = await supabase
        .from("content_pillars")
        .insert({ 
          name: newContentPillar.trim(),
          funnel_stage: selectedFunnelStage 
        });
      
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

  const updatePillarFunnelStage = async (id: string, funnelStage: string) => {
    try {
      const { error } = await supabase
        .from("content_pillars")
        .update({ funnel_stage: funnelStage })
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Content pillar updated successfully",
      });
      
      fetchContentPillars();
    } catch (error: any) {
      console.error("Error updating content pillar:", error);
      toast({
        title: "Error",
        description: "Failed to update content pillar",
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

  const toggleAccordion = (value: string) => {
    setExpandedAccordions(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const getFilteredPillars = (stage: string) => {
    return contentPillars.filter(pillar => pillar.funnel_stage === stage || 
      (stage === "top" && !pillar.funnel_stage)); // Default to top funnel if not set
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
        <Select 
          value={selectedFunnelStage} 
          onValueChange={setSelectedFunnelStage}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select funnel stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top Funnel</SelectItem>
            <SelectItem value="middle">Middle Funnel</SelectItem>
            <SelectItem value="bottom">Bottom Funnel</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={addContentPillar} 
          disabled={!newContentPillar.trim() || isLoading}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {contentPillars.length === 0 ? (
            <p className="text-sm text-muted-foreground">No content pillars defined yet.</p>
          ) : (
            <Accordion 
              type="multiple" 
              value={expandedAccordions}
              className="w-full"
            >
              <AccordionItem value="top">
                <AccordionTrigger 
                  onClick={() => toggleAccordion("top")}
                  className="hover:bg-gray-50 px-4 font-medium"
                >
                  Top Funnel (Awareness)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-2">
                    {getFilteredPillars("top").length === 0 ? (
                      <p className="text-sm text-muted-foreground pl-4 py-2">No content pillars in this stage.</p>
                    ) : (
                      getFilteredPillars("top").map((pillar) => (
                        <div key={pillar.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="pl-2">{pillar.name}</span>
                          <div className="flex items-center">
                            <Select 
                              value={pillar.funnel_stage || "top"} 
                              onValueChange={(value) => updatePillarFunnelStage(pillar.id, value)}
                            >
                              <SelectTrigger className="w-[150px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top Funnel</SelectItem>
                                <SelectItem value="middle">Middle Funnel</SelectItem>
                                <SelectItem value="bottom">Bottom Funnel</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteContentPillar(pillar.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="middle">
                <AccordionTrigger 
                  onClick={() => toggleAccordion("middle")}
                  className="hover:bg-gray-50 px-4 font-medium"
                >
                  Middle Funnel (Consideration)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-2">
                    {getFilteredPillars("middle").length === 0 ? (
                      <p className="text-sm text-muted-foreground pl-4 py-2">No content pillars in this stage.</p>
                    ) : (
                      getFilteredPillars("middle").map((pillar) => (
                        <div key={pillar.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="pl-2">{pillar.name}</span>
                          <div className="flex items-center">
                            <Select 
                              value={pillar.funnel_stage || "top"} 
                              onValueChange={(value) => updatePillarFunnelStage(pillar.id, value)}
                            >
                              <SelectTrigger className="w-[150px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top Funnel</SelectItem>
                                <SelectItem value="middle">Middle Funnel</SelectItem>
                                <SelectItem value="bottom">Bottom Funnel</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteContentPillar(pillar.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="bottom">
                <AccordionTrigger 
                  onClick={() => toggleAccordion("bottom")}
                  className="hover:bg-gray-50 px-4 font-medium"
                >
                  Bottom Funnel (Decision)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-2">
                    {getFilteredPillars("bottom").length === 0 ? (
                      <p className="text-sm text-muted-foreground pl-4 py-2">No content pillars in this stage.</p>
                    ) : (
                      getFilteredPillars("bottom").map((pillar) => (
                        <div key={pillar.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="pl-2">{pillar.name}</span>
                          <div className="flex items-center">
                            <Select 
                              value={pillar.funnel_stage || "top"} 
                              onValueChange={(value) => updatePillarFunnelStage(pillar.id, value)}
                            >
                              <SelectTrigger className="w-[150px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top">Top Funnel</SelectItem>
                                <SelectItem value="middle">Middle Funnel</SelectItem>
                                <SelectItem value="bottom">Bottom Funnel</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteContentPillar(pillar.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
