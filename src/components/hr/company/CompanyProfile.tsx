
import React, { useEffect, useState } from 'react';
import { Edit, Building, Phone, Mail, Globe, Calendar, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CompanyEditDialog from './CompanyEditDialog';
import { useOrganization } from '@/hooks/useOrganization';
import { 
  CompanyData, 
  CompanyProfile as CompanyProfileType, 
  fetchCompanyData,
  saveCompanyProfile,
  saveMissionVision,
  addDepartment,
  deleteDepartment,
  addCompanyValue,
  deleteCompanyValue,
  uploadCompanyLogo
} from '@/services/companyService';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const CompanyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const { organization } = useOrganization();
  
  const loadCompanyData = async () => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchCompanyData(organization.id);
      setCompanyData(data);
    } catch (error) {
      console.error("Error loading company data:", error);
      toast.error("Failed to load company data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, [organization?.id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async (formData: any) => {
    if (!organization?.id || !companyData) return;

    try {
      // Save company profile
      const profileData: Partial<CompanyProfileType> = {
        organization_id: organization.id,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        established: formData.established,
        employees: parseInt(formData.employees) || 0,
        tax_id: formData.taxId
      };
      
      // Upload logo if provided
      if (formData.logoFile) {
        const logoUrl = await uploadCompanyLogo(organization.id, formData.logoFile);
        if (logoUrl) {
          profileData.logo_url = logoUrl;
        }
      }
      
      const updatedProfile = await saveCompanyProfile(profileData);
      
      // Save mission and vision
      const missionVisionData = {
        organization_id: organization.id,
        mission: formData.mission,
        vision: formData.vision
      };
      
      await saveMissionVision(missionVisionData);
      
      // Update local state with new data
      await loadCompanyData();
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving company data:", error);
      toast.error("Failed to save company data");
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleAddDepartment = async (departmentName: string) => {
    if (!organization?.id) return;
    
    const newDepartment = {
      organization_id: organization.id,
      name: departmentName
    };
    
    const result = await addDepartment(newDepartment);
    if (result) {
      await loadCompanyData();
    }
  };
  
  const handleRemoveDepartment = async (departmentId: string) => {
    const success = await deleteDepartment(departmentId);
    if (success) {
      await loadCompanyData();
    }
  };
  
  const handleAddValue = async (value: string) => {
    if (!organization?.id || !companyData) return;
    
    const nextOrder = companyData.values.length + 1;
    const newValue = {
      organization_id: organization.id,
      value: value
    };
    
    const result = await addCompanyValue(newValue, nextOrder);
    if (result) {
      await loadCompanyData();
    }
  };
  
  const handleRemoveValue = async (valueId: string) => {
    const success = await deleteCompanyValue(valueId);
    if (success) {
      await loadCompanyData();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-48" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="flex flex-col space-y-6">
                <div className="flex items-center gap-6">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <Skeleton className="h-8 w-72" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for display and editing
  const companyName = organization?.name || "Company Name";
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
  const departments = companyData?.departments || [];
  const values = companyData?.values || [];
  
  // Get logo display data
  const logoUrl = profile.logo_url;
  const nameInitials = companyName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="space-y-6">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleEditClick}
            >
              <Edit className="w-4 h-4" /> 
              Edit Company Details
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Company Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-32 w-32">
                      {logoUrl ? (
                        <AvatarImage src={logoUrl} alt={companyName} />
                      ) : null}
                      <AvatarFallback className="text-3xl">{nameInitials}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{companyName}</h1>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Address</p>
                          <p>{profile.address || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Mail className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Email</p>
                          <p>{profile.email || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Calendar className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Established</p>
                          <p>{profile.established || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FileText className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Tax ID</p>
                          <p>{profile.tax_id || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Phone className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Phone</p>
                          <p>{profile.phone || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Globe className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Website</p>
                          <p>{profile.website || "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Users className="text-muted-foreground w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-muted-foreground text-sm">Employees</p>
                          <p>{profile.employees || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Mission & Vision Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Mission & Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Mission</h3>
                    <p className="text-muted-foreground">{missionVision.mission || "No mission statement defined."}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Vision</h3>
                    <p className="text-muted-foreground">{missionVision.vision || "No vision statement defined."}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Departments Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  {departments.length > 0 ? (
                    <ul className="space-y-2 mb-4">
                      {departments.map((dept) => (
                        <li key={dept.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>{dept.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveDepartment(dept.id)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Remove</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center p-6 border rounded-md mb-4">
                      <p className="text-muted-foreground">No departments added yet</p>
                    </div>
                  )}
                  
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('newDepartment') as HTMLInputElement;
                      if (input.value.trim()) {
                        handleAddDepartment(input.value.trim());
                        input.value = '';
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="newDepartment"
                      placeholder="Add Department"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button type="submit" variant="outline">
                      Add
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Company Values Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Values</CardTitle>
                </CardHeader>
                <CardContent>
                  {values.length > 0 ? (
                    <ul className="space-y-2 mb-4">
                      {values.map((value, index) => (
                        <li key={value.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                              {index + 1}
                            </span>
                            <span>{value.value}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveValue(value.id)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Remove</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center p-6 border rounded-md mb-4">
                      <p className="text-muted-foreground">No company values added yet</p>
                    </div>
                  )}
                  
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('newValue') as HTMLInputElement;
                      if (input.value.trim()) {
                        handleAddValue(input.value.trim());
                        input.value = '';
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="newValue"
                      placeholder="Add Value"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button type="submit" variant="outline">
                      Add
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <CompanyEditDialog 
          companyData={companyData}
          onSave={handleSaveChanges}
          onCancel={handleCancel} 
        />
      )}
    </div>
  );
};

export default CompanyProfile;
