
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KontrakData, ContractType } from "./types";

interface KontrakTableProps {
  contracts: KontrakData[];
  onDetailClick: (contract: KontrakData) => void;
  onPerpanjangClick: (contract: KontrakData) => void;
}

export const KontrakTable: React.FC<KontrakTableProps> = ({ 
  contracts, 
  onDetailClick,
  onPerpanjangClick
}) => {
  const getContractTypeBadge = (type: ContractType) => {
    const styles = {
      [ContractType.CONTRACT]: "bg-purple-100 text-purple-800",
      [ContractType.PROBATION]: "bg-orange-100 text-orange-800",
      [ContractType.PERMANENT]: "bg-blue-100 text-blue-800",
      [ContractType.TEMPORARY]: "bg-cyan-100 text-cyan-800",
      [ContractType.INTERNSHIP]: "bg-green-100 text-green-800",
    };
    
    return (
      <Badge className={styles[type] || ""} variant="outline">
        {type}
      </Badge>
    );
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Departemen</TableHead>
            <TableHead>Tipe Kontrak</TableHead>
            <TableHead>Tgl Mulai</TableHead>
            <TableHead>Tgl Berakhir</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.name}</TableCell>
              <TableCell>{contract.department}</TableCell>
              <TableCell>{getContractTypeBadge(contract.contractType)}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={contract.statusClass}
                >
                  {contract.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDetailClick(contract)}
                  >
                    Detail
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => onPerpanjangClick(contract)}
                  >
                    Perpanjang
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
