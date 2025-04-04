export interface MaintenanceRequest {
  id: string;
  resident_id: string;
  // Resident details
  resident_name: string;
  flat_number: string;
  contact_number: string;
  // Request details
  title: string;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  assigned_to?: string;
  completed_at?: string;
  notes?: string;
}

export interface DbMaintenanceRequest {
  id: string;
  resident_id: string;
  // Resident details
  resident_name: string;
  flat_number: string;
  contact_number: string;
  // Request details
  title: string;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'acknowledged' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  assigned_to: string | null;
  completed_at: string | null;
  notes: string | null;
}

export const mapDbMaintenanceRequestToMaintenanceRequest = (dbRequest: DbMaintenanceRequest): MaintenanceRequest => ({
  id: dbRequest.id,
  resident_id: dbRequest.resident_id,
  resident_name: dbRequest.resident_name,
  flat_number: dbRequest.flat_number,
  contact_number: dbRequest.contact_number,
  title: dbRequest.title,
  description: dbRequest.description,
  category: dbRequest.category,
  urgency: dbRequest.urgency,
  status: dbRequest.status,
  created_at: dbRequest.created_at,
  updated_at: dbRequest.updated_at,
  acknowledged_by: dbRequest.acknowledged_by || undefined,
  acknowledged_at: dbRequest.acknowledged_at || undefined,
  assigned_to: dbRequest.assigned_to || undefined,
  completed_at: dbRequest.completed_at || undefined,
  notes: dbRequest.notes || undefined,
}); 