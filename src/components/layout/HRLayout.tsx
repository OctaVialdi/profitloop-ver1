
import { ReactNode, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";

interface Tab {
  name: string;
  href: string;
  requiredRole?: "admin" | "super_admin";
}

interface HRLayoutProps {
  children: ReactNode;
}

export default function HRLayout({ children }: HRLayoutProps) {
  const location = useLocation();
  
  // Memoize tabs to prevent unnecessary re-creation
  const tabs = useMemo<Tab[]>(() => [
    { name: "Dashboard", href: "/hr/dashboard" },
    { name: "OKR", href: "/hr/okr" },
    { name: "Data Karyawan", href: "/hr/data" },
    { name: "Recruitment", href: "/hr/recruitment" }, // Added new Recruitment tab
    { name: "Absensi", href: "/hr/absensi" },
    { name: "Cuti & Izin", href: "/hr/cuti" },
    { name: "Payroll", href: "/hr/payroll" },
    { name: "Kontrak", href: "/hr/kontrak" },
    { name: "Training", href: "/hr/training" },
    { name: "Kinerja", href: "/hr/kinerja" },
    { name: "Company", href: "/hr/company" },
  ], []);
  
  const currentPath = location.pathname;
  
  // Memoize the active tab calculation to prevent recalculations on renders
  const defaultTab = useMemo(() => {
    const activeTab = tabs.find(tab => 
      currentPath === tab.href || 
      currentPath.startsWith(`${tab.href}/`)
    );
    return activeTab?.href || tabs[0]?.href;
  }, [currentPath, tabs]);

  return (
    <div className="w-full space-y-4">
      <Card className="sticky top-0 z-10 mb-4 p-1 overflow-x-auto bg-white">
        <Tabs defaultValue={defaultTab} value={defaultTab} className="w-full">
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.href} 
                value={tab.href} 
                className="min-w-[100px] transition-all duration-200 ease-in-out" 
                asChild
              >
                <Link to={tab.href}>{tab.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ 
            duration: 0.15,
            ease: "easeInOut"
          }}
          className="pb-4 page-transition"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
