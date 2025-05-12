import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const CreateContent = () => {
  return (
    <Card className="w-full h-full overflow-hidden border-none shadow-none">
      {/* First Section */}
      <section className="p-4 border-b">
        <h2 className="text-lg font-medium">Section 1</h2>
        <div className="mt-2">
          {/* Content for section 1 will go here */}
        </div>
      </section>

      {/* Second Section */}
      <section className="p-4">
        <h2 className="text-lg font-medium">Section 2</h2>
        <div className="mt-2">
          {/* Content for section 2 will go here */}
        </div>
      </section>
    </Card>
  );
};

export default CreateContent;
