
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, FileText, Download, Check, X, Filter, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { documentService, CompanyDocument, documentTypes } from '@/services/companyDocumentService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UploadDocumentDialog from './documents/UploadDocumentDialog';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const FilesTab: React.FC = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all');
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  // Fetch the documents from the database
  const { 
    data: documents = [], 
    isLoading, 
    error,
    refetch: refetchDocuments 
  } = useQuery({
    queryKey: ['companyDocuments'],
    queryFn: documentService.getAllCompanyDocuments
  });

  // Fetch the document counts by type
  const { 
    data: documentCounts = {}, 
    refetch: refetchCounts 
  } = useQuery({
    queryKey: ['documentCounts'],
    queryFn: documentService.countDocumentsByType
  });

  // Get the file categories with counts
  const fileCategories = documentTypes.map(type => ({ 
    name: type,
    count: documentCounts[type] || 0,
    icon: <FileText className="h-5 w-5 text-purple-400" />
  }));

  // Filter the documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.employeeName && doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = documentTypeFilter === 'all' || doc.document_type === documentTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleDocumentDeleted = async () => {
    if (!documentToDelete) return;
    
    try {
      const success = await documentService.deleteCompanyDocument(documentToDelete);
      if (success) {
        refetchDocuments();
        refetchCounts();
        toast.success("Document deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleDocumentUploaded = () => {
    refetchDocuments();
    refetchCounts();
  };

  const handleDownloadDocument = (document: CompanyDocument) => {
    // Open the file URL in a new tab
    window.open(document.file_url, '_blank');
    toast.success(`Downloading ${document.name}`);
  };

  if (error) {
    return <div>Error loading documents. Please try again later.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Document Management</h2>
        <Button 
          className="gap-2"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card className="bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {fileCategories.map((category) => (
            <div 
              key={category.name} 
              className={`border rounded-md p-4 flex items-center space-x-4 cursor-pointer ${
                documentTypeFilter === category.name ? 'border-purple-400 bg-purple-50' : 'bg-white'
              }`}
              onClick={() => setDocumentTypeFilter(documentTypeFilter === category.name ? 'all' : category.name)}
            >
              <div className="bg-purple-100 p-2 rounded-md">
                {category.icon}
              </div>
              <div>
                <h3 className="text-gray-600">{category.name}</h3>
                <p className="font-medium">{category.count} files</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto">
          <Select
            value={documentTypeFilter}
            onValueChange={setDocumentTypeFilter}
          >
            <SelectTrigger className="w-[240px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="All Document Types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Document Types</SelectItem>
              {documentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Signed</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading documents...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchQuery || documentTypeFilter !== 'all' ? 
                    "No documents match your search criteria" : 
                    "No documents found. Upload your first document!"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredDocuments.map((document) => (
                <TableRow key={document.id} className="hover:bg-gray-50">
                  <TableCell className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="max-w-[250px] truncate" title={document.name}>
                      {document.name}
                    </span>
                  </TableCell>
                  <TableCell>{document.document_type}</TableCell>
                  <TableCell>{document.employeeName || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(document.upload_date), 'MM/dd/yyyy')}</TableCell>
                  <TableCell>
                    {document.signed ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 gap-1 flex items-center">
                        <Check className="h-3 w-3" />
                        Signed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 gap-1 flex items-center">
                        <X className="h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{document.version}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleDownloadDocument(document)}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit Document"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Document"
                        onClick={() => setDocumentToDelete(document.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Document Dialog */}
      {isUploadDialogOpen && (
        <UploadDocumentDialog 
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onDocumentUploaded={handleDocumentUploaded}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDocumentDeleted}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FilesTab;
