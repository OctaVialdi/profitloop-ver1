
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CompanyEditDialogProps {
  companyData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CompanyEditDialog: React.FC<CompanyEditDialogProps> = ({ companyData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...companyData });
  const [departments, setDepartments] = useState([...companyData.departments]);
  const [values, setValues] = useState([...companyData.values]);
  const [newDepartment, setNewDepartment] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addDepartment = () => {
    if (newDepartment.trim()) {
      setDepartments([...departments, newDepartment]);
      setNewDepartment('');
    }
  };

  const removeDepartment = (index: number) => {
    const updatedDepartments = [...departments];
    updatedDepartments.splice(index, 1);
    setDepartments(updatedDepartments);
  };

  const addValue = () => {
    if (newValue.trim()) {
      setValues([...values, newValue]);
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    const updatedValues = [...values];
    updatedValues.splice(index, 1);
    setValues(updatedValues);
  };

  const handleSubmit = () => {
    const updatedData = {
      ...formData,
      departments,
      values
    };
    
    onSave(updatedData);
    toast({
      title: "Success",
      description: "Company details updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Company Profile</h2>
          
            <div className="flex flex-col md:flex-row items-center gap-6 my-6">
              <div className="bg-slate-50 rounded-full h-32 w-32 flex items-center justify-center text-slate-500 text-3xl font-semibold border border-dashed border-gray-300 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {formData.logo}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/75 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <span className="text-sm text-blue-600">Upload company logo</span>
                </div>
              </div>
              <div className="w-full">
                <Input
                  placeholder="Company Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Office Address"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Website</label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Website URL"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Established</label>
                <Input
                  name="established"
                  value={formData.established}
                  onChange={handleInputChange}
                  placeholder="Year Established"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Employees</label>
                <Input
                  name="employees"
                  value={formData.employees}
                  onChange={handleInputChange}
                  placeholder="Number of Employees"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Tax ID</label>
                <Input
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  placeholder="Tax Identification Number"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-500">Mission</label>
              <Textarea
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                rows={3}
                placeholder="Company Mission Statement"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-500">Vision</label>
              <Textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                rows={3}
                placeholder="Company Vision Statement"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Departments</h2>
            <ul className="space-y-2 mb-4">
              {departments.map((dept, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    <span>{dept}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeDepartment(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Add Department"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
              />
              <Button onClick={addDepartment} variant="outline" className="flex-shrink-0">
                <Plus className="h-4 w-4" /> Add Department
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Company Values</h2>
            <ul className="space-y-2 mb-4">
              {values.map((value, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-xs">
                      {index + 1}
                    </span>
                    <span>{value}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeValue(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Add Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addValue()}
              />
              <Button onClick={addValue} variant="outline" className="flex-shrink-0">
                <Plus className="h-4 w-4" /> Add Value
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditDialog;
