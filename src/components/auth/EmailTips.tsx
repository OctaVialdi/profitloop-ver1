
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EmailTipsProps {
  showTip: boolean;
}

export const EmailTips: React.FC<EmailTipsProps> = ({ showTip }) => {
  if (!showTip) return null;

  return (
    <Alert className="mt-4 bg-amber-50 border-amber-100">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Tips jika mengalami masalah dengan magic link:</AlertTitle>
      <AlertDescription className="text-amber-700">
        <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
          <li>Periksa folder spam/junk di email penerima</li>
          <li>Pastikan alamat email sudah benar</li>
          <li>Coba gunakan link magic link secara langsung tanpa parameter tambahan</li>
          <li>Bersihkan cache browser dan cookie, lalu coba kembali</li>
          <li>Jika masih gagal, gunakan tautan magic link yang sudah dibuat untuk mengirim secara manual</li>
          <li>Alternatif lain, gunakan opsi login manual jika tersedia</li>
        </ol>
      </AlertDescription>
    </Alert>
  );
};
