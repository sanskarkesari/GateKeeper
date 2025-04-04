import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import { Announcement, mapDbAnnouncementToAnnouncement } from "@/types/announcement";
import { VisitorRequest, mapDbVisitorRequestToVisitorRequest } from "@/types/visitor";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, RefreshCw, Users, Wrench, ArrowLeft } from "lucide-react";
import { AnnouncementsList } from "@/components/admin/AnnouncementsList";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { VisitorRequestsList } from "@/components/admin/VisitorRequestsList";
import { MaintenanceRequestsList } from "@/components/admin/MaintenanceRequestsList";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const AdminDashboard = () => {
  const { adminSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [visitorRequests, setVisitorRequests] = useState<VisitorRequest[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!adminSession) {
      // Store the current location before redirecting
      const currentPath = location.pathname;
      navigate("/auth", { state: { from: currentPath } });
      return;
    }
  }, [adminSession, navigate, location]);

  useEffect(() => {
    const fetchData = async () => {
      if (!adminSession) return;
      
      try {
        setLoading(true);
        
        // Fetch announcements
        const { data: announcementsData, error: announcementsError } = await adminSupabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false });

        if (announcementsError) throw announcementsError;
        setAnnouncements(announcementsData.map(mapDbAnnouncementToAnnouncement));

        // Fetch visitor requests
        const { data: visitorData, error: visitorError } = await adminSupabase
          .from("visitor_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (visitorError) throw visitorError;
        setVisitorRequests(visitorData.map(mapDbVisitorRequestToVisitorRequest));

        // Fetch maintenance requests
        const { data: maintenanceData, error: maintenanceError } = await adminSupabase
          .from("maintenance_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (maintenanceError) throw maintenanceError;
        setMaintenanceRequests(maintenanceData.map(mapDbMaintenanceRequestToMaintenanceRequest));

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
  }, [adminSession, toast, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!adminSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>
                Manage your community announcements, visitors, and maintenance requests
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="announcements" className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="visitors">
                  <Users className="mr-2 h-4 w-4" /> Visitors
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  <Wrench className="mr-2 h-4 w-4" /> Maintenance
                </TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="announcements">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Community Announcements</h3>
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Announcement
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>New Announcement</SheetTitle>
                        <SheetDescription>
                          Create a new announcement for your community
                        </SheetDescription>
                      </SheetHeader>
                      <AnnouncementForm 
                        onSuccess={() => {
                          setSheetOpen(false);
                          handleRefresh();
                          toast({
                            title: "Announcement created",
                            description: "Your announcement has been created successfully"
                          });
                        }}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <AnnouncementsList 
                    announcements={announcements}
                    onUpdate={handleRefresh}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="visitors">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visitor Requests</h3>
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
              
              <TabsContent value="maintenance">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Maintenance Requests</h3>
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
              
              <TabsContent value="users">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">User Management</h3>
                  <p className="text-muted-foreground">
                    This feature is coming soon...
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
