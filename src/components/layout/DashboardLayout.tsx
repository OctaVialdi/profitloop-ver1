
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { SidebarContainer } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useOrganization } from "@/hooks/useOrganization";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isLoading } = useOrganization();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
            <p>Memuat data organisasi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarContainer>
      <DashboardHeader />
      <div className="flex-1 bg-gray-50 p-4 md:p-6">
        {children || <Outlet />}
      </div>
    </SidebarContainer>
  );
};

export default DashboardLayout;
