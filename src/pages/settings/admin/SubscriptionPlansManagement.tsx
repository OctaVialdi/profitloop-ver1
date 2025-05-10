import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Plan name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a non-negative number.",
  }),
  maxMembers: z.number().min(1, {
    message: "Max members must be at least 1.",
  }),
  isActive: z.boolean().default(true),
});

const SubscriptionPlansManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      maxMembers: 1,
      isActive: true,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const fetchPlans = async () => {
    try {
      setIsLoading(true);

      const { data: subscriptionPlans, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.error("Error fetching subscription plans:", error);
        toast.error("Failed to load subscription plans");
        return;
      }

      setPlans(subscriptionPlans || []);
    } catch (error) {
      console.error("Error loading subscription plans:", error);
      toast.error("An error occurred while loading plans");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (selectedPlan) {
        // Update existing plan
        const { data, error } = await supabase
          .from('subscription_plans')
          .update({
            name: values.name,
            price: values.price,
            max_members: values.maxMembers,
            is_active: values.isActive,
          })
          .eq('id', selectedPlan.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating subscription plan:", error);
          toast.error("Failed to update subscription plan");
          return;
        }

        toast.success("Subscription plan updated successfully!");
      } else {
        // Create new plan
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert({
            name: values.name,
            price: values.price,
            max_members: values.maxMembers,
            is_active: values.isActive,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating subscription plan:", error);
          toast.error("Failed to create subscription plan");
          return;
        }

        toast.success("Subscription plan created successfully!");
      }

      fetchPlans();
      reset();
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setValue("name", plan.name);
    setValue("price", plan.price);
    setValue("maxMembers", plan.max_members);
    setValue("isActive", plan.is_active);
  };

  const handleClearSelection = () => {
    setSelectedPlan(null);
    reset();
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (error) {
        console.error("Error deleting subscription plan:", error);
        toast.error("Failed to delete subscription plan");
        return;
      }

      toast.success("Subscription plan deleted successfully!");
      fetchPlans();
    } catch (error) {
      console.error("Error during delete operation:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans Management</CardTitle>
          <CardDescription>
            Manage subscription plans for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Add Subscription Plan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedPlan ? "Edit Plan" : "Create New Plan"}
                </DialogTitle>
                <DialogDescription>
                  {selectedPlan
                    ? "Edit the details of the selected subscription plan."
                    : "Create a new subscription plan for your organization."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Basic Plan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Members</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Set plan as active or inactive.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    {selectedPlan && (
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={handleClearSelection}
                        className="mr-2"
                      >
                        Clear Selection
                      </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                      {isLoading
                        ? "Submitting..."
                        : selectedPlan
                          ? "Update Plan"
                          : "Create Plan"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <div className="mt-6">
            <Table>
              <TableCaption>
                A list of your subscription plans. Click on a plan to edit it.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Max Members</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.price}</TableCell>
                    <TableCell>{plan.max_members}</TableCell>
                    <TableCell>{plan.is_active ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePlanSelect(plan)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlansManagement;

import { Switch } from "@/components/ui/switch"
import {
  FormDescription,
} from "@/components/ui/form"
