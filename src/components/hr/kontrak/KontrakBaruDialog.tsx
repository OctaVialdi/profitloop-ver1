
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Upload } from "lucide-react";
import { ContractType } from "./types";

interface KontrakBaruDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KontrakBaruDialog: React.FC<KontrakBaruDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<"details" | "document">("details");

  const departments = [
    "HR", "Finance", "Marketing", "IT", "Operations", "Sales"
  ];

  const contractTypes = Object.values(ContractType);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buat Kontrak Baru</DialogTitle>
        </DialogHeader>
        
        {step === "details" && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Karyawan
              </label>
              <Input placeholder="Cari karyawan..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih departemen" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kontrak
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kontrak" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Pilih tanggal mulai"
                  className="pl-9" 
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir
              </label>
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Pilih tanggal berakhir"
                  className="pl-9"
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan
              </label>
              <Textarea 
                placeholder="Tambahkan catatan untuk kontrak ini..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        )}
        
        {step === "document" && (
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Upload dokumen kontrak</p>
              <p className="text-sm text-gray-500 text-center mb-6">
                Drag and drop file or click to browse
              </p>
              <Button variant="outline">Pilih File</Button>
              <p className="text-xs text-gray-500 mt-4">
                Format yang didukung: PDF, DOCX, JPG (Maks. 10MB)
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between">
          {step === "document" && (
            <Button variant="outline" onClick={() => setStep("details")}>
              Kembali
            </Button>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            
            {step === "details" ? (
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setStep("document")}>
                Selanjutnya
              </Button>
            ) : (
              <Button className="bg-purple-600 hover:bg-purple-700">
                Simpan Kontrak
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
