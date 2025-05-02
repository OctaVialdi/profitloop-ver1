
import { Route, Routes } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { rootRedirect, authRoutes } from "./authRoutes";
import { onboardingRoutes } from "./onboardingRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { hrRoutes } from "./hrRoutes";
import { financeRoutes } from "./financeRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { marketingRoutes } from "./marketingRoutes";
import { itRoutes } from "./itRoutes";
import { settingsRoutes } from "./settingsRoutes";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirects to login */}
      {rootRedirect}

      {/* Auth Routes */}
      {authRoutes}
      
      {/* Protected Routes */}
      {onboardingRoutes}

      {/* Dashboard Routes */}
      {dashboardRoutes}

      {/* HR Routes */}
      {hrRoutes}

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

