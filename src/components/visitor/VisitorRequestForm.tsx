import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface VisitorRequestFormProps {
  onSuccess?: () => void;
}

export const VisitorRequestForm = ({ onSuccess }: VisitorRequestFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setLoading(true);
      const { error } = await supabase.from("visitor_requests").insert({
        resident_id: user.id,
        host_name: formData.get("host_name"),
        host_flat_number: formData.get("host_flat_number"),
        host_contact: formData.get("host_contact"),
        visitor_name: formData.get("visitor_name"),
        visitor_phone: formData.get("visitor_phone"),
        visitor_email: formData.get("visitor_email") || null,
        expected_arrival: formData.get("expected_arrival"),
        purpose: formData.get("purpose"),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Visitor request submitted successfully",
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Host Details</h3>
        <div className="grid gap-2">
          <Label htmlFor="host_name">Host Name</Label>
          <Input
            id="host_name"
            name="host_name"
            required
            placeholder="Name of the resident being visited"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="host_flat_number">Flat Number</Label>
          <Input
            id="host_flat_number"
            name="host_flat_number"
            required
            placeholder="e.g., A-101"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="host_contact">Host Contact Number</Label>
          <Input
            id="host_contact"
            name="host_contact"
            type="tel"
            required
            placeholder="Host's contact number"
          />
        </div>

        <h3 className="text-lg font-medium pt-4">Visitor Details</h3>
        <div className="grid gap-2">
          <Label htmlFor="visitor_name">Visitor Name</Label>
          <Input
            id="visitor_name"
            name="visitor_name"
            required
            placeholder="Name of the visitor"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="visitor_phone">Visitor Contact Number</Label>
          <Input
            id="visitor_phone"
            name="visitor_phone"
            type="tel"
            required
            placeholder="Visitor's contact number"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="visitor_email">Visitor Email (Optional)</Label>
          <Input
            id="visitor_email"
            name="visitor_email"
            type="email"
            placeholder="Visitor's email address"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="expected_arrival">Expected Arrival</Label>
          <Input
            id="expected_arrival"
            name="expected_arrival"
            type="datetime-local"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="purpose">Purpose of Visit</Label>
          <Textarea
            id="purpose"
            name="purpose"
            required
            placeholder="Brief description of the visit purpose"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Request"
        )}
      </Button>
    </form>
  );
}; 

