
import { Mail, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnverifiedEmailAlertProps {
  onResendVerification: () => void;
  isResending: boolean;
}

const UnverifiedEmailAlert = ({ onResendVerification, isResending }: UnverifiedEmailAlertProps) => {
  return (
    <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Email belum diverifikasi</p>
          <p className="text-sm text-yellow-700 mt-1">
            Anda perlu memverifikasi email sebelum bisa login. Silakan cek kotak masuk email Anda, termasuk folder spam/junk.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              onClick={onResendVerification}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Ulang Email Verifikasi'
              )}
            </Button>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Catatan: Email verifikasi sering masuk ke folder spam/junk. Tambahkan noreply@profitloop.id ke kontak Anda untuk menghindari masalah.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnverifiedEmailAlert;
