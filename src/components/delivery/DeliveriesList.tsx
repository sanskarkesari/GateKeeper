import { Delivery } from "@/types/delivery";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DeliveriesListProps {
  deliveries: Delivery[];
  onUpdate?: () => void;
}

export const DeliveriesList = ({ deliveries, onUpdate }: DeliveriesListProps) => {
  if (deliveries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No deliveries found
      </div>
    );
  }

  const getStatusVariant = (status: Delivery['status']) => {
    switch (status) {
      case 'delivered':
        return 'secondary';
      case 'in_transit':
        return 'default';
      case 'scheduled':
        return 'outline';
      case 'failed':
        return 'destructive';
      case 'cancelled':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Delivery Name</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id}>
              <TableCell className="font-medium">{delivery.delivery_name}</TableCell>
              <TableCell>{delivery.carrier || '-'}</TableCell>
              <TableCell>{delivery.tracking_number || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(delivery.status)}>
                  {delivery.status}
                </Badge>
              </TableCell>
              <TableCell>
                {delivery.scheduled_date 
                  ? format(new Date(delivery.scheduled_date), "PPp")
                  : '-'}
              </TableCell>
              <TableCell>
                {format(new Date(delivery.created_at), "PPp")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 