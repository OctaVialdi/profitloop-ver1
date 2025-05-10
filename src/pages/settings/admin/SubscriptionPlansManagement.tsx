
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Edit, Trash2, Check, X, ExternalLink, PackageOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define schema for the subscription plan form
const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9_]+$/, "Slug must contain only lowercase letters, numbers, and underscores"),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  max_members: z.coerce.number().int().min(1, "Must have at least 1 member").nullable(),
  features: z.string().optional(),
  direct_payment_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_active: z.boolean().default(true)
});

type PlanFormValues = z.infer<typeof planFormSchema>;

type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string | null;
  price: number | null;
  max_members: number | null;
  features: Record<string, any> | null;
  direct_payment_url: string | null;
  is_active: boolean | null;
  created_at: string;
};

export default function SubscriptionPlansManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup form
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      price: 0,
      max_members: 1,
      features: "{}",
      direct_payment_url: "",
      is_active: true
    }
  });

  const formatPrice = (price: number | null) => {
    if (price === null) return "Free";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Load subscription plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Reset and open form for adding a new plan
  const openAddDialog = () => {
    form.reset({
      name: "",
      slug: "",
      price: 0,
      max_members: 1,
      features: "{}",
      direct_payment_url: "",
      is_active: true
    });
    setIsAddDialogOpen(true);
  };

  // Set form values and open form for editing
  const openEditDialog = (plan: SubscriptionPlan) => {
    setEditPlan(plan);
    form.reset({
      name: plan.name,
      slug: plan.slug || "",
      price: plan.price || 0,
      max_members: plan.max_members || null,
      features: plan.features ? JSON.stringify(plan.features, null, 2) : "{}",
      direct_payment_url: plan.direct_payment_url || "",
      is_active: plan.is_active || false
    });
    setIsEditDialogOpen(true);
  };

  // Prepare to delete a plan
  const openDeleteDialog = (plan: SubscriptionPlan) => {
    setEditPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  // Create a new plan
  const handleCreatePlan = async (values: PlanFormValues) => {
    setIsSubmitting(true);
    try {
      // Check if slug is unique
      const { data: existingPlans } = await supabase
        .from("subscription_plans")
        .select("id")
        .eq("slug", values.slug);

      if (existingPlans && existingPlans.length > 0) {
        form.setError("slug", { message: "This slug is already in use" });
        setIsSubmitting(false);
        return;
      }

      let featuresObj;
      try {
        featuresObj = values.features ? JSON.parse(values.features) : {};
      } catch (e) {
        form.setError("features", { message: "Invalid JSON format" });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("subscription_plans")
        .insert({
          name: values.name,
          slug: values.slug,
          price: values.price,
          max_members: values.max_members,
          features: featuresObj,
          direct_payment_url: values.direct_payment_url || null,
          is_active: values.is_active
        });

      if (error) throw error;
      
      toast.success("Subscription plan created successfully");
      setIsAddDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error creating plan:", error);
      toast.error("Failed to create subscription plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing plan
  const handleUpdatePlan = async (values: PlanFormValues) => {
    if (!editPlan) return;
    
    setIsSubmitting(true);
    try {
      // Check if slug is unique (except for this plan)
      const { data: existingPlans } = await supabase
        .from("subscription_plans")
        .select("id")
        .eq("slug", values.slug)
        .neq("id", editPlan.id);

      if (existingPlans && existingPlans.length > 0) {
        form.setError("slug", { message: "This slug is already in use" });
        setIsSubmitting(false);
        return;
      }

      let featuresObj;
      try {
        featuresObj = values.features ? JSON.parse(values.features) : {};
      } catch (e) {
        form.setError("features", { message: "Invalid JSON format" });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from("subscription_plans")
        .update({
          name: values.name,
          slug: values.slug,
          price: values.price,
          max_members: values.max_members,
          features: featuresObj,
          direct_payment_url: values.direct_payment_url || null,
          is_active: values.is_active
        })
        .eq("id", editPlan.id);

      if (error) throw error;
      
      toast.success("Subscription plan updated successfully");
      setIsEditDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update subscription plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a plan
  const handleDeletePlan = async () => {
    if (!editPlan) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("subscription_plans")
        .delete()
        .eq("id", editPlan.id);

      if (error) throw error;
      
      toast.success("Subscription plan deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete subscription plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Paket Berlangganan</h2>
          <p className="text-muted-foreground">Kelola paket berlangganan dan harga</p>
        </div>
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Paket
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>URL Pembayaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <PackageOpen className="h-12 w-12 mb-2 opacity-50" />
                        <p>Belum ada paket berlangganan.</p>
                        <p>Klik "Tambah Paket" untuk membuat paket baru.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.slug}</TableCell>
                      <TableCell>{formatPrice(plan.price)}</TableCell>
                      <TableCell>{plan.max_members === null ? "Unlimited" : plan.max_members}</TableCell>
                      <TableCell>
                        {plan.direct_payment_url ? (
                          <div className="flex items-center">
                            <span className="truncate max-w-[150px]">{plan.direct_payment_url}</span>
                            <a 
                              href={plan.direct_payment_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary ml-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {plan.is_active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="mr-1 h-3 w-3" /> Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <X className="mr-1 h-3 w-3" /> Tidak Aktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditDialog(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(plan)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Paket Berlangganan</DialogTitle>
            <DialogDescription>
              Buat paket berlangganan baru dengan mengisi form berikut.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePlan)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Paket</FormLabel>
                      <FormControl>
                        <Input placeholder="Basic, Standard, Premium, etc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="basic_plan" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier (e.g., basic_plan)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (IDR)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="max_members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Member Maksimum</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : parseInt(value));
                          }}
                          placeholder="Kosongkan untuk unlimited"
                        />
                      </FormControl>
                      <FormDescription>
                        Kosongkan untuk unlimited
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="direct_payment_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Pembayaran Langsung Midtrans</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://app.midtrans.com/payment-links/1234567890"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      URL payment link dari Midtrans (opsional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitur (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder='{"storage": "5GB", "api_calls": 10000}'
                        {...field}
                        value={field.value || "{}"}
                      />
                    </FormControl>
                    <FormDescription>
                      Masukkan fitur dalam format JSON
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Aktif</FormLabel>
                      <FormDescription>
                        Paket ini akan tersedia untuk langganan
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Paket Berlangganan</DialogTitle>
            <DialogDescription>
              Ubah detail paket berlangganan.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePlan)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Paket</FormLabel>
                      <FormControl>
                        <Input placeholder="Basic, Standard, Premium, etc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="basic_plan" {...field} />
                      </FormControl>
                      <FormDescription>
                        Unique identifier (e.g., basic_plan)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (IDR)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="max_members"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah Member Maksimum</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : parseInt(value));
                          }}
                          placeholder="Kosongkan untuk unlimited"
                        />
                      </FormControl>
                      <FormDescription>
                        Kosongkan untuk unlimited
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="direct_payment_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Pembayaran Langsung Midtrans</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://app.midtrans.com/payment-links/1234567890"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      URL payment link dari Midtrans (opsional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitur (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder='{"storage": "5GB", "api_calls": 10000}'
                        {...field}
                        value={field.value || "{}"}
                      />
                    </FormControl>
                    <FormDescription>
                      Masukkan fitur dalam format JSON
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Status Aktif</FormLabel>
                      <FormDescription>
                        Paket ini akan tersedia untuk langganan
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Paket</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus paket "{editPlan?.name}"?
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertDescription>
              Tindakan ini tidak dapat dibatalkan. Pastikan paket ini tidak digunakan oleh organisasi manapun.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePlan}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
