import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from 'date-fns';
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner";

const Training = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleScheduleTraining = () => {
    toast.success("Training session scheduled successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Training Schedule</h1>

      <div className="flex items-center space-x-4 mb-4">
        <p>Select a date:</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date < new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Schedule Training</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Training Session</DialogTitle>
            <DialogDescription>
              Schedule a training session for your team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Training Name
              </Label>
              <Input id="name" value="" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input id="description" value="" className="col-span-3" />
            </div>
          </div>
          {/* Button to schedule training */}
          <Button onClick={handleScheduleTraining}>Schedule</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;
