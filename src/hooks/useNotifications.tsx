
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  action_url: string | null;
  created_at: string;
  organization_id: string;
  user_id: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(notifications.map(n => {
        if (n.id === id) return { ...n, read: true };
        return n;
      }));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      toast.error("Gagal menandai notifikasi sebagai sudah dibaca");
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("Semua notifikasi telah ditandai sebagai dibaca");
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Gagal menandai semua notifikasi sebagai sudah dibaca");
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time notifications
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
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
}
