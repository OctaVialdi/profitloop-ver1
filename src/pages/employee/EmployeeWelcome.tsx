
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Building } from "lucide-react";

const EmployeeWelcome = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth/login');
          return;
        }
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, organization_id')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile) {
          setUsername(profile.full_name || session.user.email);
          
          // If the user doesn't have an organization, redirect to create one
          if (!profile.organization_id) {
            navigate('/organizations');
            return;
          }
          
          // Get organization details
          const { data: orgData } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', profile.organization_id)
            .maybeSingle();
            
          if (orgData) {
            setOrganization(orgData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold mt-4">Selamat Datang, {username}!</CardTitle>
          <CardDescription>
            {organization ? (
              <>Anda telah bergabung dengan <span className="font-semibold">{organization.name}</span></>
            ) : (
              'Selamat datang di aplikasi kami'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
            <p className="font-medium mb-1">Anda memiliki masa trial selama 14 hari</p>
            <p>Manfaatkan masa trial Anda untuk menjelajahi semua fitur premium yang tersedia.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate('/dashboard')}
          >
            Mulai Menggunakan Aplikasi
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmployeeWelcome;
