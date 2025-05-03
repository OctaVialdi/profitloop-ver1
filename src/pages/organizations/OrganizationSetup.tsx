
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { businessFields } from "@/data/businessFields";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrganization } from "@/services/onboardingService";

// Define the schema for form validation
const organizationFormSchema = z.object({
  name: z.string().min(2, { message: "Nama perusahaan minimal 2 karakter" }),
  businessField: z.string().min(1, { message: "Pilih bidang bisnis" }),
  employeeCount: z.string().min(1, { message: "Masukkan jumlah karyawan" }),
  address: z.string().optional(),
  phone: z.string().optional(),
});

// TypeScript type for form data
type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

const OrganizationSetup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      businessField: "",
      employeeCount: "",
      address: "",
      phone: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: OrganizationFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createOrganization(data);
      
      if (result) {
        toast.success("Organisasi berhasil dibuat!");
        navigate("/dashboard");
      } else {
        toast.error("Gagal membuat organisasi. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Pengaturan Organisasi</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi informasi organisasi Anda untuk mulai menggunakan aplikasi
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Perusahaan *</FormLabel>
                  <FormControl>
                    <Input placeholder="PT. Nama Perusahaan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bidang Bisnis</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bidang bisnis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessFields.map((business) => (
                        <SelectItem key={business.value} value={business.value}>
                          {business.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Karyawan</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Masukkan jumlah karyawan" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Perusahaan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Alamat lengkap perusahaan" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="+62xxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Buat Organisasi"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OrganizationSetup;
