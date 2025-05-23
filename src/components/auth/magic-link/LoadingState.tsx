
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Sedang memproses undangan Anda..." }: LoadingStateProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
