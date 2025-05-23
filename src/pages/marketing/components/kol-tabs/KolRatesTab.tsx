
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Trash } from "lucide-react";
import { useKols } from "@/hooks/useKols";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface KolRatesTabProps {
  selectedKol: any;
}

export const KolRatesTab: React.FC<KolRatesTabProps> = ({ selectedKol }) => {
  const [platform, setPlatform] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");
  const [minRate, setMinRate] = useState<string>("");
  const [maxRate, setMaxRate] = useState<string>("");
  const [deletingRateId, setDeletingRateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { addRateCard, deleteRateCard, isUpdating } = useKols();
  
  // Get rates from the selectedKol object
  const rates = selectedKol?.rates || [];
  console.log("Rate cards data:", rates);
  
  const handleAddRateCard = async () => {
    if (!platform || !minRate) {
      toast({
        title: "Error",
        description: "Platform and minimum rate are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const rateData = {
      platform,
      currency,
      min_rate: Number(minRate),
      max_rate: Number(maxRate) || Number(minRate),
    };
    
    try {
      await addRateCard(selectedKol.id, rateData);
      
      // Reset form
      setPlatform("");
      setMinRate("");
      setMaxRate("");
      
      toast({
        title: "Success",
        description: "Rate card added successfully",
      });
    } catch (error) {
      console.error("Error adding rate card:", error);
      toast({
        title: "Error",
        description: "Failed to add rate card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteRateCard = async () => {
    if (!deletingRateId) return;
    
    setIsLoading(true);
    try {
      await deleteRateCard(selectedKol.id, deletingRateId);
      setDeletingRateId(null);
      
      toast({
        title: "Success",
        description: "Rate card deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting rate card:", error);
      toast({
        title: "Error",
        description: "Failed to delete rate card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number, currencyCode: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return formatter.format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-1">Rate Cards</h4>
        <p className="text-sm text-gray-500 mb-6">Manage the KOL's pricing for different platforms and content types</p>
      </div>
      
      <div className="border rounded-md p-6">
        <h5 className="font-medium mb-4">Add New Rate Card</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="idr">IDR</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Rate</label>
            <Input 
              placeholder="Minimum rate" 
              type="number"
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Rate</label>
            <Input 
              placeholder="Maximum rate" 
              type="number"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          size="sm" 
          className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          onClick={handleAddRateCard}
          disabled={!platform || !minRate || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            <>
              <CreditCard size={16} className="mr-1.5" />
              Add Rate Card
            </>
          )}
        </Button>
      </div>
      
      {rates && rates.length > 0 ? (
        <div className="border rounded-md p-6">
          <h5 className="font-medium mb-4">Rate Cards</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rates.map((rate: any) => (
              <div key={rate.id} className="border rounded-md p-4 relative group">
                <div className="flex justify-between items-center mb-2">
                  <h6 className="font-medium capitalize">{rate.platform}</h6>
                  <Badge className="bg-green-100 text-green-700">{rate.currency.toUpperCase()}</Badge>
                </div>
                
                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    <span className="text-gray-500">Min Rate:</span> {formatCurrency(rate.min_rate, rate.currency)}
                  </div>
                  {rate.max_rate && rate.max_rate > rate.min_rate && (
                    <div>
                      <span className="text-gray-500">Max Rate:</span> {formatCurrency(rate.max_rate, rate.currency)}
                    </div>
                  )}
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => setDeletingRateId(rate.id)}
                >
                  <Trash size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-6 flex items-center justify-center flex-col py-12">
          <p className="text-gray-500 mb-1">No rate cards defined yet</p>
          <p className="text-xs text-gray-400">Add rates using the form above</p>
        </div>
      )}
      
      {/* Confirmation dialog for deleting rate cards */}
      <AlertDialog open={!!deletingRateId} onOpenChange={(open) => !open && setDeletingRateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Rate Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rate card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteRateCard}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
