
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const KolManagement = () => {
  return (
    <div className="w-full min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">KOL Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Opinion Leaders Management</CardTitle>
          <CardDescription>
            Manage and track your KOL partnerships and campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will help you track influencer partnerships, campaigns and measure their effectiveness.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KolManagement;
