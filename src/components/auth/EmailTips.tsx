
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react";

interface EmailTipsProps {
  showTip: boolean;
}

export const EmailTips: React.FC<EmailTipsProps> = ({ showTip }) => {
  if (!showTip) return null;

  return (
    <Alert className="mt-4 bg-amber-50 border-amber-100">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Tips jika mengalami masalah dengan email verifikasi:</AlertTitle>
      <AlertDescription className="text-amber-700">
        <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
          <li>Periksa folder spam/junk di email Anda</li>
          <li>Pastikan alamat email sudah benar</li>
          <li>Tambahkan noreply@profitloop.id ke kontak Anda</li>
          <li>Periksa apakah email Anda penuh atau ada masalah dengan penyedia email</li>
          <li>Bersihkan cache browser dan cookie, lalu coba kembali</li>
          <li>Jika masih bermasalah, coba daftar dengan email provider lain (Gmail, Yahoo, dll)</li>
        </ol>
      </AlertDescription>
    </Alert>
  );
};

export const SpamFolderAlert: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-100 rounded-md mb-4">
      <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
      <div className="text-sm text-blue-700">
        <p className="font-medium">Jangan lupa periksa folder spam/junk!</p>
        <p>Email verifikasi sering masuk ke folder spam. Tambahkan noreply@profitloop.id ke daftar kontak Anda.</p>
      </div>
    </div>
  );
};
