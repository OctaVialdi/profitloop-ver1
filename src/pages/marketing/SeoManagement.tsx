
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SeoManagement = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">SEO Management</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Search Engine Optimization</CardTitle>
          <CardDescription>
            Monitor and improve your website's search engine performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will display SEO metrics, keyword rankings, and provide optimization suggestions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeoManagement;
