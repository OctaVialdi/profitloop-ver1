
import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, SlidersHorizontal, Check, Upload, Camera, Image } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const orientationOptions = [
  "Portrait",
  "Landscape"
];

const imageQualityOptions = [
  "Standard",
  "High Quality"
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
  const [activeTab, setActiveTab] = useState<string>("upload"); // "upload" or "capture"
  const [orientation, setOrientation] = useState<string>("Portrait");
  const [imageQuality, setImageQuality] = useState<string>("Standard");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and format as needed
    const value = e.target.value.replace(/[^\d]/g, "");
    setAmount(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setReceiptFile(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartCamera = () => {
    // In a real app, this would trigger device camera
    toast({
      title: "Camera Feature",
      description: "Camera functionality would be implemented in a production environment",
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
      recurringFrequency: isRecurring ? recurringFrequency : null,
      receiptFile
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
    setReceiptFile(null);
    setPreviewUrl(null);
    setOrientation("Portrait");
    setImageQuality("Standard");
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

          {/* Receipt Upload Section */}
          <div className="space-y-4 border rounded-lg p-6">
            <div>
              <h3 className="text-xl font-semibold">Receipt Upload</h3>
              <p className="text-gray-500 mt-1">Upload receipt images for expense verification</p>
            </div>

            {/* Upload/Capture Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="flex items-center gap-2 py-3">
                  <Upload className="h-5 w-5" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="capture" className="flex items-center gap-2 py-3">
                  <Camera className="h-5 w-5" />
                  Mobile Capture
                </TabsTrigger>
              </TabsList>

              {/* Upload Tab Content */}
              <TabsContent value="upload" className="space-y-4">
                {/* Orientation and Image Quality options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium">Orientation</label>
                    <Select value={orientation} onValueChange={setOrientation}>
                      <SelectTrigger className="h-[50px]">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        {orientationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === orientation && (
                              <Check className="h-4 w-4 mr-2 inline" />
                            )}
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-base font-medium">Image Quality</label>
                    <Select value={imageQuality} onValueChange={setImageQuality}>
                      <SelectTrigger className="h-[50px]">
                        <SelectValue placeholder="Select image quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageQualityOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === imageQuality && (
                              <Check className="h-4 w-4 mr-2 inline" />
                            )}
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Drag and Drop Area */}
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer h-64",
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
                    previewUrl ? "p-2" : "p-6"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  
                  {previewUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Receipt preview" 
                        className="max-h-full max-w-full object-contain" 
                      />
                      <p className="mt-2 text-sm text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium">Upload Receipt</h3>
                      <p className="text-gray-500 mt-1">Drag and drop or click to browse files</p>
                      <Button 
                        className="mt-4"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileInput();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Capture Tab Content */}
              <TabsContent value="capture" className="space-y-4">
                {/* Orientation and Image Quality options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium">Orientation</label>
                    <Select value={orientation} onValueChange={setOrientation}>
                      <SelectTrigger className="h-[50px]">
                        <SelectValue placeholder="Select orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        {orientationOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === orientation && (
                              <Check className="h-4 w-4 mr-2 inline" />
                            )}
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-base font-medium">Image Quality</label>
                    <Select value={imageQuality} onValueChange={setImageQuality}>
                      <SelectTrigger className="h-[50px]">
                        <SelectValue placeholder="Select image quality" />
                      </SelectTrigger>
                      <SelectContent>
                        {imageQualityOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === imageQuality && (
                              <Check className="h-4 w-4 mr-2 inline" />
                            )}
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Camera Capture Area */}
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64">
                  {previewUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Receipt preview" 
                        className="max-h-full max-w-full object-contain" 
                      />
                      <Button 
                        variant="outline"
                        className="mt-4"
                        onClick={() => setPreviewUrl(null)}
                      >
                        Retake Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <Camera className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium">Capture Receipt</h3>
                      <p className="text-gray-500 mt-1">Use your device's camera to take a photo of the receipt</p>
                      <Button 
                        className="mt-4 bg-purple-500 hover:bg-purple-600"
                        onClick={handleStartCamera}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
