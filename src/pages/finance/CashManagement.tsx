
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, FileText, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function CashManagement() {
  return (
    <div className="space-y-6">
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

      {/* Balance Card */}
      <Card className="p-6 border border-gray-200">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">SALDO KAS HARI INI</p>
          <h3 className="text-4xl font-bold text-gray-900">Rp 7.500.000</h3>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <Tabs defaultValue="ringkasan" className="w-fit">
          <TabsList className="bg-transparent border-b-0 p-0">
            <TabsTrigger 
              value="ringkasan" 
              className="px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Ringkasan
            </TabsTrigger>
            <TabsTrigger 
              value="tambah-transaksi"
              className="px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Tambah Transaksi
            </TabsTrigger>
            <TabsTrigger 
              value="daftar-transaksi"
              className="px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none"
            >
              Daftar Transaksi
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Balance Card */}
        <Card className="p-6 border border-gray-200">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">SALDO SAAT INI</p>
            <h3 className="text-2xl font-bold text-gray-900">Rp 7.500.000</h3>
            <p className="text-xs text-gray-500">Last updated: Today</p>
          </div>
        </Card>

        {/* Income Card */}
        <Card className="p-6 border border-gray-200">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">PEMASUKAN</p>
              <ArrowUpRight className="text-green-500" size={16} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Rp 1.000.000</h3>
            <p className="text-xs text-green-500">+50% dari pengeluaran</p>
          </div>
        </Card>

        {/* Expense Card */}
        <Card className="p-6 border border-gray-200">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">PENGELUARAN</p>
              <ArrowDownRight className="text-red-500" size={16} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Rp 500.000</h3>
            <p className="text-xs text-gray-500">1 transaksi pengeluaran</p>
          </div>
        </Card>
      </div>

      {/* Cash Flow Prediction */}
      <div>
        <h3 className="font-medium mb-4">Prediksi Cash Flow (7 Hari)</h3>
        <div className="space-y-3">
          {[
            { day: 2, value: 7571429, percent: 94 },
            { day: 3, value: 7642857, percent: 95 },
            { day: 4, value: 7714286, percent: 96 },
            { day: 5, value: 7785714, percent: 97 },
            { day: 6, value: 7857143, percent: 98 },
            { day: 7, value: 7928571, percent: 99 },
            { day: 8, value: 8000000, percent: 100 },
          ].map((item) => (
            <div key={item.day} className="flex items-center gap-2">
              <div className="text-sm text-gray-500 w-8">{item.day}/5</div>
              <div className="flex-1">
                <div className="h-5 bg-yellow-500 rounded-sm" style={{ width: `${item.percent}%` }}></div>
              </div>
              <div className="text-sm text-gray-500 w-20 text-right">Rp {item.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Transaksi Terbaru</h3>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <FileText size={16} />
          </Button>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-medium">Client payment</div>
                    <div className="text-xs text-gray-500">26/04/2023 - Sales</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-green-600">+Rp 1.000.000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div>
                    <div className="font-medium">Office supplies</div>
                    <div className="text-xs text-gray-500">26/04/2023 - Office</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-red-600">-Rp 500.000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
