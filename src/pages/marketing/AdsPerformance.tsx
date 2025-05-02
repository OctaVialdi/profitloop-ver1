
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdsPerformance = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Ads Performance</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ads Performance Dashboard</CardTitle>
          <CardDescription>
            Monitor and optimize your advertising campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display performance metrics for your advertising campaigns across various platforms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsPerformance;
