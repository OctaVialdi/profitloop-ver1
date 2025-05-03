
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface MyInfoLayoutProps {
  children: ReactNode;
}

export default function MyInfoLayout({ children }: MyInfoLayoutProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get("id");
  
  // Extract active tab from the path instead of query parameters
  const path = location.pathname.split('/');
  const currentPath = path[path.length - 1];
  
  // Map path to tab value for the Tabs component
  const getTabFromPath = (path: string) => {
    switch(path) {
      case 'personal': return 'personal';
      case 'employment': return 'employment';
      case 'education': return 'education';
      default: return 'personal';
    }
  };
  
  const activeTab = getTabFromPath(currentPath);
  
  const tabs = [
    { name: "Personal", value: "personal", path: `/my-info/personal` },
    { name: "Employment", value: "employment", path: `/my-info/employment` },
    { name: "Education", value: "education", path: `/my-info/education` },
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
                <Link to={`${tab.path}?id=${employeeId}`}>{tab.name}</Link>
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
