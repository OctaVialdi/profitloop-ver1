
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus } from "lucide-react";
import { evaluationService, StatusOption } from "@/services/evaluationService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface StatusManagerProps {
  onStatusesChanged: () => void;
}

export const StatusManager: React.FC<StatusManagerProps> = ({ onStatusesChanged }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [newStatus, setNewStatus] = useState({ value: "", label: "" });
  const [editingStatus, setEditingStatus] = useState<StatusOption | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StatusOption | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch statuses when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      fetchStatuses();
    }
  }, [isDialogOpen]);

  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const options = await evaluationService.fetchCandidateStatusOptions();
      setStatuses(options);
    } catch (error) {
      console.error("Error fetching status options:", error);
      toast.error("Failed to load status options");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStatus = async () => {
    setFormError("");

    // Validate inputs
    if (!newStatus.label.trim()) {
      setFormError("Status label is required");
      return;
    }

    // Set value based on label if not provided
    const statusToAdd = {
      ...newStatus,
      value: newStatus.value.trim() || newStatus.label.toLowerCase().replace(/\s+/g, '_'),
      label: newStatus.label.trim()
    };

    // Check for duplicates
    const isDuplicate = statuses.some(
      s => s.value === statusToAdd.value || s.label.toLowerCase() === statusToAdd.label.toLowerCase()
    );

    if (isDuplicate) {
      setFormError("A status with this name or value already exists");
      return;
    }

    setIsLoading(true);
    try {
      const result = await evaluationService.createStatusOption(statusToAdd);
      if (result.success) {
        toast.success("Status option added successfully");
        setNewStatus({ value: "", label: "" });
        fetchStatuses();
        onStatusesChanged();
      } else {
        toast.error("Failed to add status option");
        setFormError(result.error?.message || "An unknown error occurred");
      }
    } catch (error) {
      console.error("Error adding status:", error);
      toast.error("Failed to add status option");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStatus = (status: StatusOption) => {
    setEditingStatus(status);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    setFormError("");

    if (!editingStatus) return;

    // Validate inputs
    if (!editingStatus.label.trim()) {
      setFormError("Status label is required");
      return;
    }

    setIsLoading(true);
    try {
      if (!editingStatus.id) {
        throw new Error("Status ID is missing");
      }

      const result = await evaluationService.updateStatusOption(
        editingStatus.id,
        {
          value: editingStatus.value,
          label: editingStatus.label
        }
      );

      if (result.success) {
        toast.success("Status option updated successfully");
        setIsEditDialogOpen(false);
        fetchStatuses();
        onStatusesChanged();
      } else {
        toast.error("Failed to update status option");
        setFormError(result.error?.message || "An unknown error occurred");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status option");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (status: StatusOption) => {
    setDeleteTarget(status);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;

    setIsLoading(true);
    try {
      const result = await evaluationService.deleteStatusOption(deleteTarget.id, deleteTarget.value);
      if (result.success) {
        toast.success("Status option deleted successfully");
        setIsDeleteDialogOpen(false);
        fetchStatuses();
        onStatusesChanged();
      } else {
        if (result.inUse) {
          toast.error("Cannot delete a status that is currently in use");
        } else {
          toast.error("Failed to delete status option");
        }
      }
    } catch (error) {
      console.error("Error deleting status:", error);
      toast.error("Failed to delete status option");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Manage Status Options
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Status Options</DialogTitle>
            <DialogDescription>
              Add, edit, or remove candidate status options.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add New Status</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="statusLabel">Status Label</Label>
                  <Input
                    id="statusLabel"
                    placeholder="e.g. Second Interview"
                    value={newStatus.label}
                    onChange={(e) => setNewStatus({ ...newStatus, label: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="statusValue">
                    Status Value <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="statusValue"
                    placeholder="e.g. second_interview"
                    value={newStatus.value}
                    onChange={(e) => setNewStatus({ ...newStatus, value: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave blank to generate automatically from label
                  </p>
                </div>

                {formError && (
                  <p className="text-sm text-destructive">{formError}</p>
                )}

                <Button 
                  onClick={handleAddStatus} 
                  disabled={isLoading || !newStatus.label.trim()}
                  className="w-full"
                >
                  Add Status
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Status Options</h3>
              <ScrollArea className="h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading...</p>
                  </div>
                ) : statuses.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No status options found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {statuses.map((status) => (
                      <div key={status.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{status.label}</span>
                          <span className="text-xs text-muted-foreground">({status.value})</span>
                          {status.is_system && (
                            <Badge variant="secondary" className="text-xs">System</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStatus(status)}
                            disabled={status.is_system}
                            title={status.is_system ? "System statuses cannot be edited" : "Edit status"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(status)}
                            disabled={status.is_system}
                            title={status.is_system ? "System statuses cannot be deleted" : "Delete status"}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Status Option</DialogTitle>
            <DialogDescription>
              Update the status label and value.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="editStatusLabel">Status Label</Label>
              <Input
                id="editStatusLabel"
                value={editingStatus?.label || ""}
                onChange={(e) => editingStatus && setEditingStatus({...editingStatus, label: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="editStatusValue">Status Value</Label>
              <Input
                id="editStatusValue"
                value={editingStatus?.value || ""}
                onChange={(e) => editingStatus && setEditingStatus({...editingStatus, value: e.target.value})}
              />
            </div>

            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the status option 
              "{deleteTarget?.label}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
