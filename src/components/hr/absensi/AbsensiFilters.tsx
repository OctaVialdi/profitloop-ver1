
import React, { useState } from "react";
import { CalendarIcon, Check, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AbsensiFiltersProps {
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  setCustomDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const AbsensiFilters: React.FC<AbsensiFiltersProps> = ({
  departmentFilter,
  setDepartmentFilter,
  periodFilter,
  setPeriodFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  customDateRange,
  setCustomDateRange,
}) => {
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);

  // Generate years from 2025 to 2050
  const years = Array.from({ length: 26 }, (_, i) => 2025 + i);

  // Handle period selection
  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value);
    if (value !== "custom") {
      setIsCustomDateOpen(false);
    } else {
      setIsCustomDateOpen(true);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium mb-1 block">Departemen</label>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Departemen" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Departemen</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Periode</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {periodFilter === "custom" 
                ? "Periode Kustom" 
                : periodFilter}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => handlePeriodChange("Bulan Ini")}>
                <Check className={cn("mr-2 h-4 w-4", periodFilter === "Bulan Ini" ? "opacity-100" : "opacity-0")}/>
                Bulan Ini
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handlePeriodChange("Bulan Lalu")}>
                <Check className={cn("mr-2 h-4 w-4", periodFilter === "Bulan Lalu" ? "opacity-100" : "opacity-0")}/>
                Bulan Lalu
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="px-2 py-1.5 text-sm font-semibold">2025</div>
              <DropdownMenuItem onSelect={() => handlePeriodChange("Q1 2025")}>
                <Check className={cn("mr-2 h-4 w-4", periodFilter === "Q1 2025" ? "opacity-100" : "opacity-0")}/>
                Q1 2025
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handlePeriodChange("Q2 2025")}>
                <Check className={cn("mr-2 h-4 w-4", periodFilter === "Q2 2025" ? "opacity-100" : "opacity-0")}/>
                Q2 2025
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handlePeriodChange("Q3 2025")}>
                <Check className={cn("mr-2 h-4 w-4", periodFilter === "Q3 2025" ? "opacity-100" : "opacity-0")}/>
                Q3 2025
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handlePeriodChange("Q4 2025")}>
                <Check className={cn("mr-2 h-4 w-4", periodFilter === "Q4 2025" ? "opacity-100" : "opacity-0")}/>
                Q4 2025
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            {/* Generate years from 2026 to 2050 */}
            {years.slice(1).map(year => (
              <React.Fragment key={year}>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <div className="px-2 py-1.5 text-sm font-semibold">{year}</div>
                  <DropdownMenuItem onSelect={() => handlePeriodChange(`Q1 ${year}`)}>
                    <Check className={cn("mr-2 h-4 w-4", periodFilter === `Q1 ${year}` ? "opacity-100" : "opacity-0")}/>
                    Q1 {year}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handlePeriodChange(`Q2 ${year}`)}>
                    <Check className={cn("mr-2 h-4 w-4", periodFilter === `Q2 ${year}` ? "opacity-100" : "opacity-0")}/>
                    Q2 {year}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handlePeriodChange(`Q3 ${year}`)}>
                    <Check className={cn("mr-2 h-4 w-4", periodFilter === `Q3 ${year}` ? "opacity-100" : "opacity-0")}/>
                    Q3 {year}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handlePeriodChange(`Q4 ${year}`)}>
                    <Check className={cn("mr-2 h-4 w-4", periodFilter === `Q4 ${year}` ? "opacity-100" : "opacity-0")}/>
                    Q4 {year}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </React.Fragment>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => handlePeriodChange("custom")}>
              <Check className={cn("mr-2 h-4 w-4", periodFilter === "custom" ? "opacity-100" : "opacity-0")}/>
              Pilih Tanggal Kustom
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Custom date range picker */}
        {isCustomDateOpen && (
          <div className="mt-2 grid gap-2">
            <div className="flex items-center gap-2">
              <div className="grid gap-1 flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-from"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange.from ? (
                        format(customDateRange.from, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="single"
                      selected={customDateRange.from}
                      onSelect={(date) => setCustomDateRange({ ...customDateRange, from: date })}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <span>-</span>
              <div className="grid gap-1 flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-to"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateRange.to ? (
                        format(customDateRange.to, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="single"
                      selected={customDateRange.to}
                      onSelect={(date) => setCustomDateRange({ ...customDateRange, to: date })}
                      disabled={(date) => customDateRange.from ? date < customDateRange.from : false}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button size="sm" onClick={() => handlePeriodChange("Bulan Ini")} variant="secondary">
              Reset
            </Button>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Status</label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="hadir">Hadir</SelectItem>
              <SelectItem value="telat">Telat</SelectItem>
              <SelectItem value="cuti">Cuti</SelectItem>
              <SelectItem value="sakit">Sakit/Izin</SelectItem>
              <SelectItem value="tanpa_izin">Tanpa Izin</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Cari Karyawan</label>
        <div className="relative">
          <Input
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>
    </div>
  );
};
