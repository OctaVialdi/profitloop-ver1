
import { ReactNode, memo } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useAppTheme } from "@/components/ThemeProvider";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

interface HeaderOnlyLayoutProps {
  children: ReactNode;
}

// Use memo to prevent unnecessary re-renders of the HeaderActions
const HeaderActions = memo(() => (
  <div className="flex items-center gap-3">
    <OrganizationSwitcher />
    <NotificationSystem />
    <ProfileDropdown />
  </div>
));

HeaderActions.displayName = "HeaderActions";

const HeaderOnlyLayout = ({ children }: HeaderOnlyLayoutProps) => {
  const location = useLocation();
  const { organization } = useOrganization();
  const { logoUrl } = useAppTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white border-b sticky top-0 z-10 w-full shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex-1">
            <BreadcrumbNav 
              rootLabel="Home"
              showHomeIcon={true}
            />
          </div>
          <HeaderActions />
        </div>
      </header>
      
      {/* Page content */}
      <div className="flex-1">
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
            className="page-transition"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeaderOnlyLayout;
