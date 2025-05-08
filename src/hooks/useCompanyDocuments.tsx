
import { useState, useEffect, useCallback } from 'react';
import { documentService, CompanyDocument, documentTypes } from '@/services/companyDocumentService';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useCompanyDocuments(initialType?: string) {
  const [currentType, setCurrentType] = useState<string | undefined>(initialType);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();
  
  // Use React Query for better caching and state management
  const { 
    data: documents = [], 
    isLoading: loading, 
    error,
    refetch: fetchDocuments
  } = useQuery({
    queryKey: ['companyDocuments', currentType],
    queryFn: async () => {
      try {
        if (currentType) {
          return await documentService.getDocumentsByType(currentType);
        } else {
          return await documentService.getAllCompanyDocuments();
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        toast.error("Failed to load documents");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes before data becomes stale
  });

  // Get document counts by type
  const { data: typeCounts = {} } = useQuery({
    queryKey: ['documentCounts'],
    queryFn: async () => {
      try {
        return await documentService.countDocumentsByType();
      } catch (err) {
        console.error("Error counting documents:", err);
        return {};
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update counts when typeCounts changes
  useEffect(() => {
    setCounts(typeCounts);
  }, [typeCounts]);
  
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
      
      // Invalidate relevant queries to update data
      queryClient.invalidateQueries({ queryKey: ['companyDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['documentCounts'] });
      
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
      
      // Invalidate relevant queries to update data
      queryClient.invalidateQueries({ queryKey: ['companyDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['documentCounts'] });
      
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
      
      // Invalidate relevant queries to update data
      queryClient.invalidateQueries({ queryKey: ['companyDocuments'] });
      
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
