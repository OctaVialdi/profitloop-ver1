
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Check, Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    unreadCount 
  } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifikasi</h1>
            <p className="text-gray-600">
              Lihat semua notifikasi dan informasi penting terkait organisasi Anda
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tandai Semua Sudah Dibaca
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Info className="h-16 w-16 text-blue-200 mb-4" />
                <h3 className="font-medium text-lg mb-1">Tidak Ada Notifikasi</h3>
                <p className="text-gray-500 text-center">
                  Anda belum memiliki notifikasi. Notifikasi akan muncul ketika ada informasi penting.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={cn(
                  "overflow-hidden transition-all hover:shadow-md cursor-pointer",
                  !notification.read && "border-l-4 border-l-blue-500"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex p-4">
                  <div className="mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn("font-medium", !notification.read && "font-semibold")}>
                        {notification.title}
                      </h3>
                      <div className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    {notification.action_url && (
                      <div className="mt-2">
                        <Button size="sm" variant="outline">
                          Buka
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
