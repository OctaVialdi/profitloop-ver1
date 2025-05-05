import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  FileText, 
  Pencil,
  Trash2, 
  Search, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { EmployeeFile, fileService, fileTypes } from "@/services/fileService";
import { format } from "date-fns";
import { EmptyDataDisplay } from "../EmptyDataDisplay";
import { formatFileSize } from "@/utils/formatUtils";
import { EditFileDialog } from "./EditFileDialog";
import { DeleteFileDialog } from "./DeleteFileDialog";

interface FilesListProps {
  files: EmployeeFile[];
  employeeId: string;
  onFilesUpdated: () => void;
  isLoading?: boolean;
}

export const FilesList = ({ 
  files, 
  employeeId, 
  onFilesUpdated,
  isLoading = false
}: FilesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<EmployeeFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<EmployeeFile | null>(null);
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = fileTypeFilter ? file.file_type === fileTypeFilter : true;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (file: EmployeeFile) => {
    try {
      await fileService.downloadEmployeeFile(file.file_url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleEditClick = (file: EmployeeFile) => {
    setEditingFile(file);
  };
  
  const handleDeleteClick = (file: EmployeeFile) => {
    setDeletingFile(file);
  };

  const handleEditComplete = () => {
    setEditingFile(null);
    onFilesUpdated();
  };

  const handleDeleteComplete = () => {
    setDeletingFile(null);
    onFilesUpdated();
  };

  // Dummy function for EmptyDataDisplay
  const handleEdit = () => {
    // This is just a placeholder to satisfy the prop requirement
    // The actual action will be handled by the AddFile button in FilesSection
  };

  if (isLoading) {
    return (
      <div className="space-y-4 my-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <EmptyDataDisplay
        title="No files uploaded yet"
        description="Upload files for this employee using the 'Add File' button above."
        section="files"
        handleEdit={handleEdit}
        buttonText="Add File"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files..."
            className="pl-10 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {fileTypeFilter || "All File Types"} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFileTypeFilter(null)}>
              All File Types
            </DropdownMenuItem>
            {fileTypes.map(type => (
              <DropdownMenuItem 
                key={type} 
                onClick={() => setFileTypeFilter(type)}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">File Name</TableHead>
              <TableHead className="w-[15%]">Type</TableHead>
              <TableHead className="w-[12%]">Size</TableHead>
              <TableHead className="w-[15%]">Uploaded</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[13%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.map(file => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    <div>
                      <div>{file.name}</div>
                      {file.description && (
                        <div className="text-xs text-gray-500">{file.description}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{file.file_type}</TableCell>
                <TableCell>{file.file_size ? formatFileSize(file.file_size) : "-"}</TableCell>
                <TableCell>
                  {file.upload_date ? format(new Date(file.upload_date), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={file.status === 'active' ? 'outline' : 'secondary'}>
                    {file.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDownload(file)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditClick(file)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClick(file)}
                      title="Delete"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingFile && (
        <EditFileDialog
          file={editingFile}
          isOpen={!!editingFile}
          onClose={() => setEditingFile(null)}
          onSaved={handleEditComplete}
        />
      )}

      {deletingFile && (
        <DeleteFileDialog
          file={deletingFile}
          isOpen={!!deletingFile}
          onClose={() => setDeletingFile(null)}
          onDeleted={handleDeleteComplete}
        />
      )}
    </div>
  );
};
