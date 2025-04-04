import { useState } from "react";
import { useForm } from "react-hook-form";
import { Announcement } from "@/types/announcement";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  content: string;
  isActive: boolean;
}

export const AnnouncementForm = ({ announcement, onSuccess }: AnnouncementFormProps) => {
  const { adminSession } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: announcement?.title || "",
      content: announcement?.content || "",
      isActive: announcement ? announcement.is_active : true
    }
  });
  
  const isActiveValue = watch("isActive");

  const handleIsActiveChange = (checked: boolean) => {
    setValue("isActive", checked);
  };

  const onSubmit = async (data: FormValues) => {
    if (!adminSession) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "You must be logged in as an admin to perform this action."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const now = new Date().toISOString();
      const announcementData = {
        title: data.title,
        content: data.content,
        is_active: data.isActive,
        updated_at: now
      };

      if (announcement) {
        // Update existing announcement
        const { error } = await adminSupabase
          .from("announcements")
          .update(announcementData)
          .eq("id", announcement.id);
          
        if (error) {
          console.error("Update error:", error);
          throw new Error("Failed to update announcement");
        }

        toast({
          title: "Announcement Updated",
          description: "The announcement has been updated successfully."
        });
      } else {
        // Create new announcement
        const { error } = await adminSupabase
          .from("announcements")
          .insert({
            ...announcementData,
            created_by: adminSession.id,
            created_at: now
          });
          
        if (error) {
          console.error("Insert error:", error);
          throw new Error("Failed to create announcement");
        }

        toast({
          title: "Announcement Created",
          description: "The announcement has been created successfully."
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error("Error saving announcement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save announcement"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          placeholder="Enter announcement title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          rows={6}
          {...register("content", { required: "Content is required" })}
          placeholder="Enter announcement content"
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActiveValue}
          onCheckedChange={handleIsActiveChange}
        />
        <Label htmlFor="isActive">Published (visible to residents)</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {announcement ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>{announcement ? "Update Announcement" : "Create Announcement"}</>
        )}
      </Button>
    </form>
  );
};
