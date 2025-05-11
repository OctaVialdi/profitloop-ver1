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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/organization";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash } from "lucide-react";
import { FeaturesEditor } from "@/components/settings/subscription/FeaturesEditor";

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
  isPricingPerMember: z.boolean().default(false),
  pricePerMember: z.number().min(0, {
    message: "Price per member must be a non-negative number.",
  }).optional(),
  features: z.record(z.string(), z.any()).optional(),
});

type SubscriptionPlanFormValues = z.infer<typeof formSchema>;

const SubscriptionPlansManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPricingPerMember, setIsPricingPerMember] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      maxMembers: 1,
      isActive: true,
      isPricingPerMember: false,
      pricePerMember: 0,
      features: {},
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Watch for isPricingPerMember changes
  const watchIsPricingPerMember = watch("isPricingPerMember");

  useEffect(() => {
    setIsPricingPerMember(watchIsPricingPerMember);
  }, [watchIsPricingPerMember]);

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

  const openDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setSelectedPlan(plan);
      setValue("name", plan.name);
      setValue("price", plan.price);
      setValue("maxMembers", plan.max_members);
      setValue("isActive", plan.is_active);
      setValue("isPricingPerMember", !!plan.price_per_member);
      setValue("pricePerMember", plan.price_per_member || 0);
      setValue("features", plan.features || {});
    } else {
      setSelectedPlan(null);
      reset({
        name: "",
        price: 0,
        maxMembers: 1,
        isActive: true,
        isPricingPerMember: false,
        pricePerMember: 0,
        features: {},
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: SubscriptionPlanFormValues) => {
    try {
      setIsLoading(true);

      const planData = {
        name: values.name,
        price: values.isPricingPerMember ? 0 : values.price,
        max_members: values.maxMembers,
        is_active: values.isActive,
        price_per_member: values.isPricingPerMember ? values.pricePerMember : null,
        features: values.features || {},
      };

      if (selectedPlan) {
        // Update existing plan
        const { data, error } = await supabase
          .from('subscription_plans')
          .update(planData)
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
          .insert(planData)
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
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteConfirmOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planToDelete);

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
      setDeleteConfirmOpen(false);
      setPlanToDelete(null);
    }
  };

  const formatPrice = (plan: SubscriptionPlan) => {
    if (plan.price_per_member) {
      return `${plan.price_per_member}/member`;
    } else {
      return plan.price;
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
          <Button variant="default" onClick={() => openDialog()} className="mb-6">
            <Plus className="w-4 h-4 mr-2" /> Add Subscription Plan
          </Button>

          <div>
            <Table>
              <TableCaption>
                List of your subscription plans. Click on a plan to edit it.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Max Members</TableHead>
                  <TableHead>Pricing Model</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading plans...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No subscription plans found. Create your first plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{formatPrice(plan)}</TableCell>
                      <TableCell>{plan.max_members}</TableCell>
                      <TableCell>
                        {plan.price_per_member ? "Per Member" : "Fixed Price"}
                      </TableCell>
                      <TableCell>
                        {plan.features && Object.keys(plan.features).length > 0
                          ? `${Object.keys(plan.features).length} features`
                          : "No features"}
                      </TableCell>
                      <TableCell>
                        {plan.is_active ? (
                          <span className="text-green-600 font-medium">Active</span>
                        ) : (
                          <span className="text-gray-500">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openDialog(plan)}
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(plan.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
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
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
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
                    name="isPricingPerMember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Per-Member Pricing</FormLabel>
                          <FormDescription>
                            Charge per member instead of a fixed price
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
                  
                  {isPricingPerMember ? (
                    <FormField
                      control={form.control}
                      name="pricePerMember"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Per Member</FormLabel>
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
                          <FormDescription>
                            Amount charged for each member in the organization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fixed Price</FormLabel>
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
                  )}
                  
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
                        <FormDescription>
                          Maximum number of members allowed in this plan
                        </FormDescription>
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
                            Set plan as active or inactive
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
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Features</FormLabel>
                        <FormControl>
                          <FeaturesEditor
                            value={field.value || {}}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Add features that are included in this plan
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedPlan ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    selectedPlan ? "Update Plan" : "Create Plan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscription plan. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionPlansManagement;
