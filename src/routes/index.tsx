
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { rootRedirect, authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { itRoutes } from "./itRoutes";
import { settingsRoutes } from "./settingsRoutes";
import { myInfoRoutes } from "./myInfoRoutes";
import OrganizationSetup from "@/pages/onboarding/OrganizationSetup";
import EmployeeWelcome from "@/pages/employee/EmployeeWelcome";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirects to register page */}
      {rootRedirect}

      {/* Auth Routes */}
      {authRoutes}
      
      {/* Manual routes that were previously in onboardingRoutes */}
      <Route path="/onboarding" element={<OrganizationSetup />} />
      <Route path="/employee-welcome" element={<EmployeeWelcome />} />

      {/* Dashboard Routes */}
      {dashboardRoutes}

      {/* HR Routes */}
      {hrRoutes}
      
      {/* My Info Routes */}
      {myInfoRoutes}

      {/* Finance Routes */}
      {financeRoutes}

      {/* Operations Routes */}
      {operationsRoutes}
      
      {/* Marketing Routes */}
      {marketingRoutes}
      
      {/* IT Routes */}
      {itRoutes}

      {/* Settings Routes */}
      {settingsRoutes}

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
