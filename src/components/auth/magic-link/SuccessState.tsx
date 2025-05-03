
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface SuccessStateProps {
  organizationName: string;
}

const SuccessState = ({ organizationName }: SuccessStateProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-center">
          Bergabung Berhasil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-2">
          Anda telah berhasil bergabung dengan{" "}
          <span className="font-semibold">{organizationName}</span>
        </p>
        <p className="text-center text-gray-600 text-sm mb-6">
          Mengalihkan Anda ke halaman selamat datang...
        </p>
      </CardContent>
    </Card>
  );
};

export default SuccessState;
