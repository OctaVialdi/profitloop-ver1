
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Upload, Search } from "lucide-react";
import { KontrakStats } from "@/components/hr/kontrak/KontrakStats";
import { KontrakTable } from "@/components/hr/kontrak/KontrakTable";
import { KontrakDetailDialog } from "@/components/hr/kontrak/KontrakDetailDialog";
import { KontrakPerpanjangDialog } from "@/components/hr/kontrak/KontrakPerpanjangDialog";
import { KontrakBaruDialog } from "@/components/hr/kontrak/KontrakBaruDialog";
import { KontrakTemplateSection } from "@/components/hr/kontrak/KontrakTemplateSection";
import { ContractType, KontrakData } from "@/components/hr/kontrak/types";

export default function HRKontrak() {
  const [activeTab, setActiveTab] = useState("akan-berakhir");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isPerpanjangOpen, setIsPerpanjangOpen] = useState(false);
  const [isNewKontrakOpen, setIsNewKontrakOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<KontrakData | null>(null);

  // Mock data for contracts
  const contracts: KontrakData[] = [
    {
      id: "1",
      name: "Siti Rahayu",
      department: "HR",
      contractType: ContractType.CONTRACT,
      startDate: "03 Jul 2024",
      endDate: "13 May 2025",
      status: "Expires soon (10 days)",
      statusClass: "bg-amber-100 text-amber-800",
      notes: "Second year renewal",
      duration: "1 year -2 month"
    },
    {
      id: "2",
      name: "Bambang Suprapto",
      department: "Operations",
      contractType: ContractType.PROBATION,
      startDate: "03 Mar 2025",
      endDate: "18 May 2025",
      status: "Expires soon (15 days)",
      statusClass: "bg-amber-100 text-amber-800",
    },
    {
      id: "3",
      name: "Dewi Lestari",
      department: "Marketing",
      contractType: ContractType.CONTRACT,
      startDate: "03 Jun 2024",
      endDate: "23 May 2025",
      status: "Expires soon (20 days)",
      statusClass: "bg-amber-100 text-amber-800",
    },
    {
      id: "4",
      name: "Agus Hermawan",
      department: "IT",
      contractType: ContractType.CONTRACT,
      startDate: "03 May 2024",
      endDate: "02 Jun 2025",
      status: "Expires soon (30 days)",
      statusClass: "bg-amber-100 text-amber-800",
    },
    {
      id: "5",
      name: "Eko Prasetyo",
      department: "Sales",
      contractType: ContractType.PROBATION,
      startDate: "03 Dec 2024",
      endDate: "12 Jun 2025",
      status: "Active",
      statusClass: "bg-green-100 text-green-800",
    },
  ];

  // Mock data for contract templates
  const contractTemplates = [
    {
      id: "1",
      title: "Permanent Employee Contract",
      description: "Standard contract template for permanent employees",
      type: ContractType.PERMANENT,
      updatedDate: "03 Nov 2024",
      version: "2.1"
    },
    {
      id: "2",
      title: "Contract Employee Agreement",
      description: "Fixed-term contract template (1 year duration)",
      type: ContractType.CONTRACT,
      updatedDate: "03 Feb 2025",
      version: "1.3"
    },
    {
      id: "3",
      title: "Probation Period Agreement",
      description: "Standard 3-month probationary period agreement",
      type: ContractType.PROBATION,
      updatedDate: "03 May 2024", 
      version: "1.0"
    },
    {
      id: "4",
      title: "Internship Agreement",
      description: "Standard internship agreement (6 months)",
      type: ContractType.INTERNSHIP,
      updatedDate: "03 May 2024",
      version: "1.1"
    },
    {
      id: "5",
      title: "Agency Service Agreement",
      description: "Template for external agency contractors",
      type: ContractType.TEMPORARY,
      updatedDate: "03 Mar 2025",
      version: "1.2"
    }
  ];

  const handleDetailClick = (contract: KontrakData) => {
    setSelectedContract(contract);
    setIsDetailOpen(true);
  };

  const handlePerpanjangClick = (contract: KontrakData) => {
    setSelectedContract(contract);
    setIsPerpanjangOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredContracts = contracts.filter(contract => 
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header with title and action buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kontrak</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Kontrak</span>
          </Button>
          <Button 
            onClick={() => setIsNewKontrakOpen(true)} 
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <span>Buat Kontrak Baru</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <KontrakStats />

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input 
          className="pl-10" 
          placeholder="Cari berdasarkan nama atau departemen..." 
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
          <TabsTrigger value="akan-berakhir">Kontrak Akan Berakhir</TabsTrigger>
          <TabsTrigger value="template">Template Kontrak</TabsTrigger>
        </TabsList>

        <TabsContent value="akan-berakhir" className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold">Kontrak Akan Berakhir ({filteredContracts.length})</h2>
          <KontrakTable 
            contracts={filteredContracts} 
            onDetailClick={handleDetailClick}
            onPerpanjangClick={handlePerpanjangClick}
          />
          <div className="text-sm text-gray-500 text-right mt-2">
            Terakhir diperbarui: 03 May 2025, 17:52
          </div>
        </TabsContent>

        <TabsContent value="template" className="pt-4">
          <KontrakTemplateSection templates={contractTemplates} />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      {selectedContract && (
        <>
          <KontrakDetailDialog 
            isOpen={isDetailOpen} 
            onClose={() => setIsDetailOpen(false)}
            contract={selectedContract}
          />
          <KontrakPerpanjangDialog 
            isOpen={isPerpanjangOpen} 
            onClose={() => setIsPerpanjangOpen(false)}
            contract={selectedContract}
          />
        </>
      )}
      
      <KontrakBaruDialog 
        isOpen={isNewKontrakOpen} 
        onClose={() => setIsNewKontrakOpen(false)}
      />
    </div>
  );
}
