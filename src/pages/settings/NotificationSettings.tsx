
import { useOrganization } from "@/hooks/useOrganization";

export default function NotificationSettings() {
  const { userProfile } = useOrganization();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pengaturan Notifikasi</h2>
      <p className="text-gray-600">
        Kelola preferensi notifikasi dan pemberitahuan Anda di sini.
      </p>

      {/* This content will be the same as the existing Notifications page */}
      {/* In a full implementation, you would migrate all the notifications content here */}
    </div>
  );
}
