
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
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
            ) : (
              <div className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center rounded-md font-bold">
                {organization?.name?.charAt(0) || 'O'}
              </div>
            )}
            <span className="text-lg font-medium">{organization?.name}</span>
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
            className="will-change-transform"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeaderOnlyLayout;
