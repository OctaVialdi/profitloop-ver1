
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";

interface FeatureItem {
  key: string;
  value: string | number | boolean;
}

interface FeaturesEditorProps {
  value: Record<string, any>;
  onChange: (features: Record<string, any>) => void;
}

export const FeaturesEditor: React.FC<FeaturesEditorProps> = ({ value, onChange }) => {
  // Convert features object to array for easier manipulation
  const [features, setFeatures] = useState<FeatureItem[]>(() => {
    return Object.entries(value || {}).map(([key, value]) => ({
      key,
      value,
    }));
  });

  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [newFeatureValue, setNewFeatureValue] = useState("");

  // Update parent component when features change
  const updateParent = (updatedFeatures: FeatureItem[]) => {
    const featuresObject = updatedFeatures.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, any>);
    
    onChange(featuresObject);
  };

  const addFeature = () => {
    if (!newFeatureKey.trim()) return;
    
    // Convert newFeatureValue to appropriate type
    let processedValue: string | number | boolean = newFeatureValue;
    
    // Try to convert to number if it looks like a number
    if (!isNaN(Number(newFeatureValue))) {
      processedValue = Number(newFeatureValue);
    }
    // Convert to boolean if it's "true" or "false"
    else if (newFeatureValue.toLowerCase() === "true") {
      processedValue = true;
    } 
    else if (newFeatureValue.toLowerCase() === "false") {
      processedValue = false;
    }
    
    const newFeatures = [
      ...features,
      { key: newFeatureKey, value: processedValue }
    ];
    
    setFeatures(newFeatures);
    updateParent(newFeatures);
    
    // Reset input fields
    setNewFeatureKey("");
    setNewFeatureValue("");
  };

  const updateFeature = (index: number, key: string, value: string) => {
    const updatedFeatures = [...features];
    
    // Convert value to appropriate type
    let processedValue: string | number | boolean = value;
    
    // Try to convert to number if it looks like a number
    if (!isNaN(Number(value))) {
      processedValue = Number(value);
    }
    // Convert to boolean if it's "true" or "false"
    else if (value.toLowerCase() === "true") {
      processedValue = true;
    } 
    else if (value.toLowerCase() === "false") {
      processedValue = false;
    }
    
    updatedFeatures[index] = {
      key,
      value: processedValue
    };
    
    setFeatures(updatedFeatures);
    updateParent(updatedFeatures);
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    updateParent(updatedFeatures);
  };

  return (
    <div className="space-y-4">
      {features.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-md text-muted-foreground">
          No features added yet. Add features below.
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Label htmlFor={`feature-key-${index}`} className="sr-only">
                      Feature Name
                    </Label>
                    <Input
                      id={`feature-key-${index}`}
                      value={feature.key}
                      onChange={(e) =>
                        updateFeature(index, e.target.value, String(feature.value))
                      }
                      placeholder="Feature name"
                    />
                  </div>
                  <div className="col-span-5">
                    <Label htmlFor={`feature-value-${index}`} className="sr-only">
                      Feature Value
                    </Label>
                    <Input
                      id={`feature-value-${index}`}
                      value={String(feature.value)}
                      onChange={(e) =>
                        updateFeature(index, feature.key, e.target.value)
                      }
                      placeholder="Feature value"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-3">Add New Feature</h4>
        <div className="grid grid-cols-12 gap-2 items-end">
          <div className="col-span-5">
            <Label htmlFor="new-feature-key">Feature Name</Label>
            <Input
              id="new-feature-key"
              value={newFeatureKey}
              onChange={(e) => setNewFeatureKey(e.target.value)}
              placeholder="e.g., Storage limit"
            />
          </div>
          <div className="col-span-5">
            <Label htmlFor="new-feature-value">Feature Value</Label>
            <Input
              id="new-feature-value"
              value={newFeatureValue}
              onChange={(e) => setNewFeatureValue(e.target.value)}
              placeholder="e.g., 10GB"
            />
          </div>
          <div className="col-span-2">
            <Button
              type="button"
              onClick={addFeature}
              disabled={!newFeatureKey.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
