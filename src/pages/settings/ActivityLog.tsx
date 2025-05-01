
import { useState } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { Activity, User, Building, Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type ActivityType = "login" | "user_invite" | "organization_update" | "subscription_change" | "error";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

export default function ActivityLog() {
  const { isAdmin, isSuperAdmin, organization } = useOrganization();
  const [loading, setLoading] = useState(false);
  
  // Mock data - in a real app this would come from the API
  const mockActivities: ActivityItem[] = [
    {
      id: "1",
      type: "login",
      title: "Login sukses",
      description: "User login berhasil ke aplikasi",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      user: "admin@example.com"
    },
    {
      id: "2", 
      type: "user_invite",
      title: "Undangan anggota dikirim",
      description: "Undangan berhasil dikirimkan ke dokter@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      user: "admin@example.com"
    },
    {
      id: "3",
      type: "organization_update",
      title: "Profil organisasi diubah",
      description: "Informasi organisasi telah diperbarui",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      user: "admin@example.com"
    },
    {
      id: "4",
      type: "subscription_change",
      title: "Langganan diubah",
      description: "Langganan diubah dari Trial ke Basic",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      user: "admin@example.com"
    },
    {
      id: "5",
      type: "error",
      title: "Kesalahan sistem",
      description: "Terjadi kesalahan saat memproses data pasien",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    }
  ];
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "login":
        return <User className="h-4 w-4 text-blue-500" />;
      case "user_invite":
        return <Mail className="h-4 w-4 text-purple-500" />;
      case "organization_update":
        return <Building className="h-4 w-4 text-green-500" />;
      case "subscription_change":
        return <CheckCircle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="mb-4">
            <Skeleton className="h-20 w-full mb-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Audit Log</h2>
          <p className="text-gray-600">Lihat aktivitas terbaru dalam organisasi</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-md border p-4">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                {activity.user && (
                  <p className="text-xs text-gray-500 mt-2">Oleh: {activity.user}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {mockActivities.length === 0 && (
          <div className="text-center py-8 border rounded-md">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Belum ada aktivitas tercatat</p>
          </div>
        )}
      </div>
    </div>
  );
}
