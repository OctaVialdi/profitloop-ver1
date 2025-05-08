
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Upload } from 'lucide-react';
import { toast } from "sonner";
import { CompanyData } from '@/services/companyService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyEditDialogProps {
  companyData: CompanyData | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CompanyEditDialog: React.FC<CompanyEditDialogProps> = ({ companyData, onSave, onCancel }) => {
  const organization = companyData?.organization;
  const profile = companyData?.profile || {
    address: '',
    phone: '',
    email: '',
    website: '',
    established: '',
    employees: undefined,
    tax_id: '',
    logo_url: ''
  };
  const missionVision = companyData?.missionVision || {
    mission: '',
    vision: ''
  };
  
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    address: profile.address || "",
    phone: profile.phone || "",
    email: profile.email || "",
    website: profile.website || "",
    established: profile.established || "",
    employees: profile.employees?.toString() || "",
    taxId: profile.tax_id || "",
    mission: missionVision.mission || "",
    vision: missionVision.vision || "",
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo image must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClickLogo = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      logoFile
    });
  };

  // Get company initials for avatar
  const companyName = formData.name || "Company Name";
  const nameInitials = companyName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Get departments for display (read-only)
  const departments = companyData?.departments || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Company Profile</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo and Company Name */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-32 w-32 cursor-pointer" onClick={handleClickLogo}>
                    {logoPreview ? (
                      <AvatarImage src={logoPreview} alt={companyName} />
                    ) : null}
                    <AvatarFallback className="text-3xl">{nameInitials}</AvatarFallback>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="text-white" />
                    </div>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-1 text-sm text-muted-foreground">Company Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-lg font-semibold"
                    placeholder="Enter company name"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Company name will be updated across the entire system
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Address</label>
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Office Address"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Phone</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Email</label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    type="email"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Website</label>
                  <Input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Website URL"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Established</label>
                  <Input
                    name="established"
                    value={formData.established}
                    onChange={handleInputChange}
                    placeholder="Year Established"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Employees</label>
                  <Input
                    name="employees"
                    value={formData.employees}
                    disabled
                    placeholder="Number of Employees (Auto-calculated)"
                    className="bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    This field is automatically calculated from active employees
                  </p>
                </div>
                <div>
                  <label className="block mb-1 text-sm text-muted-foreground">Tax ID</label>
                  <Input
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="Tax Identification Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mission & Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-1 text-sm text-muted-foreground">Mission</label>
                <Textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Company Mission Statement"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-muted-foreground">Vision</label>
                <Textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Company Vision Statement"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Added Departments (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Departments
                <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-1 bg-slate-100 rounded-full">
                  from employee data
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departments.length > 0 ? (
                <ul className="space-y-2">
                  {departments.map((dept, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      <span>{dept.organization_name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">No departments found in employee data</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Departments are managed through employee assignments and cannot be edited directly
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li>Click on the company logo circle to upload a new logo</li>
                <li>The company name will update the organization name across the system</li>
                <li>Number of employees is calculated automatically from active employees</li>
                <li>Departments are derived from employee organization assignments</li>
                <li>Fill all the details and save changes when done</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditDialog;
