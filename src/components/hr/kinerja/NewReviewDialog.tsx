
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewReviewDialog: React.FC<NewReviewDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleCreate = () => {
    if (!selectedPeriod || !selectedTemplate || !selectedDepartment) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Semua field harus diisi",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Review baru berhasil dibuat",
        description: `Review kinerja untuk ${selectedPeriod} telah dibuat`,
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Buat Review Kinerja Baru</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Periode Review</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode review" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q2 2025">Q2 2025 (Apr-Jun)</SelectItem>
                <SelectItem value="Q3 2025">Q3 2025 (Jul-Sep)</SelectItem>
                <SelectItem value="Q4 2025">Q4 2025 (Okt-Des)</SelectItem>
                <SelectItem value="Tahunan 2025">Tahunan 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Review</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih template review" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard Performance Review">Standard Performance Review</SelectItem>
                <SelectItem value="Leadership Review">Leadership Review</SelectItem>
                <SelectItem value="Technical Staff Review">Technical Staff Review</SelectItem>
                <SelectItem value="Sales Performance Review">Sales Performance Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Departemen</label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Departemen</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Durasi Review</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Mulai</label>
                <input type="date" className="w-full border rounded-md p-2" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Selesai</label>
                <input type="date" className="w-full border rounded-md p-2" />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Membuat..." : "Buat Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewReviewDialog;
