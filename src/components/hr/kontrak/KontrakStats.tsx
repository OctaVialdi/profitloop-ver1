
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, AlertTriangle } from "lucide-react";

export const KontrakStats: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-sm">Kontrak Aktif</div>
            <div className="text-3xl font-bold mt-1">3</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-sm">Kontrak Akan Berakhir</div>
            <div className="text-3xl font-bold mt-1">5</div>
            <div className="text-xs text-gray-500">Dalam 90 hari</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <div className="text-gray-600 text-sm">Segera Berakhir</div>
            <div className="text-3xl font-bold mt-1">4</div>
            <div className="text-xs text-gray-500">Dalam 30 hari</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
