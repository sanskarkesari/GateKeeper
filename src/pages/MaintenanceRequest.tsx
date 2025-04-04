import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceRequest, mapDbMaintenanceRequestToMaintenanceRequest } from "@/types/maintenance";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const MaintenanceRequestPage = () => {
  const { session, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("maintenance_requests")
          .select("*")
          .eq("resident_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedRequests: MaintenanceRequest[] = data.map(mapDbMaintenanceRequestToMaintenanceRequest);
        setMaintenanceRequests(formattedRequests);
      } catch (error: any) {
        console.error("Error fetching maintenance requests:", error);
        toast({
          variant: "destructive",
          title: "Error fetching maintenance requests",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, [session, user, toast, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be signed in to manage maintenance requests.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Maintenance Requests</CardTitle>
              <CardDescription>
                Submit and track maintenance requests for your property
              </CardDescription>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Request
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>New Maintenance Request</SheetTitle>
                  <SheetDescription>
                    Submit a new maintenance request for your property
                  </SheetDescription>
                </SheetHeader>
                <MaintenanceRequestForm 
                  onSuccess={() => {
                    handleRefresh();
                    toast({
                      title: "Maintenance request created",
                      description: "Your maintenance request has been submitted successfully"
                    });
                  }}
                />
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceRequestPage; 