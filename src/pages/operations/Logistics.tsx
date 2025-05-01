
import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogisticsPage() {
  const { organization } = useOrganization();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Logistics</h2>
        <p className="text-muted-foreground">
          Logistics management for {organization?.name || "your organization"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logistics Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Logistics content will appear here</p>
        </CardContent>
      </Card>
    </div>
  );
}
