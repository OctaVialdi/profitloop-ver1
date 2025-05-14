
import React, { useState } from "react";
import { NewKolData, useKols } from "@/hooks/useKols";
import { toast } from "@/components/ui/use-toast";
import { KolFormHeader } from "./KolFormHeader";
import { KolFormTabs } from "./KolFormTabs";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

interface KolAddFormProps {
  setCurrentView: (view: string) => void;
}

export const KolAddForm: React.FC<KolAddFormProps> = ({ setCurrentView }) => {
  // Categories for new KOL
  const categories = [
    "Beauty", "Fashion", "Lifestyle", "Food", "Travel", "Fitness",
    "Tech", "Gaming", "Entertainment", "Business", "Education"
  ];

  const { addKol, isLoading, fetchKols } = useKols();
  
  const [formData, setFormData] = useState({
    full_name: "",
    category: "",
    total_followers: 0,
    engagement_rate: 0,
    is_active: false,
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name) {
      toast({
        title: "Error",
        description: "Please enter the KOL name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    try {
      const newKolData: Omit<NewKolData, 'organization_id'> = {
        full_name: formData.full_name,
        category: formData.category,
        total_followers: Number(formData.total_followers),
        engagement_rate: Number(formData.engagement_rate),
        is_active: formData.is_active
      };

      const result = await addKol(newKolData);
      if (result) {
        // Make sure to call fetchKols to update the KOL list
        await fetchKols();
        setCurrentView("list");
      }
    } catch (error) {
      console.error("Error adding KOL:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-transparent p-0"
              onClick={() => setCurrentView("list")}
            >
              <ArrowLeftCircle size={20} className="mr-2 text-gray-500" />
            </Button>
            Add New KOL
          </h3>
          <p className="text-sm text-gray-500 mt-1">Create a new KOL profile with details, social media platforms, and rates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            Cancel
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add KOL"}
          </Button>
        </div>
      </div>
      
      <KolFormTabs 
        formData={formData}
        handleChange={handleChange}
        categories={categories}
      />
    </div>
  );
};
