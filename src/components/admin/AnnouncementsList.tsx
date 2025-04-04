
import { useState } from "react";
import { Announcement, mapDbAnnouncementToAnnouncement } from "@/types/announcement";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { AnnouncementForm } from "./AnnouncementForm";

interface AnnouncementsListProps {
  announcements: Announcement[];
  onUpdate: () => void;
}

export const AnnouncementsList = ({ announcements, onUpdate }: AnnouncementsListProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !announcement.is_active })
        .eq("id", announcement.id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Announcement is now ${!announcement.is_active ? "active" : "inactive"}`
      });
      
      onUpdate();
    } catch (error: any) {
      console.error("Error toggling announcement status:", error);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: error.message
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement) return;
    
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", selectedAnnouncement.id);

      if (error) throw error;

      toast({
        title: "Announcement deleted",
        description: "The announcement has been deleted successfully"
      });
      
      setDeleteDialogOpen(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting announcement:", error);
      toast({
        variant: "destructive",
        title: "Error deleting announcement",
        description: error.message
      });
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-muted/20">
        <h3 className="text-lg font-medium mb-2">No announcements yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first announcement to keep your community informed
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell className="font-medium">{announcement.title}</TableCell>
                <TableCell>{format(announcement.created_at, "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={announcement.is_active} 
                      onCheckedChange={() => handleToggleActive(announcement)}
                    />
                    <span>{announcement.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setEditSheetOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the announcement
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Announcement Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Announcement</SheetTitle>
            <SheetDescription>
              Make changes to your announcement here
            </SheetDescription>
          </SheetHeader>
          {selectedAnnouncement && (
            <AnnouncementForm 
              announcement={selectedAnnouncement}
              onSuccess={() => {
                setEditSheetOpen(false);
                onUpdate();
                toast({
                  title: "Announcement updated",
                  description: "Your announcement has been updated successfully"
                });
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
