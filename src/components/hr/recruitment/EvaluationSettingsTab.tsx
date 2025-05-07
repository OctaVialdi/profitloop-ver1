
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryManager from "./evaluation-settings/CategoryManager";
import CriteriaManager from "./evaluation-settings/CriteriaManager";

export default function EvaluationSettingsTab() {
  const [activeTab, setActiveTab] = useState<string>("categories");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Evaluation Settings</h2>
      <p className="text-muted-foreground">
        Customize the categories and criteria used for evaluating candidates during the recruitment process.
      </p>
      
      <Tabs
        defaultValue="categories"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="criteria">
          <CriteriaManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
