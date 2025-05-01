
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IncomeTarget() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Income Target</h2>
        <p className="text-muted-foreground">
          Set and track income targets for your organization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income Target Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Income target setting and tracking functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
