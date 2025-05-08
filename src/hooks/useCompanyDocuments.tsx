
import { useState, useEffect, useCallback } from 'react';
import { documentService, CompanyDocument, documentTypes } from '@/services/companyDocumentService';
import { toast } from 'sonner';

export function useCompanyDocuments(initialType?: string) {
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<string | undefined>(initialType);
  const [counts, setCounts] = useState<Record<string, number>>({});
  
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let fetchedDocuments: CompanyDocument[];
      
      if (currentType) {
        fetchedDocuments = await documentService.getDocumentsByType(currentType);
      } else {
        fetchedDocuments = await documentService.getAllCompanyDocuments();
      }
      
      setDocuments(fetchedDocuments);
      
      // Update document counts
      const typeCounts = await documentService.countDocumentsByType();
      setCounts(typeCounts);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents");
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [currentType]);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  const uploadDocument = async (file: File, documentData: {
    name: string,
    document_type: string,
    description?: string,
    employee_id?: string,
    version?: string,
    signed?: boolean,
    tags?: string[]
  }) => {
    try {
      const result = await documentService.uploadCompanyDocument(file, documentData);
      toast.success("Document uploaded successfully");
      await fetchDocuments(); // Refresh the documents list
      return result;
    } catch (err) {
      console.error("Error uploading document:", err);
      toast.error("Failed to upload document");
      throw err;
    }
  };
  
  const deleteDocument = async (documentId: string) => {
    try {
      await documentService.deleteCompanyDocument(documentId);
      toast.success("Document deleted successfully");
      await fetchDocuments(); // Refresh the documents list
      return true;
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("Failed to delete document");
      return false;
    }
  };
  
  const updateDocument = async (documentId: string, updateData: Partial<CompanyDocument>) => {
    try {
      const result = await documentService.updateCompanyDocument(documentId, updateData);
      toast.success("Document updated successfully");
      await fetchDocuments(); // Refresh the documents list
      return result;
    } catch (err) {
      console.error("Error updating document:", err);
      toast.error("Failed to update document");
      throw err;
    }
  };
  
  return { 
    documents, 
    loading, 
    error, 
    fetchDocuments, 
    uploadDocument, 
    deleteDocument, 
    updateDocument,
    setCurrentType,
    currentType,
    counts,
    documentTypes
  };
}
