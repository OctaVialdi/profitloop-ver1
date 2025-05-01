
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const EmailNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-center text-2xl">Tidak Ada Data Email</CardTitle>
          <CardDescription className="text-center">
            Tidak ada email yang ditemukan untuk mengirim verifikasi.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/auth/register")} className="w-full">
            Kembali ke Halaman Registrasi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
