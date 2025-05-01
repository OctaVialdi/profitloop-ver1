
import React from "react";

export const EmailTips: React.FC = () => {
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
      <p className="font-medium mb-1">Tidak menerima email?</p>
      <ul className="list-disc list-inside">
        <li>Periksa folder spam/junk Anda</li>
        <li>Verifikasi alamat email yang Anda masukkan</li>
        <li>Tunggu beberapa menit</li>
      </ul>
    </div>
  );
};
