
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useKols } from "@/hooks/useKols";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Import our tab components
import { KolGeneralTab } from "./kol-tabs/KolGeneralTab";
import { KolSocialMediaTab } from "./kol-tabs/KolSocialMediaTab";
import { KolRatesTab } from "./kol-tabs/KolRatesTab";
import { KolMetricsTab } from "./kol-tabs/KolMetricsTab";

interface KolDetailViewProps {
  selectedKol: any;
  setCurrentView: (view: string) => void;
  formatNumber: (num: number) => string;
}

export const KolDetailView: React.FC<KolDetailViewProps> = ({ 
  selectedKol, 
  setCurrentView, 
  formatNumber 
}) => {
  const [updatedData, setUpdatedData] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { updateKol, deleteKol, isUpdating, isDeleting } = useKols();
  
  if (!selectedKol) return null;
  
  const handleDataChange = (field: string, value: any) => {
    setUpdatedData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleUpdate = async () => {
    if (Object.keys(updatedData).length === 0) {
      toast({
        description: "No changes detected",
      });
      return;
    }
    
    try {
      await updateKol(selectedKol.id, updatedData);
      // After successful update, go back to list view
      setCurrentView("list");
    } catch (error) {
      console.error("Error updating KOL:", error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const success = await deleteKol(selectedKol.id);
      if (success) {
        setCurrentView("list");
      }
    } catch (error) {
      console.error("Error deleting KOL:", error);
    }
  };
  
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
            Edit KOL: {selectedKol.full_name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Manage KOL details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleUpdate}
            disabled={isUpdating || Object.keys(updatedData).length === 0}
          >
            {isUpdating ? "Updating..." : "Update KOL"}
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
            onDataChange={handleDataChange}
          />
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          <KolSocialMediaTab 
            selectedKol={selectedKol} 
            formatNumber={formatNumber} 
          />
        </TabsContent>
        
        <TabsContent value="rates" className="mt-6">
          <KolRatesTab selectedKol={selectedKol} />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-6">
          <KolMetricsTab selectedKol={selectedKol} />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this KOL?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the KOL and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete KOL"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
