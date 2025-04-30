
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const VerificationSent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verifikasi Email</CardTitle>
          <CardDescription className="text-center">
            Kami telah mengirim email verifikasi ke alamat email Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Silakan cek kotak masuk email Anda dan klik tautan verifikasi untuk melanjutkan.
            Jika Anda tidak menerima email, periksa folder spam atau junk.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild variant="outline" className="w-full">
            <Link to="/auth/login">Kembali ke Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationSent;
