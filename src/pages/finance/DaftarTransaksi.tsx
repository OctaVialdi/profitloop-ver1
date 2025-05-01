
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Check, X, Download, FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function DaftarTransaksi() {
  return (
    <div className="space-y-6">
      {/* Cash Management Header - Added to match the reference image */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Cash Management</h2>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700 gap-1">
            <Plus size={18} />
            <span>Catat Transaksi</span>
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 gap-1">
            <FileText size={18} />
            <span>Lihat Laporan</span>
          </Button>
        </div>
      </div>

      {/* Balance Card - Added to match the reference image */}
      <Card className="p-6 border border-gray-200">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">SALDO KAS HARI INI</p>
          <h3 className="text-4xl font-bold text-gray-900">Rp 7.500.000</h3>
        </div>
      </Card>

      <div className="border-b border-gray-200">
        <Tabs defaultValue="daftar-transaksi" className="w-fit">
          <TabsList className="bg-transparent border-b-0 p-0">
            <TabsTrigger 
              value="ringkasan" 
              className="px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              asChild
            >
              <Link to="/finance/cash-management">Ringkasan</Link>
            </TabsTrigger>
            <TabsTrigger 
              value="daftar-transaksi"
              className="px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
              asChild
            >
              <Link to="/finance/cash-management/daftar-transaksi">Daftar Transaksi</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daftar Transaksi Kas</h2>
        <Button variant="outline" className="gap-1">
          <Download size={18} />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="flex items-center gap-2">
          <Input type="date" placeholder="Dari" className="w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Input type="date" placeholder="Sampai" className="w-full" />
        </div>
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipe Transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kategori</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Status Approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="relative mb-4">
          <Input placeholder="Cari deskripsi..." className="pl-10 w-full" />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L11.1 11.1" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left font-medium">Tanggal</TableHead>
                <TableHead className="text-left font-medium">Deskripsi</TableHead>
                <TableHead className="text-left font-medium">Kategori</TableHead>
                <TableHead className="text-left font-medium">Status</TableHead>
                <TableHead className="text-right font-medium">Jumlah</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Transaction 1 */}
              <TableRow className="bg-green-50 border-l-4 border-green-500">
                <TableCell className="font-medium">01/05/2025</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>asdfaasdf</span>
                  </div>
                </TableCell>
                <TableCell>Office</TableCell>
                <TableCell>
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800">
                    Approved
                  </span>
                </TableCell>
                <TableCell className="text-right text-green-600 font-medium">+Rp 1.000.000</TableCell>
                <TableCell className="text-right w-16"></TableCell>
              </TableRow>
              
              {/* Transaction 2 */}
              <TableRow className="bg-white border-l-4 border-green-500">
                <TableCell className="font-medium">26/04/2025</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Client payment</span>
                  </div>
                </TableCell>
                <TableCell>Sales</TableCell>
                <TableCell>
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </TableCell>
                <TableCell className="text-right text-green-600 font-medium">+Rp 1.000.000</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-700">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-700">
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              
              {/* Transaction 3 */}
              <TableRow className="bg-red-50 border-l-4 border-red-500">
                <TableCell className="font-medium">26/04/2025</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Office supplies</span>
                  </div>
                </TableCell>
                <TableCell>Office</TableCell>
                <TableCell>
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </TableCell>
                <TableCell className="text-right text-red-600 font-medium">-Rp 500.000</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-700">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-700">
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-green-50 border-green-100">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Pemasukan</p>
            <p className="text-2xl font-bold text-green-600">Rp 2.000.000</p>
          </div>
        </Card>
        <Card className="p-5 bg-red-50 border-red-100">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600">Rp 500.000</p>
          </div>
        </Card>
        <Card className="p-5 bg-blue-50 border-blue-100">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Selisih Kas</p>
            <p className="text-2xl font-bold text-blue-600">Rp 1.500.000</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
