
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeliveriesList from "@/components/deliveries/DeliveriesList";
import DeliveryForm from "@/components/deliveries/DeliveryForm";
import DeliveryNotification from "@/components/deliveries/DeliveryNotification";

const Deliveries = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [editingDeliveryId, setEditingDeliveryId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      {/* Include the notification component for real-time updates */}
      <DeliveryNotification />
      
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">My Deliveries</CardTitle>
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Delivery
            </Button>
          </CardHeader>
          <CardContent>
            {isCreating ? (
              <DeliveryForm 
                onSave={() => {
                  setIsCreating(false);
                  setEditingDeliveryId(null);
                }}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingDeliveryId(null);
                }}
              />
            ) : editingDeliveryId ? (
              <DeliveryForm 
                deliveryId={editingDeliveryId}
                onSave={() => {
                  setIsCreating(false);
                  setEditingDeliveryId(null);
                }}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingDeliveryId(null);
                }}
              />
            ) : (
              <DeliveriesList 
                onEdit={(id) => {
                  setEditingDeliveryId(id);
                  setIsCreating(false);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deliveries;
