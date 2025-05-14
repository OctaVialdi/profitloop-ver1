
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface KolRatesTabProps {
  selectedKol: any;
}

export const KolRatesTab: React.FC<KolRatesTabProps> = ({ selectedKol }) => {
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
            <Select>
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
            <Select>
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
            <Input placeholder="Minimum rate" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maximum Rate</label>
            <Input placeholder="Maximum rate" />
          </div>
        </div>
        
        <Button size="sm" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
          Add Rate Card
        </Button>
      </div>
      
      <div className="border rounded-md p-6 flex items-center justify-center flex-col py-12">
        <p className="text-gray-500 mb-1">No rate cards defined yet</p>
        <p className="text-xs text-gray-400">Add rates using the form above</p>
      </div>
    </div>
  );
};
