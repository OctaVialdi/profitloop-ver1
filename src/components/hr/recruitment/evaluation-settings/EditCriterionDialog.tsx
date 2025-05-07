
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EvaluationCategory, EvaluationCriterion } from "@/services/candidateService";

const formSchema = z.object({
  question: z.string().min(3, { message: "Question must be at least 3 characters" }).max(200),
});

interface EditCriterionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criterion: EvaluationCriterion;
  category: EvaluationCategory | undefined;
  onUpdate: (id: string, question: string) => void;
}

export default function EditCriterionDialog({ 
  open, 
  onOpenChange,
  criterion,
  category,
  onUpdate
}: EditCriterionDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: criterion.question,
    },
  });

  // Reset form when criterion changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        question: criterion.question,
      });
    }
  }, [criterion, open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate(criterion.id, values.question);
    onOpenChange(false);
  }

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Criterion</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter evaluation question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Criterion</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
