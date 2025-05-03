
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";

const EmployeeWelcome = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleCreateOrganization = () => {
    navigate("/organizations");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Selamat Datang!</h1>
          <p className="mt-2 text-gray-600">
            Akun Anda belum tergabung ke organisasi. Buat organisasi baru atau tunggu undangan untuk bergabung ke organisasi yang sudah ada.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleCreateOrganization}
            className="w-full text-white bg-primary hover:bg-primary/90"
          >
            Buat Organisasi Baru
          </Button>
          
          <p className="text-center text-sm text-gray-500">atau</p>
          
          <div className="text-center text-sm">
            <p className="text-gray-600">
              Menunggu undangan? Periksa email Anda atau hubungi administrator organisasi.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWelcome;
