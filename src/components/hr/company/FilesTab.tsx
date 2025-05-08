
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, FileText, Search, Filter, Download } from "lucide-react";
import { UploadDocumentDialog } from "./documents/UploadDocumentDialog";
import { DocumentsList } from "./documents/DocumentsList";
import { useCompanyDocuments } from "@/hooks/useCompanyDocuments";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const FilesTab = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    documents, 
    loading, 
    currentType, 
    setCurrentType, 
    fetchDocuments,
    documentTypes,
    counts
  } = useCompanyDocuments();

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Company Documents</CardTitle>
        <Button className="ml-4" onClick={() => setIsUploadDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export List
            </Button>
          </div>
        </div>
      
        <Tabs 
          value={currentType || "all"} 
          onValueChange={(value) => setCurrentType(value === "all" ? undefined : value)}
          className="w-full"
        >
          <TabsList className="w-full h-auto flex-wrap mb-6 gap-2">
            <TabsTrigger value="all" className="flex items-center">
              All
              <Badge variant="outline" className="ml-2">{documents.length}</Badge>
            </TabsTrigger>
            {documentTypes.map(type => (
              <TabsTrigger key={type} value={type} className="flex items-center">
                {type}
                <Badge variant="outline" className="ml-2">{counts[type] || 0}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <DocumentsList 
            filterType={currentType}
            searchQuery={searchQuery}
            onDocumentDeleted={fetchDocuments} 
          />
        </Tabs>
        
        <UploadDocumentDialog 
          isOpen={isUploadDialogOpen} 
          onClose={() => setIsUploadDialogOpen(false)}
          onDocumentUploaded={() => {
            fetchDocuments();
            setIsUploadDialogOpen(false);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default FilesTab;
