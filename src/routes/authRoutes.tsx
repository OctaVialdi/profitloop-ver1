
import { Navigate, Route } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerificationSent from "@/pages/auth/VerificationSent";
import AcceptInvitation from "@/pages/auth/AcceptInvitation";
import MagicLinkJoin from "@/pages/auth/MagicLinkJoin";

export const authRoutes = [
  <Route key="auth-layout" path="/auth" element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="verification-sent" element={<VerificationSent />} />
  </Route>,
  <Route key="accept-invitation" path="/accept-invitation" element={<AcceptInvitation />} />,
  <Route key="join-organization" path="/join" element={<MagicLinkJoin />} />,
];

// Redirect from root to login
export const rootRedirect = <Route key="root" path="/" element={<Navigate to="/auth/login" replace />} />;
