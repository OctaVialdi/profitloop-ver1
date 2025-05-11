
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateContent() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Create Social Media Content</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Create and schedule your social media content from this page.
          </p>
          
          <div className="p-6 border rounded-lg bg-gray-50 flex flex-col items-center justify-center">
            <div className="text-5xl mb-2">📝</div>
            <h3 className="text-lg font-medium mb-2">Start Creating Content</h3>
            <p className="text-center text-muted-foreground mb-4">
              Plan, create, and schedule your social media posts across multiple platforms
            </p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              New Content
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
