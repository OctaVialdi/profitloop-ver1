
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Kol } from "@/hooks/useKols";

// Import our tab components
import { KolGeneralTab } from "./kol-tabs/KolGeneralTab";
import { KolSocialMediaTab } from "./kol-tabs/KolSocialMediaTab";
import { KolRatesTab } from "./kol-tabs/KolRatesTab";
import { KolMetricsTab } from "./kol-tabs/KolMetricsTab";
import { useKols } from "@/hooks/useKols";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KolDetailViewProps {
  selectedKol: Kol | null;
  setCurrentView: (view: string) => void;
  formatNumber: (num: number) => string;
  onUpdate: (id: string, updates: Partial<Kol>) => Promise<Kol | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export const KolDetailView: React.FC<KolDetailViewProps> = ({ 
  selectedKol, 
  setCurrentView, 
  formatNumber,
  onUpdate,
  onDelete
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { 
    fetchSocialMedia, 
    fetchRates, 
    fetchMetrics, 
    socialMedia, 
    rates, 
    metrics,
    addSocialMedia,
    updateSocialMedia,
    deleteSocialMedia,
    addRate,
    updateRate,
    deleteRate,
    addOrUpdateMetrics
  } = useKols();
  
  useEffect(() => {
    if (selectedKol) {
      fetchSocialMedia(selectedKol.id);
      fetchRates(selectedKol.id);
      fetchMetrics(selectedKol.id);
    }
  }, [selectedKol]);
  
  const handleStatusToggle = async () => {
    if (!selectedKol) return;
    
    const newStatus = selectedKol.status === "Active" ? "Inactive" : "Active";
    const result = await onUpdate(selectedKol.id, { status: newStatus });
    
    if (result) {
      toast({
        title: "Status Updated",
        description: `KOL status changed to ${newStatus}`,
      });
    }
  };
  
  const handleDeleteKol = async () => {
    if (!selectedKol) return;
    
    setIsDeleting(true);
    const success = await onDelete(selectedKol.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
      setCurrentView("list");
    }
    
    setIsDeleting(false);
  };
  
  if (!selectedKol) return null;
  
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-transparent p-0"
              onClick={() => setCurrentView("list")}
            >
              <ArrowLeftCircle size={20} className="mr-2 text-gray-500" />
            </Button>
            Edit KOL: {selectedKol.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Update KOL
          </Button>
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-100/50 rounded-md">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">General</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-white">Social Media</TabsTrigger>
          <TabsTrigger value="rates" className="data-[state=active]:bg-white">Rates</TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white">Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <KolGeneralTab 
            selectedKol={selectedKol} 
            formatNumber={formatNumber} 
            onUpdate={onUpdate}
            onStatusToggle={handleStatusToggle}
          />
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          <KolSocialMediaTab 
            selectedKol={selectedKol} 
            formatNumber={formatNumber}
            socialMedia={socialMedia.filter(sm => sm.kol_id === selectedKol.id)} 
            onAddSocialMedia={addSocialMedia}
            onUpdateSocialMedia={updateSocialMedia}
            onDeleteSocialMedia={deleteSocialMedia}
          />
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          <KolRatesTab 
            selectedKol={selectedKol}
            rates={rates.filter(r => r.kol_id === selectedKol.id)}
            onAddRate={addRate}
            onUpdateRate={updateRate}
            onDeleteRate={deleteRate}
          />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <KolMetricsTab 
            selectedKol={selectedKol}
            metrics={metrics.find(m => m.kol_id === selectedKol.id)}
            onSaveMetrics={addOrUpdateMetrics}
          />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete KOL</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedKol.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)} 
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteKol} 
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
