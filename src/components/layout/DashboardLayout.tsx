
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainNav } from "@/components/layout/main-nav";
import ProfileDropdown from "@/components/ProfileDropdown";

interface DashboardLayoutProps {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  navCollapsible?: boolean;
}

function DashboardLayout({
  defaultLayout = [25, 75],
  defaultCollapsed = false,
  navCollapsible = true,
}: DashboardLayoutProps) {
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
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsible={navCollapsible}
            minSize={15}
            maxSize={25}
            collapsedSize={navCollapsible ? 4 : undefined}
            defaultCollapsed={defaultCollapsed}
            className={cn(
              "hidden border-r bg-muted/40 md:block",
              defaultCollapsed ? "min-w-12" : "min-w-[50px]"
            )}
          >
            <div className="flex flex-col gap-2 p-2">
              <Sidebar />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]}>
            <main className="w-full p-4 md:p-8">
              <Outlet />
            </main>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}

export default DashboardLayout;
