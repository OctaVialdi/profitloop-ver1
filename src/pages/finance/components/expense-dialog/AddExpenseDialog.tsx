
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  DateAmountSection,
  ReceiptUploadSection,
  CategorySection,
  DescriptionSection,
  DepartmentTypeSection,
  RecurringSection
} from "./";
import { useExpenseForm } from "./hooks/useExpenseForm";
import { DialogFooter } from "./components/DialogFooter";

const AddExpenseDialog: React.FC = () => {
  const {
    formState,
    formSetters,
    formHandlers,
    isOpen,
    setIsOpen,
    isSubmitting,
    categories,
    departments,
    departmentsLoading
  } = useExpenseForm();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#8B5CF6] hover:bg-[#7c4ff1]">Add Expense</Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[550px] aspect-square max-h-[90vh] p-0 overflow-hidden"
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Add New Expense</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[calc(90vh-130px)]">
          <div className="grid gap-4 px-6 py-4">
            {/* Date and Amount row */}
            <DateAmountSection
              date={formState.date}
              setDate={formSetters.setDate}
              amount={formState.amount}
              handleAmountChange={formSetters.setAmount}
              validationErrors={formState.validationErrors}
            />

            {/* Category with add new option */}
            <CategorySection
              category={formState.category}
              setCategory={(value) => {
                formSetters.setCategory(value);
                // Clear validation error when a value is selected
                if (value) {
                  formState.validationErrors.category = '';
                }
              }}
              showAddCategory={formState.showAddCategory}
              setShowAddCategory={formSetters.setShowAddCategory}
              newCategoryName={formState.newCategoryName}
              setNewCategoryName={formSetters.setNewCategoryName}
              handleAddCategory={formHandlers.handleAddCategory}
              categories={categories}
              validationErrors={formState.validationErrors}
            />

            {/* Department and Expense Type row */}
            <DepartmentTypeSection
              department={formState.department}
              setDepartment={(value) => {
                formSetters.setDepartment(value);
                if (value) {
                  formState.validationErrors.department = '';
                }
              }}
              expenseType={formState.expenseType}
              setExpenseType={(value) => {
                formSetters.setExpenseType(value);
                if (value) {
                  formState.validationErrors.expenseType = '';
                }
              }}
              departments={departments}
              departmentsLoading={departmentsLoading}
              validationErrors={formState.validationErrors}
              selectedCategory={formState.category}
              categoryId={categories.find(c => c.name === formState.category)?.id}
            />

            {/* Recurring Expense and Frequency */}
            <RecurringSection
              isRecurring={formState.isRecurring}
              setIsRecurring={formSetters.setIsRecurring}
              recurringFrequency={formState.recurringFrequency}
              setRecurringFrequency={(value) => {
                formSetters.setRecurringFrequency(value);
                if (value) {
                  formState.validationErrors.recurringFrequency = '';
                }
              }}
              validationErrors={formState.validationErrors}
            />

            {/* Description */}
            <DescriptionSection 
              description={formState.description}
              setDescription={formSetters.setDescription}
            />

            {/* Receipt upload section */}
            <ReceiptUploadSection
              receipt={formState.receipt}
              receiptPreview={formState.receiptPreview}
              handleReceiptUpload={formHandlers.handleReceiptUpload}
              removeReceipt={formHandlers.removeReceipt}
            />
          </div>
        </ScrollArea>
        
        {/* Submit Button - Fixed at bottom */}
        <DialogFooter 
          isSubmitting={isSubmitting} 
          onSubmit={formHandlers.handleSubmit} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
