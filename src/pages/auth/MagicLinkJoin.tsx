
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const MagicLinkJoin = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-center">
            Fitur Tidak Tersedia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">
            Fitur magic link invitation saat ini sedang tidak tersedia.
          </p>
          
          <div className="flex justify-center mt-4">
            <Button onClick={() => navigate("/auth/login")} variant="outline">
              Kembali ke Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MagicLinkJoin;
