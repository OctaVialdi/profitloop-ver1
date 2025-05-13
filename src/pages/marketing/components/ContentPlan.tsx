
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ContentPlan = () => {
  // Sample data for the content plan
  const contentItems = [
    { id: 1, title: 'Product Feature Video', platform: 'Instagram', date: '2025-05-15', status: 'Scheduled' },
    { id: 2, title: 'Customer Testimonial', platform: 'Facebook', date: '2025-05-17', status: 'Draft' },
    { id: 3, title: 'Industry News Update', platform: 'Twitter', date: '2025-05-18', status: 'In Review' },
    { id: 4, title: 'How-To Tutorial', platform: 'YouTube', date: '2025-05-20', status: 'Scheduled' },
    { id: 5, title: 'Product Launch Announcement', platform: 'LinkedIn', date: '2025-05-22', status: 'Approved' },
    { id: 6, title: 'Behind the Scenes', platform: 'Instagram', date: '2025-05-25', status: 'Draft' },
  ];

  return (
    <div className="p-4">
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {contentItems.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.platform} • {item.date}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                      item.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                      item.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
