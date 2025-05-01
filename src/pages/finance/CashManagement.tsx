
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CashManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cash Management</h2>
        <p className="text-muted-foreground">
          Manage cash flow and financial resources
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cash management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
