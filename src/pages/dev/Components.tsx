
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { Separator } from "@/components/ui/separator";

const Components = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Component Library</h1>
        <p className="text-muted-foreground">
          Explore and test UI components used throughout the application.
        </p>
      </div>
      
      <BreadcrumbNav 
        customLabels={{ 
          "dev": "Developer Tools",
          "components": "Component Library"
        }} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forms">Form Components</TabsTrigger>
          <TabsTrigger value="display">Display Components</TabsTrigger>
          <TabsTrigger value="navigation">Navigation Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Component Library</CardTitle>
              <CardDescription>
                This page provides a showcase of UI components for developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Browse through the tabs to explore different categories of components.
                Each component includes examples and usage information.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge>shadcn/ui</Badge>
                <Badge variant="outline">React</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>Input fields, selects, and controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setActiveTab("forms")}>Explore</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Display Components</CardTitle>
                <CardDescription>Cards, modals, and content display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setActiveTab("display")}>Explore</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Navigation Components</CardTitle>
                <CardDescription>Navigation, breadcrumbs, and menus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setActiveTab("navigation")}>Explore</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>
                Input controls for user data entry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Inputs</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-input">Default Input</Label>
                    <Input id="default-input" placeholder="Enter text..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disabled-input">Disabled Input</Label>
                    <Input id="disabled-input" placeholder="Disabled input" disabled />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Select</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-select">Default Select</Label>
                    <Select>
                      <SelectTrigger id="default-select">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Buttons</h3>
                <Separator />
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Components</CardTitle>
              <CardDescription>
                Components for displaying content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Cards</h3>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Example Card</CardTitle>
                      <CardDescription>Card description text</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>This is an example card component with content.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Badges</h3>
                <Separator />
                <div className="flex flex-wrap gap-2 pt-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Components</CardTitle>
              <CardDescription>
                Components for navigation and user flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Breadcrumbs</h3>
                <Separator />
                <div className="pt-4">
                  <BreadcrumbNav 
                    customLabels={{ 
                      "components": "Breadcrumb Example",
                    }} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Tabs</h3>
                <Separator />
                <div className="pt-4">
                  <Tabs defaultValue="tab1" className="w-full">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
                      Tab 1 content
                    </TabsContent>
                    <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
                      Tab 2 content
                    </TabsContent>
                    <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
                      Tab 3 content
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Components;
