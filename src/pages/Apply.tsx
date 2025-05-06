import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  birth_date: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});

export default function Apply() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [linkData, setLinkData] = useState<{
    organization_id: string;
    job_position_id: string;
    job_title: string;
    organization_name: string;
    is_valid: boolean;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      birth_date: "",
      education: "",
      experience: "",
    },
  });

  useEffect(() => {
    const fetchLinkInfo = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase.rpc("get_recruitment_link_info", {
          p_token: token,
        });

        if (error) {
          throw error;
        }

        if (!data || data.length === 0 || !data[0].is_valid) {
          toast.error("This link is invalid or has expired");
          navigate("/");
          return;
        }

        setLinkData(data[0]);
      } catch (error) {
        console.error("Error fetching link info:", error);
        toast.error("Failed to load application form");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkInfo();
  }, [token, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!linkData) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("data_calon_kandidat").insert([
        {
          organization_id: linkData.organization_id,
          job_position_id: linkData.job_position_id,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || null,
          address: values.address || null,
          birth_date: values.birth_date ? new Date(values.birth_date).toISOString() : null,
          education: values.education || null,
          experience: values.experience || null,
        },
      ]);

      if (error) {
        throw error;
      }

      // Update submission count using direct update with a +1 approach instead of the increment function
      await supabase
        .from("recruitment_links")
        .update({ submissions: (await supabase.from("recruitment_links").select("submissions").eq("token", token).single()).data.submissions + 1 })
        .eq("token", token);

      setIsSubmitted(true);
      toast.success("Application submitted successfully");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Loading application form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        {isSubmitted ? (
          <Card className="border-green-100 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>
                Thank you for applying to {linkData?.job_title} at {linkData?.organization_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                We've received your application and will review it shortly. If your profile matches our requirements, 
                we'll reach out to you via email to discuss next steps.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button onClick={() => window.close()} variant="outline">
                Close Window
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Apply for: {linkData?.job_title}
              </CardTitle>
              <CardDescription>
                Complete this form to apply at {linkData?.organization_name}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+62 8123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your education history" {...field} />
                        </FormControl>
                        <FormDescription>
                          Include your highest level of education, institution name, and graduation year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Experience</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your work experience" {...field} />
                        </FormControl>
                        <FormDescription>
                          Briefly describe your relevant work experience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
