
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Timer } from "lucide-react";

interface TrialExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: () => void;
  onSignOut: () => void;
}

const TrialExpiredModal = ({ 
  open, 
  onOpenChange, 
  onSubscribe, 
  onSignOut 
}: TrialExpiredModalProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full sm:max-w-md mx-auto h-auto max-h-[90vh] rounded-t-lg bg-white shadow-lg p-0">
        <div className="flex flex-col items-center p-6">
          {/* Timer Icon */}
          <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Timer className="w-14 h-14 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">
            Masa trial Anda telah berakhir
          </h2>
          
          <p className="text-gray-600 text-center mb-6">
            Upgrade sekarang untuk membuka semua fitur premium dan melanjutkan perjalanan Anda bersama kami.
          </p>
          
          <div className="w-full space-y-4">
            <Button 
              className="w-full py-6 text-base font-medium bg-[#9b87f5] hover:bg-[#8a72f3]"
              onClick={onSubscribe}
            >
              Upgrade Sekarang
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-6 text-base font-medium"
              onClick={onSignOut}
            >
              Keluar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TrialExpiredModal;
