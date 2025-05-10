
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import KinerjaDashboardTab from "@/components/hr/kinerja/KinerjaDashboardTab";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function HRKinerja() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "settings", label: "Pengaturan" },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          {/* KPI Tabs */}
          <div className="flex space-x-1 border-b overflow-x-auto pb-px mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm transition-colors rounded-t-lg ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground border-b-2 border-primary font-medium"
                    : "hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {activeTab === "dashboard" && <KinerjaDashboardTab />}
          
          {activeTab === "settings" && (
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-medium mb-4">Pengaturan</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-md font-medium">Template Review</h3>
                  <p className="text-muted-foreground text-sm">Kelola template untuk berbagai jenis review kinerja</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <div className="font-medium">Standard Performance Review</div>
                      <div className="text-xs text-muted-foreground mt-1">Untuk evaluasi kinerja umum</div>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                    <div className="border rounded-md p-4">
                      <div className="font-medium">Leadership Review</div>
                      <div className="text-xs text-muted-foreground mt-1">Untuk evaluasi posisi manajerial</div>
                      <Button variant="outline" size="sm" className="mt-2">Edit</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-md font-medium">Kriteria Penilaian</h3>
                  <p className="text-muted-foreground text-sm">Atur kriteria dan bobot untuk review kinerja</p>
                  <Button variant="outline" size="sm">Kelola Kriteria</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-md font-medium">Notifikasi</h3>
                  <div className="flex items-center justify-between border rounded-md p-4">
                    <div>
                      <div className="font-medium">Pengingat Deadline Review</div>
                      <div className="text-sm text-muted-foreground">Kirim email 3 hari sebelum deadline</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
