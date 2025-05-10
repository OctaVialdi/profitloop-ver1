
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah } from "@/utils/formatUtils";

interface MidtransPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentUrl: string;
  planName: string;
  planPrice: number;
  onContinue: () => void;
  loading?: boolean;
}

export function MidtransPaymentModal({
  open,
  onOpenChange,
  paymentUrl,
  planName,
  planPrice,
  onContinue,
  loading = false
}: MidtransPaymentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
          <DialogDescription>
            Anda akan berlangganan paket {planName} dengan harga {formatRupiah(planPrice)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Anda akan diarahkan ke halaman pembayaran Midtrans untuk menyelesaikan transaksi.
            Pembayaran dapat dilakukan melalui berbagai metode seperti transfer bank, e-wallet, dan kartu kredit.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={onContinue} disabled={loading}>
            {loading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
