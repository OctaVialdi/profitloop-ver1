
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface TrialConversionMetricsProps {
  trialMetrics: { totalTrials: number; totalConversions: number; conversionRate: string; } | null;
  isLoading: boolean;
}

const TrialConversionMetrics: React.FC<TrialConversionMetricsProps> = ({ trialMetrics, isLoading }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Metrik Konversi Trial</CardTitle>
        <CardDescription>Jumlah total trial, konversi, dan tingkat konversi</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Info className="mr-2 h-4 w-4 animate-spin" />
            Memuat data...
          </div>
        ) : trialMetrics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-lg font-semibold">Total Trial</div>
              <div className="text-2xl font-bold">{trialMetrics.totalTrials}</div>
            </div>
            <div>
              <div className="text-lg font-semibold">Total Konversi</div>
              <div className="text-2xl font-bold">{trialMetrics.totalConversions}</div>
            </div>
            <div>
              <div className="text-lg font-semibold">Tingkat Konversi</div>
              <div className="text-2xl font-bold">{trialMetrics.conversionRate}%</div>
            </div>
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Tidak ada data metrik trial yang tersedia.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TrialConversionMetrics;
