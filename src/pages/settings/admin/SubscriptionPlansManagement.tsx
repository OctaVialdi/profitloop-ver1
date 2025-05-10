import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Edit, Plus, Trash, XCircle, ArrowUpDown, Link as LinkIcon } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatRupiah } from "@/utils/formatUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

// Define subscription plan type that matches database structure
interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  max_members: number | null;
  features: Record<string, any> | null;
  is_active: boolean;
  direct_payment_url?: string | null;
  deskripsi?: string | null;
  created_at?: string;
}

// Define feature item interface for the features form
interface FeatureItem {
  name: string;
  value: string;
  enabled: boolean;
}

const SubscriptionPlansManagement = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: 0,
    max_members: 0,
    is_active: true,
    direct_payment_url: '',
    deskripsi: '',
  });
  const [features, setFeatures] = useState<FeatureItem[]>([
    { name: 'storage', value: '1GB', enabled: true },
    { name: 'api_calls', value: '1000', enabled: false },
    { name: 'support', value: 'Basic', enabled: false },
    { name: 'collaboration', value: 'Limited', enabled: false },
    { name: 'security', value: 'Standard', enabled: false }
  ]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });
        
      if (error) throw error;
      
      if (data) {
        // Ensure proper type conversion
        const typedPlans: SubscriptionPlan[] = data.map(plan => ({
          ...plan,
          features: plan.features as Record<string, any> | null
        }));
        setPlans(typedPlans);
        console.log('Subscription plans fetched:', typedPlans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Gagal memuat data paket langganan');
    } finally {
      setIsLoading(false);
    }
  }, [sortColumn, sortDirection]);
  
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update({ is_active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state to reflect the change
      setPlans(plans.map(plan => 
        plan.id === id ? { ...plan, is_active: !currentStatus } : plan
      ));
      
      toast.success(`Paket ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}`);
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error('Gagal mengubah status paket');
    }
  };
  
  // Initialize features from plan data
  const initializeFeaturesFromPlan = (planFeatures: Record<string, any> | null) => {
    const defaultFeatures = [
      { name: 'storage', value: '1GB', enabled: false },
      { name: 'api_calls', value: '1000', enabled: false },
      { name: 'support', value: 'Basic', enabled: false },
      { name: 'collaboration', value: 'Limited', enabled: false },
      { name: 'security', value: 'Standard', enabled: false }
    ];
    
    if (!planFeatures) return defaultFeatures;
    
    return defaultFeatures.map(feature => {
      const featureExists = planFeatures[feature.name] !== undefined;
      return {
        name: feature.name,
        value: featureExists ? String(planFeatures[feature.name]) : feature.value,
        enabled: featureExists
      };
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price: 0,
      max_members: 0,
      is_active: true,
      direct_payment_url: '',
      deskripsi: '',
    });
    setFeatures([
      { name: 'storage', value: '1GB', enabled: true },
      { name: 'api_calls', value: '1000', enabled: false },
      { name: 'support', value: 'Basic', enabled: false },
      { name: 'collaboration', value: 'Limited', enabled: false },
      { name: 'security', value: 'Standard', enabled: false }
    ]);
    setIsEditMode(false);
    setCurrentPlan(null);
  };
  
  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setIsEditMode(true);
      setCurrentPlan(plan);
      setFormData({
        name: plan.name,
        slug: plan.slug || '',
        price: plan.price || 0,
        max_members: plan.max_members || 0,
        is_active: plan.is_active,
        direct_payment_url: plan.direct_payment_url || '',
        deskripsi: plan.deskripsi || '',
      });
      setFeatures(initializeFeaturesFromPlan(plan.features));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Update the input change handler to work with both Input and Textarea elements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleFeatureChange = (index: number, field: 'value' | 'enabled', value: string | boolean) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value
    };
    setFeatures(updatedFeatures);
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked,
    });
  };
  
  const buildFeaturesObject = () => {
    const featuresObject: Record<string, any> = {};
    
    features.forEach(feature => {
      if (feature.enabled) {
        featuresObject[feature.name] = feature.value;
      }
    });
    
    return featuresObject;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name) {
      toast.error('Nama paket harus diisi');
      return;
    }
    
    if (!formData.slug) {
      // Generate slug from name if not provided
      formData.slug = formData.name.toLowerCase().replace(/\s+/g, '_') + '_plan';
    }
    
    try {
      const planData = {
        name: formData.name,
        slug: formData.slug,
        price: formData.price,
        max_members: formData.max_members || null,
        is_active: formData.is_active,
        direct_payment_url: formData.direct_payment_url || null,
        deskripsi: formData.deskripsi || null,
        features: buildFeaturesObject()
      };
      
      console.log('Saving plan data:', planData);
      
      if (isEditMode && currentPlan) {
        // Update existing plan
        const { data, error } = await supabase
          .from('subscription_plans')
          .update(planData)
          .eq('id', currentPlan.id)
          .select();
          
        if (error) throw error;
        
        // Update local state to ensure UI is up-to-date
        if (data && data.length > 0) {
          const updatedPlan: SubscriptionPlan = {
            ...data[0],
            features: data[0].features as Record<string, any> | null
          };
          
          setPlans(prev => prev.map(plan => 
            plan.id === currentPlan.id ? updatedPlan : plan
          ));
          console.log('Plan updated in state:', updatedPlan);
        }
        
        toast.success('Paket berhasil diperbarui');
      } else {
        // Create new plan
        const { data, error } = await supabase
          .from('subscription_plans')
          .insert([planData])
          .select();
          
        if (error) throw error;
        
        // Add new plan to local state
        if (data && data.length > 0) {
          const newPlan: SubscriptionPlan = {
            ...data[0],
            features: data[0].features as Record<string, any> | null
          };
          
          setPlans(prev => [...prev, newPlan]);
          console.log('New plan added to state:', newPlan);
        }
        
        toast.success('Paket baru berhasil dibuat');
      }
      
      handleCloseDialog();
      // Explicitly fetch the latest data to ensure UI is synchronized
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Gagal menyimpan paket');
    }
  };
  
  const handleDeletePlan = async () => {
    if (!currentPlan) return;
    
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', currentPlan.id);
        
      if (error) throw error;
      
      // Remove the deleted plan from the local state
      setPlans(plans.filter(plan => plan.id !== currentPlan.id));
      
      toast.success('Paket berhasil dihapus');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Gagal menghapus paket');
    }
  };
  
  const openDeleteDialog = (plan: SubscriptionPlan) => {
    setCurrentPlan(plan);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Kelola Paket Langganan</CardTitle>
            <CardDescription>Menambah, mengedit, atau menghapus paket langganan</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()} className="ml-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Paket
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    onClick={() => handleSort('name')} 
                    className="cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center">
                      Nama
                      {sortColumn === 'name' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('slug')} 
                    className="cursor-pointer hover:bg-muted"
                  >
                    <div className="flex items-center">
                      Slug
                      {sortColumn === 'slug' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('price')} 
                    className="cursor-pointer hover:bg-muted text-right"
                  >
                    <div className="flex items-center justify-end">
                      Harga
                      {sortColumn === 'price' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Max Anggota</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Fitur</TableHead>
                  <TableHead>URL Midtrans</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.slug}</TableCell>
                    <TableCell className="text-right">{formatRupiah(plan.price)}</TableCell>
                    <TableCell>{plan.max_members || 'Tidak dibatasi'}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {plan.deskripsi || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {plan.features ? (
                          <div className="text-xs">
                            {Object.entries(plan.features).map(([key, value]) => (
                              <div key={key} className="mb-1">
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        ) : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {plan.direct_payment_url ? (
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-1 text-green-500" />
                          <span className="truncate max-w-[150px]">Terkonfigurasi</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-gray-500">Tidak diatur</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch 
                          checked={plan.is_active} 
                          onCheckedChange={() => handleToggleActive(plan.id, plan.is_active)}
                          className="mr-2"
                        />
                        <span className={plan.is_active ? "text-green-600" : "text-gray-400"}>
                          {plan.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => openDeleteDialog(plan)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-5">
        <p className="text-sm text-muted-foreground">
          Total {plans.length} paket {plans.filter(p => p.is_active).length > 0 && `(${plans.filter(p => p.is_active).length} aktif)`}
        </p>
        <p className="text-sm text-muted-foreground">
          Perubahan paket akan langsung terlihat di halaman pelanggan
        </p>
      </CardFooter>
      
      {/* Add/Edit Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Paket Langganan' : 'Tambah Paket Langganan'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Ubah detail paket langganan yang sudah ada' 
                : 'Tambahkan paket langganan baru ke dalam sistem'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama Paket
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  Slug
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-grow"
                    placeholder="nama_paket_plan"
                  />
                  <div className="ml-2 text-xs text-gray-500">
                    <span title="Digunakan sebagai identifier paket di dalam sistem">ℹ️</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deskripsi" className="text-right">
                  Deskripsi
                </Label>
                <Textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Deskripsi singkat tentang paket langganan"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Harga
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max_members" className="text-right">
                  Max Anggota
                </Label>
                <Input
                  id="max_members"
                  name="max_members"
                  type="number"
                  value={formData.max_members}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="0 untuk tidak terbatas"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direct_payment_url" className="text-right">
                  URL Midtrans
                </Label>
                <Input
                  id="direct_payment_url"
                  name="direct_payment_url"
                  value={formData.direct_payment_url || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="https://app.midtrans.com/snap/..."
                />
              </div>
              
              {/* Features section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Fitur Paket
                </Label>
                <div className="col-span-3 space-y-3 border p-3 rounded-md">
                  {features.map((feature, index) => (
                    <div key={feature.name} className="flex items-center space-x-3">
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(checked) => handleFeatureChange(index, 'enabled', checked)}
                      />
                      <span className="w-24">{feature.name}:</span>
                      <Input
                        value={feature.value}
                        onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                        className="flex-1"
                        disabled={!feature.enabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    {formData.is_active ? 'Aktif' : 'Nonaktif'}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Batal
              </Button>
              <Button type="submit">
                {isEditMode ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Paket
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus paket "{currentPlan?.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan} className="bg-red-600 text-white hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SubscriptionPlansManagement;
