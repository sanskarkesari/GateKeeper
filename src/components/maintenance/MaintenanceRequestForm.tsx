import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface MaintenanceRequestFormProps {
  onSuccess?: () => void;
}

const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Carpentry",
  "Cleaning",
  "Security",
  "Others",
];

const URGENCY_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const MaintenanceRequestForm = ({ onSuccess }: MaintenanceRequestFormProps) => {
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
      const { error } = await supabase.from("maintenance_requests").insert({
        resident_id: user.id,
        resident_name: formData.get("resident_name"),
        flat_number: formData.get("flat_number"),
        contact_number: formData.get("contact_number"),
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        urgency: formData.get("urgency"),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
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
        <h3 className="text-lg font-medium">Resident Details</h3>
        <div className="grid gap-2">
          <Label htmlFor="resident_name">Your Name</Label>
          <Input
            id="resident_name"
            name="resident_name"
            required
            placeholder="Your full name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="flat_number">Flat Number</Label>
          <Input
            id="flat_number"
            name="flat_number"
            required
            placeholder="e.g., A-101"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input
            id="contact_number"
            name="contact_number"
            type="tel"
            required
            placeholder="Your contact number"
          />
        </div>

        <h3 className="text-lg font-medium pt-4">Request Details</h3>
        <div className="grid gap-2">
          <Label htmlFor="title">Issue Title</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Brief title of the issue"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="urgency">Urgency Level</Label>
          <Select name="urgency" required>
            <SelectTrigger>
              <SelectValue placeholder="Select urgency level" />
            </SelectTrigger>
            <SelectContent>
              {URGENCY_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="Detailed description of the issue"
            rows={4}
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
