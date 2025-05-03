
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChartBar } from "lucide-react";

interface AnalyticsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsSheet: React.FC<AnalyticsSheetProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ChartBar className="mr-2 h-5 w-5" />
            Analitik Kinerja
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rata-Rata Nilai Kinerja per Departemen</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>IT</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-purple-500" style={{ width: "96%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Finance</span>
                  <span className="font-medium">4.5/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "90%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Marketing</span>
                  <span className="font-medium">4.3/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "86%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>HR</span>
                  <span className="font-medium">4.0/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: "80%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Operations</span>
                  <span className="font-medium">3.8/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: "76%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Status Review Kinerja Q1 2025</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-500">65%</div>
                <div className="text-sm text-muted-foreground mt-1">Selesai</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">20%</div>
                <div className="text-sm text-muted-foreground mt-1">Menunggu</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-500">10%</div>
                <div className="text-sm text-muted-foreground mt-1">Draft</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-500">5%</div>
                <div className="text-sm text-muted-foreground mt-1">Terlambat</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Distribusi Nilai</h3>
            <div className="w-full h-40 bg-muted/20 rounded-md flex items-end">
              <div className="flex-1 flex flex-col justify-end items-center">
                <div className="w-10 bg-gray-200 rounded-t-md" style={{ height: "10%" }}></div>
                <span className="text-xs mt-2">1</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center">
                <div className="w-10 bg-gray-300 rounded-t-md" style={{ height: "15%" }}></div>
                <span className="text-xs mt-2">2</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center">
                <div className="w-10 bg-blue-300 rounded-t-md" style={{ height: "20%" }}></div>
                <span className="text-xs mt-2">3</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center">
                <div className="w-10 bg-blue-400 rounded-t-md" style={{ height: "60%" }}></div>
                <span className="text-xs mt-2">4</span>
              </div>
              <div className="flex-1 flex flex-col justify-end items-center">
                <div className="w-10 bg-blue-500 rounded-t-md" style={{ height: "80%" }}></div>
                <span className="text-xs mt-2">5</span>
              </div>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-4">
              Rating (1-5)
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AnalyticsSheet;
