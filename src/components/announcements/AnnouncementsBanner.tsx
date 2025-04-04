
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Announcement, mapDbAnnouncementToAnnouncement } from "@/types/announcement";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export const AnnouncementsBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Convert database fields to our interface format
        const formattedAnnouncements: Announcement[] = data.map(mapDbAnnouncementToAnnouncement);

        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  if (announcements.length === 0 || dismissed) {
    return null;
  }

  const announcement = announcements[currentIndex];

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Megaphone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-lg">{announcement.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{announcement.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted on {format(announcement.created_at, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {announcements.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {announcements.length > 1 && (
          <div className="flex justify-center mt-2 gap-1">
            {announcements.map((_, index) => (
              <span 
                key={index} 
                className={`block h-1.5 w-1.5 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-blue-300'}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
