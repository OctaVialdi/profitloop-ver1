
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InvitationLinks() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Invitation Links</h2>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Fitur magic link invitation saat ini tidak tersedia.
              Silakan gunakan metode undangan lain untuk mengundang karyawan.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
