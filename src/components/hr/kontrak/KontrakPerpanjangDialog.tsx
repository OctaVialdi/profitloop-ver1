
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { KontrakData } from "./types";

interface KontrakPerpanjangDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: KontrakData;
}

export const KontrakPerpanjangDialog: React.FC<KontrakPerpanjangDialogProps> = ({
  isOpen,
  onClose,
  contract,
}) => {
  // Calculate next year's date for the default contract extension
  const getNextYearDate = (dateString: string) => {
    const parts = dateString.split(" ");
    const day = parts[0];
    const month = parts[1];
    const year = parseInt(parts[2]) + 1;
    return `${day} ${month} ${year}`;
  };

  const nextYearDate = getNextYearDate(contract.endDate);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Perpanjang Kontrak</DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Perpanjang kontrak untuk {contract.name} yang akan berakhir pada {contract.endDate}.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Karyawan
            </label>
            <Input id="employeeName" value={contract.name} disabled className="bg-gray-100" />
          </div>
          
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Departemen
            </label>
            <Input id="department" value={contract.department} disabled className="bg-gray-100" />
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai
            </label>
            <div className="relative">
              <Input 
                id="startDate" 
                value={contract.endDate} 
                className="pl-9" 
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Berakhir
            </label>
            <div className="relative">
              <Input 
                id="endDate" 
                value={nextYearDate}
                className="pl-9" 
              />
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <div className="col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (opsional)
            </label>
            <Textarea 
              id="notes" 
              placeholder="Tambahkan catatan untuk perpanjangan kontrak ini..." 
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Ajukan Perpanjangan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
