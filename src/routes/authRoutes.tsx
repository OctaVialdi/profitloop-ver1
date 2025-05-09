
import { Navigate, Route } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import MagicLinkJoin from "@/pages/auth/MagicLinkJoin";

// IMPORTANT: All auth routes MUST be publicly accessible without any auth checks
// These routes should be defined BEFORE protected routes in the main route configuration
export const authRoutes = [
  <Route key="auth-layout" path="/auth" element={<AuthLayout />}>
    <Route index element={<Navigate to="/auth/login" replace />} />
    <Route path="login" element={<Login />} />
    {/* Register route - MUST be accessible without authentication */}
    <Route path="register" element={<Register />} />
    <Route path="verification-sent" element={<VerificationSent />} />
  </Route>,
  <Route key="accept-invitation" path="/accept-invitation" element={<AcceptInvitation />} />,
  <Route key="join-organization" path="/join" element={<MagicLinkJoin />} />,
];

// Redirect from root to login
export const rootRedirect = <Route key="root" path="/" element={<Navigate to="/auth/login" replace />} />;
