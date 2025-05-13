
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import ContentPlan from "../../components/ContentPlan";

interface SubTabContentProps {
  activeSubTab: string;
}

const SubTabContent: React.FC<SubTabContentProps> = ({ activeSubTab }) => {
  switch (activeSubTab) {
    case "dashboard":
      return (
        <Card className="w-full">
          <CardHeader className="py-3">
            <CardTitle className="text-lg">Dashboard Content</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ContentPlan />
          </CardContent>
        </Card>
      );
    default:
      return (
        <Card className="w-full">
          <CardHeader className="py-3">
            <CardTitle className="text-lg">{activeSubTab} Content</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm text-muted-foreground">
              This section will display content for the {activeSubTab} tab.
            </p>
          </CardContent>
        </Card>
      );
  }
};

export default SubTabContent;
