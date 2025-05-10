
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";
import { SubscriptionAnalytics } from "@/components/admin/SubscriptionAnalytics";
import { analyticsService } from "@/services/analyticsService";

export default function AdminPage() {
  const { organization, isAdmin, isSuperAdmin } = useOrganization();
  
  useEffect(() => {
    // Track admin panel view
    if (organization?.id) {
      analyticsService.trackEvent({
        eventType: "admin_panel_view",
        organizationId: organization.id
      });
    }
  }, [organization?.id]);
  
  // If not an admin, show error
  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please contact your organization administrator for access.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      
      <Tabs defaultValue="analytics">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <SubscriptionAnalytics />
        </TabsContent>
        <TabsContent value="user-management" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage your organization's users</CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management features will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Configure global settings for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Admin settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
