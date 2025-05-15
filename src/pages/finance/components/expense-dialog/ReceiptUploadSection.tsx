
import React from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReceiptUploadSectionProps {
  receipt: File | null;
  receiptPreview: string | null;
  handleReceiptUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeReceipt: () => void;
}

export const ReceiptUploadSection: React.FC<ReceiptUploadSectionProps> = ({
  receipt,
  receiptPreview,
  handleReceiptUpload,
  removeReceipt
}) => {
  return (
    <div className="space-y-2">
      <label className="text-base font-medium">Receipt</label>
      <div className="border border-dashed border-gray-300 rounded-md p-4">
        {receiptPreview ? (
          <div className="relative">
            <img 
              src={receiptPreview} 
              alt="Receipt preview" 
              className="max-h-[150px] mx-auto rounded-md object-contain" 
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 h-8 w-8 p-0"
              onClick={removeReceipt}
            >
              ×
            </Button>
          </div>
        ) : receipt && !receiptPreview ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-gray-100 rounded-md p-4 text-center">
              <p className="font-medium">{receipt.name}</p>
              <p className="text-xs text-gray-500">{(receipt.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={removeReceipt}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Upload receipt image</p>
            <label className="cursor-pointer">
              <span className="bg-[#8B5CF6] text-white px-4 py-2 rounded-md text-sm hover:bg-[#7c4ff1]">
                Select File
              </span>
              <Input 
                type="file" 
                className="hidden" 
                onChange={handleReceiptUpload}
                accept="image/*,application/pdf"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">Max file size: 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};
