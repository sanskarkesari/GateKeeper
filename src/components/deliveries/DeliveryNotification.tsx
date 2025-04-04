
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Delivery } from "@/types/delivery";
import { useToast } from "@/hooks/use-toast";
import { Bell, Package, TruckIcon, CheckCircle, XCircle } from "lucide-react";

export const DeliveryNotification = () => {
  const { toast } = useToast();
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time changes on the deliveries table
    const channel = supabase
      .channel('deliveries-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'deliveries'
        },
        (payload) => {
          const newDelivery = payload.new as Delivery;
          const oldDelivery = payload.old as Delivery;
          
          // Only show notification if status changed
          if (newDelivery.status !== oldDelivery.status) {
            const statusMessages: Record<string, string> = {
              'scheduled': 'has been scheduled',
              'in_transit': 'is now in transit',
              'delivered': 'has been delivered',
              'failed': 'failed to deliver',
              'cancelled': 'has been cancelled'
            };
            
            const statusMessage = statusMessages[newDelivery.status] || 'has been updated';
            
            const notificationMessage = `Delivery "${newDelivery.delivery_name}" ${statusMessage}`;
            setLastNotification(notificationMessage);
            
            // Instead of passing an icon directly, we format the description with the status information
            toast({
              title: `Delivery Status Updated`,
              description: notificationMessage,
              // Remove the icon property as it's not supported in the Toast type
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deliveries'
        },
        (payload) => {
          const newDelivery = payload.new as Delivery;
          
          const notificationMessage = `New delivery "${newDelivery.delivery_name}" has been created`;
          setLastNotification(notificationMessage);
          
          toast({
            title: 'New Delivery Created',
            description: notificationMessage,
            // Remove the icon property as it's not supported in the Toast type
          });
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null; // This is a notification component that doesn't render anything
};

export default DeliveryNotification;
