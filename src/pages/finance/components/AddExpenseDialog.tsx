
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, SlidersHorizontal, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Define data for dropdown options
const expenseCategories = [
  "Office Supplies",
  "Equipment",
  "Utilities",
  "Rent",
  "Salaries",
  "Advertising",
  "Travel",
  "Software",
  "Maintenance",
  "Insurance",
  "Other"
];

const departments = [
  "General",
  "IT",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "HR"
];

const expenseTypes = [
  "Fixed",
  "Variable",
  "Operational"
];

const recurringFrequencies = [
  "Monthly",
  "Quarterly",
  "Yearly"
];

const AddExpenseDialog: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [expenseType, setExpenseType] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and format as needed
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(value);
  };

  const handleSubmit = () => {
    // Validate form
    if (!date || !amount || !category || !department || !expenseType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // If recurring is checked, frequency is required
    if (isRecurring && !recurringFrequency) {
      toast({
        title: "Validation Error",
        description: "Please select a recurring frequency",
        variant: "destructive",
      });
      return;
    }

    // Form data to be submitted
    const formData = {
      date,
      amount: Number(amount),
      category,
      description,
      department,
      expenseType,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null
    };

    // Submit expense (in a real app, this would be an API call)
    console.log("Expense submitted:", formData);
    
    // Show success message
    toast({
      title: "Expense Added",
      description: "Your expense has been added successfully",
    });
    
    // Reset form and close dialog
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setDate(new Date());
    setAmount("");
    setCategory("");
    setDescription("");
    setDepartment("");
    setExpenseType("");
    setIsRecurring(false);
    setRecurringFrequency("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#8B5CF6] hover:bg-[#7c4ff1]">Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Expense</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Date and Amount row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date picker */}
            <div className="space-y-2">
              <label className="text-base font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-[50px]",
                      !date && "text-muted-foreground"
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
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label className="text-base font-medium">Amount (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-[14px] text-gray-500">$</span>
                <Input 
                  type="text"
                  className="pl-8 h-[50px]" 
                  value={amount} 
                  onChange={handleAmountChange}
                  placeholder="0" 
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-base font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-[50px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <label className="text-base font-medium">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-[50px]">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expense Type */}
            <div className="space-y-2">
              <label className="text-base font-medium">Expense Type</label>
              <Select value={expenseType} onValueChange={setExpenseType}>
                <SelectTrigger className="h-[50px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recurring Expense
              </label>
            </div>
            <p className="text-sm text-muted-foreground">This expense repeats at regular intervals</p>
          </div>

          {/* Recurring Frequency - only show when recurring is checked */}
          {isRecurring && (
            <div className="space-y-2">
              <label className="text-base font-medium">Recurring Frequency</label>
              <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                <SelectTrigger className="h-[50px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {recurringFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            className="h-[60px] bg-[#8B5CF6] hover:bg-[#7c4ff1] mt-4" 
            onClick={handleSubmit}
          >
            Add Expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
