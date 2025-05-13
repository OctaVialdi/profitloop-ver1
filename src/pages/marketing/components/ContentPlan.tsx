
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentTable from "./ContentTable";

export default function ContentPlan() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Content Plan</h2>
        <p className="text-muted-foreground">
          Manage and track all your content initiatives in one place.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="p-0">
          <ContentTable />
        </TabsContent>
        
        <TabsContent value="upcoming" className="p-0">
          <ContentTable />
        </TabsContent>
        
        <TabsContent value="in-progress" className="p-0">
          <ContentTable />
        </TabsContent>
        
        <TabsContent value="completed" className="p-0">
          <ContentTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
