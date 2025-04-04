
export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

// Map database response to our interface
export const mapDbAnnouncementToAnnouncement = (dbAnnouncement: any): Announcement => ({
  id: dbAnnouncement.id,
  title: dbAnnouncement.title,
  content: dbAnnouncement.content,
  created_by: dbAnnouncement.created_by,
  created_at: new Date(dbAnnouncement.created_at),
  updated_at: new Date(dbAnnouncement.updated_at),
  is_active: dbAnnouncement.is_active
});
