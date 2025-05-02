
import { useOrganization } from "@/hooks/useOrganization";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const SalesHeader = () => {
  const { organization } = useOrganization();
  
  return (
    <>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales Operations</h2>
        <p className="text-muted-foreground">
          Sales management for {organization?.name || "your organization"}
        </p>
      </div>

      <div>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Revenue Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <div className="flex items-center mt-2">
                <h3 className="text-3xl font-bold">$250K</h3>
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                  +12%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Closing Rate Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Closing Rate</p>
              <h3 className="text-3xl font-bold mt-2">35%</h3>
            </CardContent>
          </Card>

          {/* Average Deal Size Card */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Avg. Deal Size</p>
              <h3 className="text-3xl font-bold mt-2">$12K</h3>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Target Progress */}
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Monthly Target Progress</p>
              <p className="text-sm font-medium">$300K / $500K</p>
            </div>
            <Progress value={60} className="h-2 mb-4" />
            <div className="flex justify-between text-sm">
              <p>Top Performer: Jane Doe</p>
              <p>$78K revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

interface CardContentProps {
  children: React.ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => (
  <div className="pt-6">
    {children}
  </div>
);
