
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface MyInfoLayoutProps {
  children: ReactNode;
}

export default function MyInfoLayout({ children }: MyInfoLayoutProps) {
  const location = useLocation();
  
  // Extract active tab from query parameters or default to "personal"
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("tab") || "personal";
  const employeeId = queryParams.get("id");
  
  const tabs = [
    { name: "Personal", value: "personal" },
    { name: "Employment", value: "employment" },
    { name: "Education", value: "education" },
  ];

  return (
    <div className="w-full space-y-4">
      <Card className="sticky top-0 z-10 mb-4 p-1 overflow-x-auto bg-white">
        <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="min-w-[100px] transition-all duration-200 ease-in-out" 
                asChild
              >
                <Link to={`/my-info/index?id=${employeeId}&tab=${tab.value}`}>{tab.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname + location.search}
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
