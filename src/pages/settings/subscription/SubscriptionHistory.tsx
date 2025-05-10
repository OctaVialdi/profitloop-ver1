
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Package } from "lucide-react";
import { useOrganization } from "@/hooks/useOrganization";
import { subscriptionAnalyticsService } from "@/services/subscriptionAnalyticsService";

export const SubscriptionHistory = () => {
  const { organization } = useOrganization();
  const [activeTab, setActiveTab] = useState("history");

  return (
    <Tabs 
      defaultValue="history" 
      value={activeTab} 
      onValueChange={(value) => {
        setActiveTab(value);
        if (value === "history") {
          subscriptionAnalyticsService.trackEvent({
            eventType: 'subscription_page_view',
            organizationId: organization?.id,
            additionalData: { view: 'history' }
          });
        }
      }}
      className="space-y-4 pt-4 border-t"
    >
      <div className="flex justify-between items-center px-6">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Riwayat Transaksi
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="history" className="px-6 pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Transaksi</CardTitle>
            <CardDescription>
              Daftar semua transaksi yang telah dilakukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada riwayat transaksi</p>
              <p className="text-sm mt-2">Riwayat transaksi akan muncul di sini setelah Anda berlangganan</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
