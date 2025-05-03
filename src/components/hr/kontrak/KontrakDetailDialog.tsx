
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, User, Calendar } from "lucide-react";
import { KontrakData, RevisionHistory, ContractDocument } from "./types";

interface KontrakDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: KontrakData;
}

export const KontrakDetailDialog: React.FC<KontrakDetailDialogProps> = ({
  isOpen,
  onClose,
  contract,
}) => {
  const [activeTab, setActiveTab] = useState("informasi");
  
  // Mock document data
  const document: ContractDocument = {
    version: "2.0",
    signedDate: contract.startDate,
    signedBy: "HR Director"
  };
  
  // Mock revision history
  const revisionHistory: RevisionHistory[] = [
    {
      action: "Created initial contract document",
      by: "HR Manager",
      date: "15 Mar 2025",
      version: "v1.0"
    },
    {
      action: "Reviewed and approved contract terms",
      by: "Legal Department",
      date: "17 Mar 2025",
      version: "v1.0"
    },
    {
      action: "Approved and signed",
      by: "Department Manager",
      date: "18 Mar 2025",
      version: "v1.0"
    },
    {
      action: "Signed contract",
      by: "Employee",
      date: "20 Mar 2025",
      version: "v1.0"
    }
  ];

  const getContractStatus = () => {
    if (contract.status === "Active") {
      return "Active";
    }
    return "To Be Renewed";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Detail Kontrak
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informasi">Informasi Umum</TabsTrigger>
            <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
            <TabsTrigger value="histori">Histori Revisi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informasi" className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-normal text-gray-500">Nama Karyawan</h3>
                <p className="text-lg">{contract.name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-normal text-gray-500">Departemen</h3>
                <p className="text-lg">{contract.department}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-normal text-gray-500">Jenis Kontrak</h3>
                <div className="mt-1">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {contract.contractType}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-normal text-gray-500">Status</h3>
                <div className="mt-1">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                    {getContractStatus()}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-normal text-gray-500">Tanggal Mulai</h3>
                <p className="flex items-center gap-2 text-lg">
                  <Calendar className="h-4 w-4" />
                  {contract.startDate}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-normal text-gray-500">Tanggal Berakhir</h3>
                <p className="flex items-center gap-2 text-lg">
                  <Calendar className="h-4 w-4" />
                  {contract.endDate}
                </p>
              </div>
              
              <div className="col-span-2">
                <h3 className="text-sm font-normal text-gray-500">Durasi Kontrak</h3>
                <p className="text-lg">{contract.duration || "1 year"}</p>
              </div>
              
              {contract.notes && (
                <div className="col-span-2">
                  <h3 className="text-sm font-normal text-gray-500">Catatan</h3>
                  <p className="p-4 bg-gray-50 rounded-md mt-2">{contract.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="dokumen" className="py-4">
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="w-16 h-20 bg-gray-300 rounded flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-gray-500" />
              </div>
              
              <h3 className="text-xl font-medium mb-2">Contract Document</h3>
              <p className="text-gray-500 mb-8">
                Version {document.version} • Signed on {document.signedDate}
              </p>
              
              <Button className="bg-purple-500 hover:bg-purple-600">
                <FileText className="mr-2 h-4 w-4" />
                Download Document
              </Button>
              
              <div className="w-full mt-12 pt-8 border-t">
                <h4 className="text-gray-500 mb-3">Signed By</h4>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-lg">{document.signedBy}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="histori" className="py-4">
            <div className="relative">
              {revisionHistory.map((revision, index) => (
                <div key={index} className="ml-6 mb-8 relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-9 mt-1.5 h-4 w-4 rounded-full border-2 border-white ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  
                  {/* Timeline line */}
                  {index < revisionHistory.length - 1 && (
                    <div className="absolute -left-7 top-4 h-full w-0.5 bg-gray-200"></div>
                  )}
                  
                  {/* Content */}
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">{revision.action}</h3>
                      <span className="text-gray-500">{revision.version}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{revision.by}</span>
                      <span>{revision.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
