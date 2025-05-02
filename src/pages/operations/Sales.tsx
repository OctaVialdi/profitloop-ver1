import { useOrganization } from "@/hooks/useOrganization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
export default function SalesPage() {
  const {
    organization
  } = useOrganization();
  return <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sales Operations</h2>
        <p className="text-muted-foreground">
          Sales management for {organization?.name || "your organization"}
        </p>
      </div>

      <div>
        <div className="mb-6">
          <Tabs defaultValue="activities" className="w-full">
            <TabsList>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="gamification">Gamification</TabsTrigger>
              <TabsTrigger value="okr">OKR System</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

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

      {/* New Section */}
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Sales Activities</h3>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Top Performers</h4>
                <div className="space-y-2">
                  {["Jane Doe", "John Smith", "Emily Johnson"].map((name, i) => <div key={name} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        <span>{name}</span>
                      </div>
                      <span className="font-medium">${78 - i * 12}K</span>
                    </div>)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Performance by Region</h4>
                <div className="space-y-2">
                  {[{
                  region: "North America",
                  revenue: "$120K",
                  growth: "+8%"
                }, {
                  region: "Europe",
                  revenue: "$85K",
                  growth: "+15%"
                }, {
                  region: "Asia Pacific",
                  revenue: "$45K",
                  growth: "+22%"
                }].map(item => <div key={item.region} className="flex items-center justify-between border-b pb-2">
                      <span>{item.region}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.revenue}</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          {item.growth}
                        </Badge>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              View Full Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
}