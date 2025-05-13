
import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, FileText } from "lucide-react";

interface Tab {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const location = useLocation();
  
  const tabs: Tab[] = [
    { name: "Ads Performance", href: "/marketing/ads-performance" },
    { name: "Social Media Management", href: "/marketing/social-media" },
    { name: "Content Plan", href: "/marketing/content-plan", icon: <FileText className="mr-2 h-4 w-4" /> },
    { name: "KOL Management", href: "/marketing/kol" },
    { name: "SEO Management", href: "/marketing/seo" },
    { name: "Rating Performance", href: "/marketing/ratings" },
    { name: "Settings", href: "/marketing/settings", icon: <Settings className="mr-2 h-4 w-4" /> },
  ];
  
  const currentPath = location.pathname;
  
  // Find the active tab based on the current path
  const activeTab = tabs.find(tab => 
    currentPath === tab.href || 
    currentPath.startsWith(`${tab.href}/`)
  );
  
  // If no active tab is found, default to the first tab
  const defaultTab = activeTab?.href || tabs[0]?.href || "/marketing/ads-performance";

  return (
    <div className="w-full space-y-0">
      <Card className="sticky top-0 z-10 mb-4 p-1 overflow-x-auto bg-white shadow">
        <Tabs defaultValue={defaultTab} value={defaultTab} className="w-full">
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.href} 
                value={tab.href} 
                className="min-w-[100px] transition-all duration-200 ease-in-out" 
                asChild
              >
                <Link to={tab.href}>
                  {tab.icon ? (
                    <div className="flex items-center">
                      {tab.icon}
                      {tab.name}
                    </div>
                  ) : (
                    tab.name
                  )}
                </Link>
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
          className="pb-4 will-change-transform w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
