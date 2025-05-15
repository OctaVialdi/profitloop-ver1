
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ReviewScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewScheduleDialog: React.FC<ReviewScheduleDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Jadwal review kinerja Q2 2025 telah diatur", {
        description: "Jadwal review berhasil diperbarui",
      });
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Jadwal Review Kinerja</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="border rounded-md p-4">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-md">
                <Calendar className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold">Q2 2025 Performance Review</h3>
                <p className="text-sm text-muted-foreground">
                  30 Juni - 15 Juli 2025
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-purple-100 text-purple-800 rounded-full px-2.5 py-0.5">
                    35 karyawan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-md">
                <Calendar className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold">Probation Review - New Hires</h3>
                <p className="text-sm text-muted-foreground">
                  15 Mei - 25 Mei 2025
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-purple-100 text-purple-800 rounded-full px-2.5 py-0.5">
                    5 karyawan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 p-3 rounded-md">
                <Calendar className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-semibold">Mid-Year Leadership Evaluation</h3>
                <p className="text-sm text-muted-foreground">
                  15 Juli - 25 Juli 2025
                </p>
                <div className="mt-2 text-sm">
                  <span className="bg-purple-100 text-purple-800 rounded-full px-2.5 py-0.5">
                    8 karyawan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Tambah Jadwal Baru"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewScheduleDialog;
