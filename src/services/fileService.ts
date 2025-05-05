
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmployeeFile {
  id: string;
  employee_id: string;
  name: string;
  file_type: string;
  file_url: string;
  file_size: number | null;
  description: string | null;
  upload_date: string;
  status: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface FileUploadData {
  employeeId: string;
  name: string;
  fileType: string;
  description?: string;
  status?: string;
  tags?: string[];
  file: File;
}

export interface FileUpdateData {
  id: string;
  name?: string;
  fileType?: string;
  description?: string;
  status?: string;
  tags?: string[];
}

export const fileTypes = [
  "Identity Card",
  "Resume/CV",
  "Certificate",
  "Contract",
  "Performance Review",
  "Recommendation Letter",
  "Medical Record",
  "Insurance Document",
  "Tax Document",
  "Other"
];

export const fileService = {
  async getEmployeeFiles(employeeId: string): Promise<EmployeeFile[]> {
    try {
      const { data, error } = await supabase
        .from('employee_files')
        .select('*')
        .eq('employee_id', employeeId)
        .order('upload_date', { ascending: false });

      if (error) {
        console.error("Error fetching employee files:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error in getEmployeeFiles:", error);
      throw error;
    }
  },

  async uploadEmployeeFile(uploadData: FileUploadData): Promise<EmployeeFile | null> {
    try {
      const { employeeId, name, fileType, description, status, tags, file } = uploadData;
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${employeeId}/${fileName}`;
      
      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('employee_files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('employee_files')
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) {
        throw new Error("Failed to get public URL for file");
      }

      // Insert record into database
      const { data: fileData, error: insertError } = await supabase
        .from('employee_files')
        .insert({
          employee_id: employeeId,
          name,
          file_type: fileType,
          file_url: publicUrl,
          file_size: file.size,
          description,
          status: status || 'active',
          tags,
          upload_date: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting file record:", insertError);
        // Try to delete the uploaded file if db insert fails
        await supabase.storage.from('employee_files').remove([filePath]);
        throw insertError;
      }

      return fileData;
    } catch (error) {
      console.error("Error in uploadEmployeeFile:", error);
      throw error;
    }
  },

  async updateEmployeeFile(updateData: FileUpdateData): Promise<EmployeeFile | null> {
    const { id, ...updateFields } = updateData;
    
    try {
      const { data, error } = await supabase
        .from('employee_files')
        .update({
          name: updateFields.name,
          file_type: updateFields.fileType,
          description: updateFields.description,
          status: updateFields.status,
          tags: updateFields.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating file:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in updateEmployeeFile:", error);
      throw error;
    }
  },

  async deleteEmployeeFile(id: string, fileUrl: string): Promise<boolean> {
    try {
      // First get the file path from the URL
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      const pathParts = pathname.split('/');
      const filePath = pathParts.slice(pathParts.length - 2).join('/');
      
      // Delete from database first
      const { error: deleteRecordError } = await supabase
        .from('employee_files')
        .delete()
        .eq('id', id);

      if (deleteRecordError) {
        console.error("Error deleting file record:", deleteRecordError);
        throw deleteRecordError;
      }

      // Then delete from storage
      const { error: deleteFileError } = await supabase.storage
        .from('employee_files')
        .remove([filePath]);

      if (deleteFileError) {
        console.error("Warning: File removed from database but failed to delete from storage:", deleteFileError);
        // Don't throw error here, as the record is already deleted
        toast.warning("File removed from database but may still exist in storage");
      }

      return true;
    } catch (error) {
      console.error("Error in deleteEmployeeFile:", error);
      throw error;
    }
  },

  async downloadEmployeeFile(fileUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const url = new URL(fileUrl);
      const pathname = url.pathname;
      const pathParts = pathname.split('/');
      const filePath = pathParts.slice(pathParts.length - 2).join('/');
      
      // Get the download URL
      const { data, error } = await supabase.storage
        .from('employee_files')
        .download(filePath);

      if (error) {
        console.error("Error downloading file:", error);
        throw error;
      }

      // Create a download link
      const blob = new Blob([data]);
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = pathParts[pathParts.length - 1]; // Use the filename as the download name
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error in downloadEmployeeFile:", error);
      throw error;
    }
  }
};
