
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

export const RatesTab: React.FC = () => {
  const [platform, setPlatform] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");
  const [minRate, setMinRate] = useState<string>("");
  const [maxRate, setMaxRate] = useState<string>("");
  const [rateCards, setRateCards] = useState<Array<{
    platform: string;
    currency: string;
    minRate: number;
    maxRate: number;
  }>>([]);

  const handleAddRateCard = () => {
    if (!platform || !minRate) return;
    
    setRateCards([...rateCards, {
      platform,
      currency,
      minRate: Number(minRate),
      maxRate: Number(maxRate) || Number(minRate),
    }]);
    
    // Reset form
    setPlatform("");
    setMinRate("");
    setMaxRate("");
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
          disabled={!platform || !minRate}
        >
          <CreditCard size={16} className="mr-1.5" />
          Add Rate Card
        </Button>
      </div>
      
      {rateCards.length > 0 ? (
        <div className="border rounded-md p-6">
          <h5 className="font-medium mb-4">Rate Cards</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rateCards.map((card, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h6 className="font-medium capitalize">{card.platform}</h6>
                  <Badge className="bg-green-100 text-green-700">{card.currency.toUpperCase()}</Badge>
                </div>
                
                <div className="text-sm text-gray-700 space-y-1">
                  <div>
                    <span className="text-gray-500">Min Rate:</span> {formatCurrency(card.minRate, card.currency)}
                  </div>
                  {card.maxRate > card.minRate && (
                    <div>
                      <span className="text-gray-500">Max Rate:</span> {formatCurrency(card.maxRate, card.currency)}
                    </div>
                  )}
                </div>
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
    </div>
  );
};
