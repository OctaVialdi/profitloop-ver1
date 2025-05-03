
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { businessFields } from "@/data/businessFields";
import { OrganizationFormData } from "@/types/onboarding";

interface OrganizationFormProps {
  formData: OrganizationFormData;
  onChange: (field: keyof OrganizationFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading
}) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Pengaturan Organisasi</CardTitle>
        <CardDescription className="text-center">
          Lengkapi informasi organisasi Anda untuk mulai menggunakan aplikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Perusahaan <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              placeholder="PT. Nama Perusahaan"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessField">Bidang Bisnis</Label>
            <Select 
              value={formData.businessField} 
              onValueChange={(value) => onChange('businessField', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih bidang bisnis" />
              </SelectTrigger>
              <SelectContent>
                {businessFields.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeCount">Jumlah Karyawan</Label>
            <Input
              id="employeeCount"
              type="number"
              placeholder="Masukkan jumlah karyawan"
              value={formData.employeeCount}
              onChange={(e) => onChange('employeeCount', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Perusahaan</Label>
            <Textarea
              id="address"
              placeholder="Alamat lengkap perusahaan"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              placeholder="+62xxx"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Buat Organisasi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationForm;
