import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold mb-4">ProfitLoop</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Platform untuk mengelola dan berkolaborasi antar organisasi dengan sistem multi-tenant 
          yang aman dan terpisah.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild size="lg">
            <Link to="/auth/register">
              <UserPlus className="mr-2 h-5 w-5" />
              Daftar Sekarang
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth/login">
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Isolasi Tenant</h3>
            <p className="text-gray-600">
              Setiap organisasi memiliki data terpisah dan terisolasi dengan aman menggunakan Row Level Security.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Manajemen Peran</h3>
            <p className="text-gray-600">
              Kontrol akses dengan peran Super Admin, Admin, dan Employee untuk keamanan yang terperinci.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Sistem Subscription</h3>
            <p className="text-gray-600">
              Paket Basic, Standard, dan Premium dengan fitur berbeda dan periode trial 30 hari.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto w-full bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>ProfitLoop &copy; 2023</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
