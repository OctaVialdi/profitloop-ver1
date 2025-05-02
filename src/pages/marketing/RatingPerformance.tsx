
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const RatingPerformance = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Rating Performance</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rating & Reviews Management</CardTitle>
          <CardDescription>
            Monitor and respond to customer ratings and reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display metrics about your customer ratings and reviews across various platforms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingPerformance;
