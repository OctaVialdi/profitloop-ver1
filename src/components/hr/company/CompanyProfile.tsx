
import React, { useState } from 'react';
import { Edit, Calendar, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CompanyEditDialog from './CompanyEditDialog';

const CompanyProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock company data - in a real app, this would come from an API
  const [companyData, setCompanyData] = useState({
    name: "PT. Tech Innovators Indonesia",
    logo: "PTII",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    phone: "+62-21-5551234",
    email: "info@techinnovators.id",
    website: "www.techinnovators.id",
    established: "2010",
    employees: "150",
    taxId: "09.012.345.6-789.000",
    mission: "To provide innovative technology solutions that empower businesses and enhance people's lives.",
    vision: "To become the leading technology provider in Southeast Asia.",
    departments: ["IT", "Marketing", "Finance", "HR", "Operations"],
    values: ["Innovation", "Integrity", "Excellence", "Collaboration"]
  });
  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = (updatedData: any) => {
    setCompanyData({...companyData, ...updatedData});
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {!isEditing ? (
        <>
          <div className="mb-4">
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
              {/* Company Profile */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Company Profile</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-slate-50 rounded-full h-32 w-32 flex items-center justify-center text-slate-500 text-3xl font-semibold">
                    {companyData.logo}
                  </div>
                  <h1 className="text-xl font-bold">{companyData.name}</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <File className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Address</p>
                        <p>{companyData.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <File className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Email</p>
                        <p>{companyData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Established</p>
                        <p>{companyData.established}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <File className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Tax ID</p>
                        <p>{companyData.taxId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <File className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Phone</p>
                        <p>{companyData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <File className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Website</p>
                        <p>{companyData.website}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <File className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-sm">Employees</p>
                        <p>{companyData.employees}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mission & Vision */}
              <div className="border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-bold">Mission & Vision</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Mission</h3>
                    <p className="text-gray-700">{companyData.mission}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Vision</h3>
                    <p className="text-gray-700">{companyData.vision}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Departments */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Departments</h2>
                <ul className="space-y-2">
                  {companyData.departments.map((dept, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span>{dept}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Company Values */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Company Values</h2>
                <ul className="space-y-2">
                  {companyData.values.map((value, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-xs">
                        {index + 1}
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
