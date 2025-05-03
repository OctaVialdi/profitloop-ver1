
import { ReactNode } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function MyInfoLayout() {
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('id');
  
  return (
    <div className="w-full space-y-4">
      <Card className="p-6">
        <Outlet context={{ employeeId }} />
      </Card>
    </div>
  );
}
