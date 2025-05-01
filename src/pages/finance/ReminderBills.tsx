
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReminderBills() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reminder Bills</h2>
        <p className="text-muted-foreground">
          Manage upcoming bill payments and reminders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bill Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bill reminder functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
