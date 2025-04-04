
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Delivery, DeliveryStatus } from "@/types/delivery";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface DeliveryFormProps {
  deliveryId?: string;
  onSave: () => void;
  onCancel: () => void;
}

type FormData = {
  delivery_name: string;
  carrier?: string;
  tracking_number?: string;
  scheduled_date?: string;
  status: DeliveryStatus;
  notes?: string;
};

const DeliveryForm = ({ deliveryId, onSave, onCancel }: DeliveryFormProps) => {
  const { session, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  // Fetch delivery if editing
  const fetchDelivery = async () => {
    if (!deliveryId) return null;
    
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("id", deliveryId)
      .single();
    
    if (error) throw error;
    return data as Delivery;
  };

  const { data: delivery, isLoading } = useQuery({
    queryKey: ["delivery", deliveryId],
    queryFn: fetchDelivery,
    enabled: !!deliveryId && !!session,
  });

  // Set form values if editing
  useEffect(() => {
    if (delivery) {
      setValue("delivery_name", delivery.delivery_name);
      setValue("carrier", delivery.carrier || "");
      setValue("tracking_number", delivery.tracking_number || "");
      setValue("scheduled_date", delivery.scheduled_date ? delivery.scheduled_date.substring(0, 16) : "");
      setValue("status", delivery.status);
      setValue("notes", delivery.notes || "");
    }
  }, [delivery, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!session || !user) return;
    
    setIsSubmitting(true);
    
    try {
      if (deliveryId) {
        // Update existing delivery
        const { error } = await supabase
          .from("deliveries")
          .update({
            delivery_name: data.delivery_name,
            carrier: data.carrier,
            tracking_number: data.tracking_number,
            scheduled_date: data.scheduled_date,
            status: data.status,
            notes: data.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", deliveryId);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Delivery updated successfully",
        });
      } else {
        // Create new delivery
        const { error } = await supabase
          .from("deliveries")
          .insert({
            user_id: user.id,
            delivery_name: data.delivery_name,
            carrier: data.carrier,
            tracking_number: data.tracking_number,
            scheduled_date: data.scheduled_date,
            status: data.status,
            notes: data.notes,
          });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Delivery scheduled successfully",
        });
      }
      
      onSave();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && deliveryId) {
    return <div className="text-center py-4">Loading delivery details...</div>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {deliveryId ? "Edit Delivery" : "Schedule New Delivery"}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery_name">Delivery Name*</Label>
            <Input
              id="delivery_name"
              {...register("delivery_name", { required: "Delivery name is required" })}
              placeholder="e.g., Amazon Package, Grocery Delivery"
            />
            {errors.delivery_name && (
              <p className="text-sm text-red-500">{errors.delivery_name.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                {...register("carrier")}
                placeholder="e.g., FedEx, UPS, DHL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input
                id="tracking_number"
                {...register("tracking_number")}
                placeholder="Tracking number (if available)"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
              <Input
                id="scheduled_date"
                type="datetime-local"
                {...register("scheduled_date")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select
                onValueChange={(value) => setValue("status", value as DeliveryStatus)}
                defaultValue={deliveryId ? delivery?.status : "scheduled"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional information about the delivery"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? `${deliveryId ? "Updating" : "Scheduling"}...` 
                : deliveryId ? "Update Delivery" : "Schedule Delivery"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeliveryForm;
