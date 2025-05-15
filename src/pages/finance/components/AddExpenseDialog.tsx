
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X, Check, Plus, Upload, Users, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: () => void;
  categories: {
    id: string;
    name: string;
  }[];
  departments: string[];
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onExpenseAdded,
  categories,
  departments = []
}: AddExpenseDialogProps) {
  // Get organization context
  const { organization } = useOrganization();
  
  // Form state
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [categoryId, setCategoryId] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("monthly");
  const [expenseType, setExpenseType] = useState<string>("operational");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [showNewCategory, setShowNewCategory] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(false);
  
  // Constants
  const expenseTypes = ["operational", "capital", "marketing", "administrative"];
  const recurringFrequencies = ["daily", "weekly", "bi-weekly", "monthly", "quarterly", "yearly"];

  // Reset form on dialog close
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Form reset function
  const resetForm = () => {
    setDescription("");
    setAmount(0);
    setDate(new Date());
    setCategoryId("");
    setDepartment("");
    setIsRecurring(false);
    setRecurringFrequency("monthly");
    setExpenseType("operational");
    setNewCategoryName("");
    setShowNewCategory(false);
    setReceipt(null);
    setReceiptPreview(null);
    setValidationErrors({});
  };

  // Handle receipt upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceipt(file);
      
      // Create preview URL
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setReceiptPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Non-image file (like PDF)
        setReceiptPreview(null);
      }
    }
  };

  // Remove receipt
  const removeReceipt = () => {
    setReceipt(null);
    setReceiptPreview(null);
  };

  // Handle adding new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setValidationErrors({
        ...validationErrors,
        category: 'Category name cannot be empty'
      });
      return;
    }

    try {
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }

      const { data: existingCategory, error: checkError } = await supabase
        .from("expense_categories")
        .select("*")
        .eq("name", newCategoryName)
        .eq("organization_id", organization.id)
        .maybeSingle();

      if (checkError) throw checkError;
      
      // Return existing category if it already exists
      if (existingCategory) {
        setCategoryId(existingCategory.id);
        setShowNewCategory(false);
        return;
      }

      const { data, error } = await supabase
        .from("expense_categories")
        .insert([
          {
            name: newCategoryName,
            organization_id: organization.id,
          },
        ])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        setCategoryId(data[0].id);
        onExpenseAdded(); // Refresh categories
        setShowNewCategory(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const errors: {[key: string]: string} = {};
    
    if (!date) errors.date = "Date is required";
    if (amount <= 0) errors.amount = "Amount must be greater than 0";
    if (!categoryId) errors.category = "Category is required";
    if (!department) errors.department = "Department is required";
    if (!expenseType) errors.expenseType = "Expense type is required";
    if (isRecurring && !recurringFrequency) errors.recurringFrequency = "Frequency is required";
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!organization?.id) {
        throw new Error("No organization ID found");
      }
      
      // Upload receipt if provided
      let receiptUrl = null;
      let receiptPath = null;

      if (receipt) {
        try {
          // This would need actual implementation for file upload
          // For now we'll just simulate a successful upload
          receiptUrl = "https://example.com/receipt.jpg";
          receiptPath = "receipts/receipt.jpg";
        } catch (uploadError: any) {
          toast({
            title: "Upload Error",
            description: "Failed to upload receipt, but continuing with expense submission",
            variant: "destructive",
          });
        }
      }

      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      // Format date to string for database
      const formattedDate = date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
      
      // Insert expense record
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          amount,
          date: formattedDate,
          category_id: categoryId,
          description,
          department,
          expense_type: expenseType,
          is_recurring: isRecurring,
          recurring_frequency: isRecurring ? recurringFrequency : null,
          receipt_url: receiptUrl,
          receipt_path: receiptPath,
          organization_id: organization.id,
          created_by: user.id
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Expense Added",
        description: "Your expense has been added successfully",
      });

      onExpenseAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Expense</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Date and Amount row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date picker */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Date<span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-[50px]",
                      !date && "text-muted-foreground",
                      validationErrors.date && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? format(date, "PPP") : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      if (date) {
                        setDate(date);
                        setValidationErrors({...validationErrors, date: ''});
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {validationErrors.date && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.date}</p>
              )}
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Amount (Rp)<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-[14px] text-gray-500">Rp</span>
                <Input 
                  type="text"
                  className={cn(
                    "pl-8 h-[50px]",
                    validationErrors.amount && "border-red-500"
                  )}
                  value={amount} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, "");
                    setAmount(Number(value));
                  }}
                  placeholder="0" 
                />
              </div>
              {validationErrors.amount && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.amount}</p>
              )}
            </div>
          </div>

          {/* Receipt upload section */}
          <div className="space-y-2">
            <label className="text-base font-medium">Receipt</label>
            <div className="border border-dashed border-gray-300 rounded-md p-4">
              {receiptPreview ? (
                <div className="relative">
                  <img 
                    src={receiptPreview} 
                    alt="Receipt preview" 
                    className="max-h-[150px] mx-auto rounded-md object-contain" 
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-8 w-8 p-0"
                    onClick={removeReceipt}
                  >
                    ×
                  </Button>
                </div>
              ) : receipt && !receiptPreview ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="bg-gray-100 rounded-md p-4 text-center">
                    <p className="font-medium">{receipt.name}</p>
                    <p className="text-xs text-gray-500">{(receipt.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={removeReceipt}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload receipt image</p>
                  <label className="cursor-pointer">
                    <span className="bg-[#8B5CF6] text-white px-4 py-2 rounded-md text-sm hover:bg-[#7c4ff1]">
                      Select File
                    </span>
                    <Input 
                      type="file" 
                      className="hidden" 
                      onChange={handleReceiptUpload}
                      accept="image/*,application/pdf"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Max file size: 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Category with add new option */}
          <div className="space-y-2">
            <label className="text-base font-medium">
              Category<span className="text-red-500">*</span>
            </label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <Input 
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  className="h-[50px]"
                />
                <Button onClick={handleAddCategory} className="h-[50px]">
                  <Check className="mr-1 h-4 w-4" /> Save
                </Button>
                <Button variant="ghost" onClick={() => setShowNewCategory(false)} className="h-[50px]">
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Select 
                    value={categoryId} 
                    onValueChange={(value) => {
                      setCategoryId(value);
                      setValidationErrors({...validationErrors, category: ''});
                    }}
                  >
                    <SelectTrigger className={cn(
                      "h-[50px] flex-1",
                      validationErrors.category && "border-red-500"
                    )}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>No categories found</SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowNewCategory(true)} className="h-[50px] px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            {validationErrors.category && (
              <p className="text-xs text-red-500 mt-1">{validationErrors.category}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-base font-medium">Description</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </span>
              <Textarea 
                className="pl-10 min-h-[160px]" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter expense description" 
              />
            </div>
          </div>

          {/* Department and Expense Type row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Department<span className="text-red-500">*</span>
              </label>
              <Select 
                value={department} 
                onValueChange={(value) => {
                  setDepartment(value);
                  setValidationErrors({...validationErrors, department: ''});
                }}
              >
                <SelectTrigger className={cn(
                  "h-[50px]",
                  validationErrors.department && "border-red-500"
                )}>
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentsLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : departments.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-departments" disabled>No departments found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {validationErrors.department && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.department}</p>
              )}
            </div>

            {/* Expense Type */}
            <div className="space-y-2">
              <label className="text-base font-medium">
                Expense Type<span className="text-red-500">*</span>
              </label>
              <Select 
                value={expenseType} 
                onValueChange={(value) => {
                  setExpenseType(value);
                  setValidationErrors({...validationErrors, expenseType: ''});
                }}
              >
                <SelectTrigger className={cn(
                  "h-[50px]",
                  validationErrors.expenseType && "border-red-500"
                )}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.expenseType && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.expenseType}</p>
              )}
            </div>
          </div>

          {/* Recurring Expense */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                className="h-5 w-5 data-[state=checked]:bg-[#8B5CF6]" 
                checked={isRecurring} 
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)} 
              />
              <label 
                htmlFor="recurring" 
                className="text-base font-medium leading-none cursor-pointer"
              >
                Recurring Expense
              </label>
            </div>
            <p className="text-sm text-muted-foreground">This expense repeats at regular intervals</p>
          </div>

          {/* Recurring Frequency - only show when recurring is checked */}
          {isRecurring && (
            <div className="space-y-2">
              <label className="text-base font-medium">
                Recurring Frequency<span className="text-red-500">*</span>
              </label>
              <Select 
                value={recurringFrequency} 
                onValueChange={(value) => {
                  setRecurringFrequency(value);
                  setValidationErrors({...validationErrors, recurringFrequency: ''});
                }}
              >
                <SelectTrigger className={cn(
                  "h-[50px]",
                  validationErrors.recurringFrequency && "border-red-500"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {recurringFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.recurringFrequency && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.recurringFrequency}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <DialogFooter>
            <Button 
              className="h-[60px] bg-[#8B5CF6] hover:bg-[#7c4ff1] mt-4" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddExpenseDialog;
