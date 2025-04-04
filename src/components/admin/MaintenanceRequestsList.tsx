import { MaintenanceRequest } from "@/types/maintenance";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MaintenanceRequestsListProps {
  requests: MaintenanceRequest[];
  onUpdate: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "acknowledged":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const MaintenanceRequestsList = ({ requests, onUpdate }: MaintenanceRequestsListProps) => {
  const { toast } = useToast();

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("maintenance_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Maintenance request has been ${newStatus}`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message,
      });
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No maintenance requests found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Urgency</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.title}</TableCell>
            <TableCell>{request.category}</TableCell>
            <TableCell>
              <Badge variant={request.urgency === "high" ? "destructive" : "secondary"}>
                {request.urgency}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(request.status)}>
                {request.status.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>{format(new Date(request.created_at), "MMM d, yyyy")}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {request.status === "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(request.id, "acknowledged")}
                  >
                    Acknowledge
                  </Button>
                )}
                {request.status === "acknowledged" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(request.id, "in_progress")}
                  >
                    Start Work
                  </Button>
                )}
                {request.status === "in_progress" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(request.id, "completed")}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}; 