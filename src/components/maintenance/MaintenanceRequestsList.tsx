import { MaintenanceRequest } from "@/types/maintenance";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

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

const getUrgencyColor = (urgency: MaintenanceRequest['urgency']) => {
  switch (urgency) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const MaintenanceRequestsList = ({ requests, onUpdate }: MaintenanceRequestsListProps) => {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}; 

