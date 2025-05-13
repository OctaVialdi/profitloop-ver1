
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewPointFormProps {
  newPoint: string;
  onNewPointChange: (value: string) => void;
  onAddPoint: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function NewPointForm({ 
  newPoint, 
  onNewPointChange, 
  onAddPoint 
}: NewPointFormProps) {
  return (
    <form onSubmit={onAddPoint} className="flex items-center mb-6">
      <div className="relative flex-grow">
        <Input 
          type="text" 
          placeholder="Type a new discussion point and press Enter..." 
          className="pr-24 border-blue-200 dark:border-blue-800 focus:border-blue-400 transition-all" 
          value={newPoint} 
          onChange={e => onNewPointChange(e.target.value)} 
        />
        <Button 
          type="submit" 
          className="absolute right-1 top-1 bottom-1 bg-blue-600 hover:bg-blue-700 transition-all" 
          size="sm" 
          disabled={!newPoint.trim()}
        >
          Add
        </Button>
      </div>
    </form>
  );
}
