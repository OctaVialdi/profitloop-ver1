import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useOrganization } from '@/hooks/useOrganization';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from "react-day-picker";

import { addMonths, subMonths } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"
import { toast } from "sonner";

const invoiceSchema = z.object({
  vendor: z.string().min(2, {
    message: "Vendor must be at least 2 characters.",
  }),
  invoiceNumber: z.string().min(5, {
    message: "Invoice number must be at least 5 characters.",
  }),
  amount: z.number(),
  dueDate: z.date(),
  department: z.string(),
  approver: z.string(),
});

export default function BillApprovals() {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: "728ed52f",
      vendor: "Acme Corp",
      invoiceNumber: "INV-2023-10",
      amount: 5000,
      dueDate: new Date("2023-12-31"),
      department: "Marketing",
      approver: "John Doe",
      status: "Pending",
    },
    {
      id: "728ed53g",
      vendor: "Beta Co",
      invoiceNumber: "INV-2023-11",
      amount: 3000,
      dueDate: new Date("2024-01-15"),
      department: "Sales",
      approver: "Jane Smith",
      status: "Approved",
    },
    {
      id: "728ed54h",
      vendor: "Gamma Ltd",
      invoiceNumber: "INV-2023-12",
      amount: 7500,
      dueDate: new Date("2024-02-28"),
      department: "Finance",
      approver: "Mike Johnson",
      status: "Rejected",
    },
  ]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 2),
    to: new Date(),
  })
  const { toast } = useToast();
  const { organization } = useOrganization();
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        if (!organization?.id) {
          console.error("No organization ID found");
          return;
        }

        const { data, error } = await supabase
          .from('team_members_digital_marketing')
          .select('*')
          .eq('organization_id', organization.id);

        if (error) {
          console.error("Error fetching team members:", error);
          return;
        }

        setTeamMembers(data || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [organization?.id]);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      vendor: "",
      invoiceNumber: "",
      amount: 0,
      dueDate: new Date(),
      department: "",
      approver: "",
    },
  });

  function onSubmit(values: z.infer<typeof invoiceSchema>) {
    console.log(values);
    setOpen(false);
  }

  const handleApprove = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      // Update invoice status
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === id ? { ...invoice, status: "Approved" } : invoice
        )
      );

      toast.success("Invoice approved successfully");
    }, 500);
  };

  const handleReject = (id: string) => {
    // Simulate API call
    setTimeout(() => {
      // Update invoice status
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === id ? { ...invoice, status: "Rejected" } : invoice
        )
      );

      toast({
        title: "Success",
        description: "Invoice rejected successfully",
      });
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Approvals</CardTitle>
        <CardDescription>
          Manage and approve incoming bills from vendors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Invoice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Invoice</DialogTitle>
              <DialogDescription>
                Add a new invoice for approval.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <FormControl>
                        <Input placeholder="Vendor name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approver</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an approver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(teamMembers) && teamMembers.length > 0 ? (
                            teamMembers.map((member) => (
                              <SelectItem key={member.id} value={member.name}>
                                {member.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="">No team members available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 space-y-1.5">
            <h4 className="text-lg font-semibold">Invoices</h4>
            <p className="text-sm text-muted-foreground">
              Track and manage your invoices.
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "MMM dd, yyyy")} - ${format(
                      date.to,
                      "MMM dd, yyyy"
                    )}`
                  ) : (
                    format(date.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="grid gap-6 p-4 md:grid-cols-2">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Invoice Date</h1>
                    <Button size="sm" variant="secondary">
                      Reset
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 flex w-full shrink-0 items-center justify-between rounded-t-md border-b p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 data-[state=past]:opacity-50"
                        onClick={() => setDate({
                          from: subMonths(date?.from || new Date(), 1),
                          to: date?.to
                        })}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setDate({
                          from: addMonths(date?.from || new Date(), 1),
                          to: date?.to
                        })}
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                      pagedNavigation
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.vendor}</TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>${invoice.amount}</TableCell>
                <TableCell>
                  {invoice.dueDate.toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.department}</TableCell>
                <TableCell>{invoice.approver}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleApprove(invoice.id)}
                      >
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReject(invoice.id)}>
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
