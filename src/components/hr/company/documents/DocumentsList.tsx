
import React, { useState, useEffect } from 'react';
import { documentService, CompanyDocument } from '@/services/companyDocumentService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Eye, Trash2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DocumentsListProps {
  filterType?: string;
  searchQuery?: string;
  onDocumentDeleted: () => void;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({ 
  filterType,
  searchQuery = "",
  onDocumentDeleted
}) => {
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        let docs: CompanyDocument[];
        
        if (filterType) {
          docs = await documentService.getDocumentsByType(filterType);
        } else {
          docs = await documentService.getAllCompanyDocuments();
        }
        
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [filterType]);

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.document_type.toLowerCase().includes(query) ||
      (doc.employeeName && doc.employeeName.toLowerCase().includes(query)) ||
      (doc.description && doc.description.toLowerCase().includes(query))
    );
  });

  const handlePreview = (document: CompanyDocument) => {
    window.open(document.file_url, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await documentService.deleteCompanyDocument(id);
        toast.success("Document deleted successfully");
        onDocumentDeleted();
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document");
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="flex justify-center p-6">Loading documents...</div>;
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">No documents found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchQuery 
            ? "No documents match your search criteria."
            : filterType 
              ? `No ${filterType} documents have been uploaded yet.` 
              : "No documents have been uploaded yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.name}</TableCell>
              <TableCell>{document.document_type}</TableCell>
              <TableCell>{document.employeeName}</TableCell>
              <TableCell>{formatDate(document.upload_date)}</TableCell>
              <TableCell>{formatFileSize(document.file_size)}</TableCell>
              <TableCell>
                <Badge variant={document.signed ? "success" : "default"}>
                  {document.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreview(document)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" 
                    onClick={() => window.open(document.file_url, '_blank')}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(document.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
