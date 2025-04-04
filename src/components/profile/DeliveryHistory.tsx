
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Delivery = {
  id: string;
  delivery_name: string;
  status: string;
  carrier: string | null;
  scheduled_date: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDeliveries = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('deliveries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDeliveries(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, [user, toast]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No deliveries found
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{delivery.delivery_name}</h3>
                  <Badge variant="outline" className={getStatusColor(delivery.status)}>
                    {delivery.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {delivery.carrier && (
                    <div>
                      <span className="font-medium">Carrier:</span> {delivery.carrier}
                    </div>
                  )}
                  {delivery.tracking_number && (
                    <div>
                      <span className="font-medium">Tracking:</span>{" "}
                      {delivery.tracking_number}
                    </div>
                  )}
                  {delivery.scheduled_date && (
                    <div>
                      <span className="font-medium">Scheduled:</span>{" "}
                      {format(new Date(delivery.scheduled_date), "PPP")}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {format(new Date(delivery.created_at), "PPP")}
                  </div>
                </div>
                {delivery.notes && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Notes:</span> {delivery.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
