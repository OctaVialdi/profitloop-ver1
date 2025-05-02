
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SocialMediaManagement = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Social Media Management</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Social Media Management</CardTitle>
          <CardDescription>
            Manage your social media accounts and analyze performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will provide tools to manage your social media presence and analytics across platforms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaManagement;
