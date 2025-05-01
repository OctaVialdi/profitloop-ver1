
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Expenses() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <p className="text-muted-foreground">
          Manage and track your organization's expenses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Expense tracking functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
