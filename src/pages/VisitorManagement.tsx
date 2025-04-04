import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
import { Loader2, Plus } from "lucide-react";
import { VisitorRequestForm } from "@/components/visitor/VisitorRequestForm";
import { VisitorRequestsList } from "@/components/visitor/VisitorRequestsList";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const VisitorManagement = () => {
  const { session, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [visitorRequests, setVisitorRequests] = useState<VisitorRequest[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchVisitorRequests = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("visitor_requests")
          .select("*")
          .eq("resident_id", user?.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedRequests: VisitorRequest[] = data.map(mapDbVisitorRequestToVisitorRequest);
        setVisitorRequests(formattedRequests);
      } catch (error: any) {
        console.error("Error fetching visitor requests:", error);
        toast({
          variant: "destructive",
          title: "Error fetching visitor requests",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorRequests();
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
              You need to be signed in to manage visitor requests.
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
              <CardTitle className="text-2xl">Visitor Management</CardTitle>
              <CardDescription>
                Manage your visitor requests and track their status
              </CardDescription>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Visitor Request
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>New Visitor Request</SheetTitle>
                  <SheetDescription>
                    Register a new visitor to your property
                  </SheetDescription>
                </SheetHeader>
                <VisitorRequestForm 
                  onSuccess={() => {
                    handleRefresh();
                    toast({
                      title: "Visitor request created",
                      description: "Your visitor request has been submitted successfully"
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
              <VisitorRequestsList 
                requests={visitorRequests} 
                onUpdate={handleRefresh}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorManagement; 