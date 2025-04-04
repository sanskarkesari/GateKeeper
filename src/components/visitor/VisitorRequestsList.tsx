import { VisitorRequest } from "@/types/visitor";
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

interface VisitorRequestsListProps {
  requests: VisitorRequest[];
  onUpdate: () => void;
}

const getStatusColor = (status: VisitorRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'denied':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const VisitorRequestsList = ({ requests }: VisitorRequestsListProps) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No visitor requests found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visitor Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Expected Arrival</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.visitor_name}</TableCell>
              <TableCell>
                <div>
                  <div>{request.visitor_phone}</div>
                  {request.visitor_email && (
                    <div className="text-sm text-muted-foreground">
                      {request.visitor_email}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(request.expected_arrival), "MMM d, yyyy h:mm a")}
              </TableCell>
              <TableCell>{request.purpose}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(request.created_at), "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 
