import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Delivery, mapDbDeliveryToDelivery } from "@/types/delivery";
import { MaintenanceRequest, mapDbMaintenanceRequestToMaintenanceRequest } from "@/types/maintenance";
import { VisitorRequest, mapDbVisitorRequestToVisitorRequest } from "@/types/visitor";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package, Wrench, Users } from "lucide-react";
import { DeliveriesList } from "@/components/delivery/DeliveriesList";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";
import { VisitorRequestsList } from "@/components/visitor/VisitorRequestsList";

const UserDashboard = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [visitorRequests, setVisitorRequests] = useState<VisitorRequest[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }
  }, [session, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        
        // Fetch deliveries
        const { data: deliveriesData, error: deliveriesError } = await supabase
          .from("deliveries")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (deliveriesError) throw deliveriesError;
        setDeliveries(deliveriesData.map(mapDbDeliveryToDelivery));

        // Fetch maintenance requests
        const { data: maintenanceData, error: maintenanceError } = await supabase
          .from("maintenance_requests")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (maintenanceError) throw maintenanceError;
        setMaintenanceRequests(maintenanceData.map(mapDbMaintenanceRequestToMaintenanceRequest));

        // Fetch visitor requests
        const { data: visitorData, error: visitorError } = await supabase
          .from("visitor_requests")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });

        if (visitorError) throw visitorError;
        setVisitorRequests(visitorData.map(mapDbVisitorRequestToVisitorRequest));

      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, user, toast, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">My Dashboard</CardTitle>
            <CardDescription>
              View and manage your deliveries, maintenance requests, and visitor requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="deliveries" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="deliveries">
                  <Package className="mr-2 h-4 w-4" /> Deliveries
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  <Wrench className="mr-2 h-4 w-4" /> Maintenance
                </TabsTrigger>
                <TabsTrigger value="visitors">
                  <Users className="mr-2 h-4 w-4" /> Visitors
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deliveries">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">My Deliveries</h3>
                    <Button variant="outline" onClick={() => navigate("/deliveries")}>
                      View All Deliveries
                    </Button>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <DeliveriesList 
                      deliveries={deliveries}
                      onUpdate={handleRefresh}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="maintenance">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">My Maintenance Requests</h3>
                    <Button variant="outline" onClick={() => navigate("/maintenance")}>
                      View All Requests
                    </Button>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <MaintenanceRequestsList 
                      requests={maintenanceRequests}
                      onUpdate={handleRefresh}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="visitors">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">My Visitor Requests</h3>
                    <Button variant="outline" onClick={() => navigate("/visitor-management")}>
                      View All Requests
                    </Button>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <VisitorRequestsList 
                      requests={visitorRequests}
                      onUpdate={handleRefresh}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard; 