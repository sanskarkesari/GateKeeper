
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Delivery } from "@/types/delivery";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Trash2, AlertCircle, Package, Bell } from "lucide-react";
import { format } from "date-fns";

interface DeliveriesListProps {
  onEdit: (id: string) => void;
}

const DeliveriesList = ({ onEdit }: DeliveriesListProps) => {
  const { session, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [updatedDeliveries, setUpdatedDeliveries] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  const fetchDeliveries = async () => {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .order("scheduled_date", { ascending: false });

    if (error) throw error;
    return data as Delivery[];
  };

  const { data: deliveries, isLoading, refetch } = useQuery({
    queryKey: ["deliveries"],
    queryFn: fetchDeliveries,
    enabled: !!session,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('delivery-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'deliveries'
        },
        (payload) => {
          // Mark delivery as updated with visual indicator
          if (payload.eventType === 'UPDATE') {
            setUpdatedDeliveries(prev => ({
              ...prev,
              [payload.new.id]: true
            }));
            
            // Remove the indicator after 5 seconds
            setTimeout(() => {
              setUpdatedDeliveries(prev => {
                const updated = { ...prev };
                delete updated[payload.new.id];
                return updated;
              });
            }, 5000);
          }
          
          // Refresh the deliveries list
          queryClient.invalidateQueries({ queryKey: ['deliveries'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const deleteDelivery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this delivery?")) return;

    const { error } = await supabase
      .from("deliveries")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Delivery deleted successfully",
      });
      refetch();
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading deliveries...</div>;
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No deliveries found</h3>
        <p className="text-gray-500 mt-2">
          Schedule your first delivery to get started.
        </p>
      </div>
    );
  }

  const filteredDeliveries = activeTab === "all" 
    ? deliveries 
    : deliveries.filter(delivery => delivery.status === activeTab);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      scheduled: { color: "bg-blue-100 text-blue-800", label: "Scheduled" },
      in_transit: { color: "bg-yellow-100 text-yellow-800", label: "In Transit" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };

    const { color, label } = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };
    
    return (
      <Badge className={`${color} font-normal`} variant="outline">
        {label}
      </Badge>
    );
  };

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in_transit">In Transit</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <Card 
              key={delivery.id} 
              className={`overflow-hidden transition-all duration-300 ${updatedDeliveries[delivery.id] ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-2 md:mb-0">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{delivery.delivery_name}</h3>
                      {updatedDeliveries[delivery.id] && (
                        <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                          <Bell className="h-3 w-3 mr-1" /> Updated
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 mt-2 text-sm text-gray-600">
                      {delivery.carrier && (
                        <p>Carrier: {delivery.carrier}</p>
                      )}
                      {delivery.tracking_number && (
                        <p>Tracking: {delivery.tracking_number}</p>
                      )}
                      {delivery.scheduled_date && (
                        <p>Scheduled: {format(new Date(delivery.scheduled_date), 'PPP')}</p>
                      )}
                      {delivery.notes && (
                        <p className="text-gray-500 italic">"{delivery.notes}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div>{getStatusBadge(delivery.status)}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Created: {format(new Date(delivery.created_at), 'PPp')}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-gray-50 p-2">
                <Button 
                  onClick={() => onEdit(delivery.id)} 
                  variant="outline" 
                  size="sm"
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  onClick={() => deleteDelivery(delivery.id)} 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveriesList;
