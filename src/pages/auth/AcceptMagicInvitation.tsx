
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Mail, CheckCircle, AlertCircle } from "lucide-react";

const AcceptMagicInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [role, setRole] = useState("");
  
  const token = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";
  
  // Validate the invitation token
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !emailFromUrl) {
        toast.error("Invalid invitation link");
        navigate("/auth/login");
        return;
      }
      
      setEmail(emailFromUrl);
      setIsValidatingToken(true);
      
      try {
        // Check if invitation exists and is valid
        const { data: invitation, error } = await supabase
          .from('magic_link_invitations')
          .select(`
            id, status, email, role,
            organization:organization_id (name)
          `)
          .eq('token', token)
          .eq('status', 'sent')
          .maybeSingle();
        
        if (error) throw error;
        
        if (!invitation) {
          toast.error("Invitation not found or has expired");
          navigate("/auth/login");
          return;
        }
        
        if (invitation.email !== emailFromUrl) {
          toast.error("Email does not match the invitation");
          navigate("/auth/login");
          return;
        }
        
        setIsTokenValid(true);
        setOrganizationName(invitation.organization?.name || "Organization");
        setRole(invitation.role || "employee");
      } catch (error: any) {
        console.error("Error validating token:", error);
        toast.error("Failed to validate invitation");
        navigate("/auth/login");
      } finally {
        setIsValidatingToken(false);
      }
    };
    
    validateToken();
  }, [token, emailFromUrl, navigate]);
  
  // Handle form submission to join organization
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First, check if user exists by email
      const { data: { user } } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });
      
      toast.success("Magic link sent to your email");
      navigate("/auth/verification-sent", { 
        state: { 
          email,
          invitationToken: token,
          organizationName,
          role
        }
      });
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      toast.error(error.message || "Failed to accept invitation");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-red-600" />
            <p className="mt-2">Invalid or expired invitation</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Join {organizationName}
          </CardTitle>
          <CardDescription className="text-center">
            You've been invited to join as a {role}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (Optional)</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Join Organization"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          You'll receive a magic link via email to join the organization
        </CardFooter>
      </Card>
    </div>
  );
};

export default AcceptMagicInvitation;
