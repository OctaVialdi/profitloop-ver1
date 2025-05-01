
import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/useOrganization";
import { AnimatePresence, motion } from "framer-motion";

interface Tab {
  name: string;
  href: string;
  requiredRole?: "admin" | "super_admin";
}

interface FinanceLayoutProps {
  children: ReactNode;
}

export default function FinanceLayout({ children }: FinanceLayoutProps) {
  const location = useLocation();
  const { isAdmin, isSuperAdmin } = useOrganization();
  
  const tabs: Tab[] = [
    { name: "Dashboard", href: "/finance/dashboard" },
    { name: "Expenses", href: "/finance/expenses" },
    { name: "Income Target", href: "/finance/income-target" },
    { name: "Reminder Bills", href: "/finance/reminder-bills" },
    { name: "Bill Approvals", href: "/finance/reminder-bills/approvals" },
    { name: "Payroll Summary", href: "/finance/payroll-summary" },
    { name: "Cash Management", href: "/finance/cash-management" },
  ];
  
  const filteredTabs = tabs.filter(tab => {
    if (!tab.requiredRole) return true;
    if (tab.requiredRole === "admin" && (isAdmin || isSuperAdmin)) return true;
    if (tab.requiredRole === "super_admin" && isSuperAdmin) return true;
    return false;
  });

  const currentPath = location.pathname;
  
  // Find the active tab based on the current path
  const activeTab = filteredTabs.find(tab => 
    currentPath === tab.href || 
    (currentPath.startsWith(`${tab.href}/`) && tab.href !== "/finance")
  );
  
  // If no active tab is found, default to the first tab
  const defaultTab = activeTab?.href || filteredTabs[0]?.href || "/finance/dashboard";

  return (
    <div className="w-full space-y-4">
      <Card className="sticky top-0 z-10 mb-4 p-1 overflow-x-auto bg-white">
        <Tabs defaultValue={defaultTab} value={defaultTab} className="w-full">
          <TabsList className="w-full justify-start">
            {filteredTabs.map((tab) => (
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
          className="pb-4 will-change-transform"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
