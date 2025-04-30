
import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  X,
  XCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    // Subscribe to changes
    const channel = supabase
      .channel('notification_changes')
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(count => count + 1);
          
          // Show toast for new notifications
          toast.info(newNotification.title, {
            description: newNotification.message,
            action: newNotification.action_url ? {
              label: 'Lihat',
              onClick: () => navigate(newNotification.action_url || '/'),
            } : undefined
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    if (data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return;
    }

    setNotifications(notifications.map(n => {
      if (n.id === id) return { ...n, read: true };
      return n;
    }));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', notifications.filter(n => !n.read).map(n => n.id));

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return;
    }

    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success("Semua notifikasi telah ditandai sebagai dibaca");
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
      setOpen(false);
    }
  };

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
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-medium">Notifikasi</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-8"
            >
              Tandai semua sudah dibaca
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Belum ada notifikasi</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start p-4 cursor-pointer hover:bg-gray-50",
                  !notification.read && "bg-blue-50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mr-3 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
