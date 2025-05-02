
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SeoManagement = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">SEO Management</h1>
      
      <Card>
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
