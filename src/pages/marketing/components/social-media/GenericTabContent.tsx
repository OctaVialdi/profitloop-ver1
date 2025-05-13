
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";

interface GenericTabContentProps {
  title: string;
}

const GenericTabContent: React.FC<GenericTabContentProps> = ({ title }) => {
  return (
    <Card className="w-full">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">
          This section will display content for the {title} tab.
        </p>
      </CardContent>
    </Card>
  );
};

export default GenericTabContent;
