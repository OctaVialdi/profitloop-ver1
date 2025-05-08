
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

export interface CompanyDocument {
  id: string;
  organization_id: string;
  name: string;
  file_type: string;
  file_url: string;
  file_size?: number;
  description?: string;
  document_type: string;
  upload_date: string;
  status: string;
  signed: boolean;
  version: string;
  employee_id?: string;
  employeeName?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export const documentTypes = [
  'Asset Agreement',
  'Reprimand Notice',
  'Return Receipt',
  'Condition Report',
  'Policy Document',
  'Contract',
  'Invoice',
  'Training Material',
  'Certificate',
  'Other'
];

export const documentService = {
  async getAllCompanyDocuments(): Promise<CompanyDocument[]> {
    try {
      const { data: documents, error } = await supabase
        .from('company_documents')
        .select(`
          *,
          employees (id, name)
        `)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error("Error fetching company documents:", error);
        toast.error("Failed to fetch company documents");
        throw error;
      }

      // Enhance documents with employee names
      return documents.map(doc => {
        // Check if doc.employees exists and is not an error
        const employeeName = doc.employees && typeof doc.employees === 'object' && 
                            !('error' in doc.employees) && 'name' in doc.employees 
                            ? doc.employees.name 
                            : 'Not Assigned';
        
        return {
          ...doc,
          employeeName
        };
      });
    } catch (error) {
      console.error("Error in getAllCompanyDocuments:", error);
      throw error;
    }
  },

  async getDocumentsByType(documentType: string): Promise<CompanyDocument[]> {
    try {
      const { data: documents, error } = await supabase
        .from('company_documents')
        .select(`
          *,
          employees (id, name)
        `)
        .eq('document_type', documentType)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error(`Error fetching documents of type ${documentType}:`, error);
        toast.error(`Failed to fetch ${documentType} documents`);
        throw error;
      }

      return documents.map(doc => {
        // Check if doc.employees exists and is not an error
        const employeeName = doc.employees && typeof doc.employees === 'object' && 
                            !('error' in doc.employees) && 'name' in doc.employees 
                            ? doc.employees.name 
                            : 'Not Assigned';
        
        return {
          ...doc,
          employeeName
        };
      });
    } catch (error) {
      console.error("Error in getDocumentsByType:", error);
      throw error;
    }
  },

  async uploadCompanyDocument(
    file: File,
    documentData: {
      name: string,
      document_type: string,
      description?: string,
      employee_id?: string,
      version?: string,
      signed?: boolean,
      tags?: string[]
    }
  ): Promise<CompanyDocument> {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      // Get current user's organization ID
      const { data: profileData, error: profileError } = await supabase.auth.getUser();
      if (profileError) {
        console.error("Error getting user profile:", profileError);
        toast.error("Failed to authenticate user");
        throw profileError;
      }

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', profileData.user.id)
        .single();

      if (userError || !userData) {
        console.error("Error getting user organization:", userError);
        toast.error("Failed to get user organization");
        throw userError || new Error("User organization not found");
      }
      
      const organization_id = userData.organization_id;

      // Generate a unique file path for storage
      const fileExtension = file.name.split('.').pop();
      const filePath = `${organization_id}/${uuidv4()}.${fileExtension}`;

      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company_documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        toast.error("Failed to upload document");
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('company_documents')
        .getPublicUrl(filePath);

      if (!urlData) {
        throw new Error("Failed to get public URL for uploaded file");
      }

      const fileUrl = urlData.publicUrl;

      // Create document record in the database
      const newDocument = {
        organization_id,
        name: documentData.name || file.name,
        file_type: file.type,
        file_url: fileUrl,
        file_size: file.size,
        document_type: documentData.document_type,
        description: documentData.description || null,
        employee_id: documentData.employee_id || null,
        signed: documentData.signed || false,
        version: documentData.version || 'v1.0',
        tags: documentData.tags || []
      };

      const { data: docData, error: docError } = await supabase
        .from('company_documents')
        .insert([newDocument])
        .select()
        .single();

      if (docError) {
        console.error("Error creating document record:", docError);
        toast.error("Failed to save document information");
        throw docError;
      }

      toast.success("Document uploaded successfully");
      return docData;
    } catch (error) {
      console.error("Error in uploadCompanyDocument:", error);
      throw error;
    }
  },

  async updateCompanyDocument(
    documentId: string, 
    updateData: Partial<CompanyDocument>
  ): Promise<CompanyDocument> {
    try {
      const { data, error } = await supabase
        .from('company_documents')
        .update(updateData)
        .eq('id', documentId)
        .select()
        .single();

      if (error) {
        console.error("Error updating document:", error);
        toast.error("Failed to update document");
        throw error;
      }

      toast.success("Document updated successfully");
      return data;
    } catch (error) {
      console.error("Error in updateCompanyDocument:", error);
      throw error;
    }
  },

  async deleteCompanyDocument(documentId: string): Promise<boolean> {
    try {
      // First, get the document to find the file path
      const { data: document, error: fetchError } = await supabase
        .from('company_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        console.error("Error fetching document for deletion:", fetchError);
        toast.error("Failed to fetch document for deletion");
        throw fetchError;
      }

      // Extract storage path from URL
      const fileUrl = document.file_url;
      const storagePath = fileUrl.split('company_documents/')[1];

      if (storagePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('company_documents')
          .remove([storagePath]);

        if (storageError) {
          console.error("Error deleting document file:", storageError);
          // Continue anyway to delete the database record
        }
      }

      // Delete database record
      const { error: deleteError } = await supabase
        .from('company_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        console.error("Error deleting document record:", deleteError);
        toast.error("Failed to delete document record");
        throw deleteError;
      }

      toast.success("Document deleted successfully");
      return true;
    } catch (error) {
      console.error("Error in deleteCompanyDocument:", error);
      throw error;
    }
  },

  async countDocumentsByType(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('company_documents')
        .select('document_type');

      if (error) {
        console.error("Error counting documents by type:", error);
        toast.error("Failed to count documents by type");
        throw error;
      }

      const counts: Record<string, number> = {};
      documentTypes.forEach(type => {
        counts[type] = 0;
      });

      data.forEach(doc => {
        if (counts[doc.document_type] !== undefined) {
          counts[doc.document_type]++;
        } else {
          counts[doc.document_type] = 1;
        }
      });

      return counts;
    } catch (error) {
      console.error("Error in countDocumentsByType:", error);
      throw error;
    }
  }
};
