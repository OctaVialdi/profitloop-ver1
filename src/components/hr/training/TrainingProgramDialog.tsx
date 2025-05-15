
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface TrainingProgramDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingProgramDialog: React.FC<TrainingProgramDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [programName, setProgramName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [trainer, setTrainer] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [budget, setBudget] = useState("");
  const [objectives, setObjectives] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [materials, setMaterials] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!programName || !category || !startDate || !endDate || !trainer || !location) {
      toast.error("Form tidak lengkap", {
        description: "Mohon lengkapi semua field yang diperlukan",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Program ${programName} telah berhasil ditambahkan`, {
        description: "Program training berhasil ditambahkan",
      });
      onClose();
      resetForm();
    }, 1000);
  };
  
  const resetForm = () => {
    setProgramName("");
    setCategory("");
    setDescription("");
    setTrainer("");
    setLocation("");
    setStartDate(undefined);
    setEndDate(undefined);
    setMaxParticipants("10");
    setBudget("");
    setObjectives("");
    setPrerequisites("");
    setMaterials("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Program Training</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="program-name" className="text-sm font-medium">Nama Program</label>
            <input
              id="program-name"
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan nama program training"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Kategori</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 px-3 py-2 border rounded-md resize-none"
              placeholder="Masukkan deskripsi program"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="trainer" className="text-sm font-medium">Trainer</label>
              <input
                id="trainer"
                type="text"
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Nama trainer"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Lokasi</label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Lokasi training"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Selesai</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="max-participants" className="text-sm font-medium">Maksimal Peserta</label>
              <input
                id="max-participants"
                type="number"
                min="1"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">Budget (Rp)</label>
              <input
                id="budget"
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="objectives" className="text-sm font-medium">Tujuan Program (satu per baris)</label>
            <textarea
              id="objectives"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full h-24 px-3 py-2 border rounded-md resize-none"
              placeholder="Masukkan tujuan program (satu per baris)"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="prerequisites" className="text-sm font-medium">Prasyarat (satu per baris)</label>
            <textarea
              id="prerequisites"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              className="w-full h-24 px-3 py-2 border rounded-md resize-none"
              placeholder="Masukkan prasyarat (satu per baris)"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="materials" className="text-sm font-medium">Materi (satu per baris)</label>
            <textarea
              id="materials"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full h-24 px-3 py-2 border rounded-md resize-none"
              placeholder="Masukkan daftar materi (satu per baris)"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
