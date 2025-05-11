
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Marketing Settings</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p>Marketing settings page content will go here.</p>
      </CardContent>
    </Card>
  );
}
