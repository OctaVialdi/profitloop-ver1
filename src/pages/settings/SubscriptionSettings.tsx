
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";

export default function SubscriptionSettings() {
  const { isAdmin, isSuperAdmin } = useOrganization();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, isSuperAdmin, navigate]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pengaturan Langganan</h2>
      {/* This content will be the same as the existing Subscription page */}
      <p className="text-gray-600">
        Kelola langganan dan paket berlangganan organisasi Anda di sini.
      </p>

      {/* We'll leave this as a stub for now and redirect to the original page */}
      {/* In a full implementation, you would migrate all the subscription content here */}
    </div>
  );
}
