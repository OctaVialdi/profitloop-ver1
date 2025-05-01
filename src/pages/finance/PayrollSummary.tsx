
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PayrollSummary() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Summary</h2>
        <p className="text-muted-foreground">
          Overview of your organization's payroll expenses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Payroll summary functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
