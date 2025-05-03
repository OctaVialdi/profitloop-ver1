
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Halaman tidak ditemukan</p>
        <Button 
          onClick={() => navigate("/")}
          variant="default"
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
