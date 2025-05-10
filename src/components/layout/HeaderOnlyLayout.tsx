
import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainNav } from "@/components/layout/main-nav";
import ProfileDropdown from "@/components/ProfileDropdown";

function HeaderOnlyLayout() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4 shadow-sm">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
        <main className="w-full p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  );
}

export default HeaderOnlyLayout;
