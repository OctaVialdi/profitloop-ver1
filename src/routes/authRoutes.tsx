
import { lazy, Suspense } from "react";
import { Navigate, Route } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";

// Lazy loaded components
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerificationSent = lazy(() => import("@/pages/auth/VerificationSent"));
const AcceptInvitation = lazy(() => import("@/pages/auth/AcceptInvitation"));
const MagicLinkJoin = lazy(() => import("@/pages/auth/MagicLinkJoin"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

export const authRoutes = [
  <Route key="auth-layout" path="/auth" element={<AuthLayout />}>
    <Route index element={<Navigate to="/auth/login" replace />} />
    <Route path="login" element={
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    } />
    <Route path="register" element={
      <Suspense fallback={<LoadingFallback />}>
        <Register />
      </Suspense>
    } />
    <Route path="verification-sent" element={
      <Suspense fallback={<LoadingFallback />}>
        <VerificationSent />
      </Suspense>
    } />
  </Route>,
  <Route key="accept-invitation" path="/accept-invitation" element={
    <Suspense fallback={<LoadingFallback />}>
      <AcceptInvitation />
    </Suspense>
  } />,
  <Route key="join-organization" path="/join" element={
    <Suspense fallback={<LoadingFallback />}>
      <MagicLinkJoin />
    </Suspense>
  } />,
];

// Redirect from root to login
export const rootRedirect = <Route key="root" path="/" element={<Navigate to="/auth/login" replace />} />;
