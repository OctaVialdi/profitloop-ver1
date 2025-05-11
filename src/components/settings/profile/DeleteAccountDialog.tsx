
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  fullName: string;
  expectedConfirmation: string;
}

export const DeleteAccountDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirmDelete, 
  isDeleting, 
  fullName,
  expectedConfirmation
}: DeleteAccountDialogProps) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const isConfirmationCorrect = deleteConfirmation.toLowerCase() === expectedConfirmation.toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <AlertCircle className="w-5 h-5 mr-2" />
            Konfirmasi Hapus Akun
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Akun Anda beserta semua data akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm font-medium text-gray-900">Apa yang akan terjadi setelah akun dihapus:</p>
          <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
            <li>Anda akan kehilangan akses ke semua data dan informasi akun</li>
            <li>Jika Anda adalah admin terakhir, organisasi Anda juga akan dihapus</li>
            <li>Anda tidak dapat memulihkan akun setelah dihapus</li>
          </ul>
          
          <div className="mt-4">
            <Label htmlFor="delete-confirmation" className="text-destructive font-medium">
              Untuk konfirmasi, ketik "hapus akun profile {fullName}"
            </Label>
            <Input
              id="delete-confirmation"
              className="mt-2"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={`hapus akun profile ${fullName}`}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirmDelete}
            disabled={isDeleting || !isConfirmationCorrect}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Akun Permanen"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteAccountCard = ({ 
  onOpenDeleteDialog, 
  isDeleting 
}: { 
  onOpenDeleteDialog: () => void;
  isDeleting: boolean;
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Hapus Akun</CardTitle>
        <CardDescription>
          Setelah Anda menghapus akun, tidak ada jalan untuk kembali. Harap
          dipastikan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          onClick={onOpenDeleteDialog}
          disabled={isDeleting}
        >
          {isDeleting ? "Menghapus..." : "Hapus Akun"}
        </Button>
      </CardContent>
    </Card>
  );
};
