export interface VisitorRequest {
  id: string;
  resident_id: string;
  // Host details
  host_name: string;
  host_flat_number: string;
  host_contact: string;
  // Visitor details
  visitor_name: string;
  visitor_phone: string;
  visitor_email?: string;
  expected_arrival: string;
  purpose: string;
  status: 'pending' | 'approved' | 'denied' | 'completed';
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  actual_arrival?: string;
  actual_departure?: string;
}

export interface DbVisitorRequest {
  id: string;
  resident_id: string;
  // Host details
  host_name: string;
  host_flat_number: string;
  host_contact: string;
  // Visitor details
  visitor_name: string;
  visitor_phone: string;
  visitor_email: string | null;
  expected_arrival: string;
  purpose: string;
  status: 'pending' | 'approved' | 'denied' | 'completed';
  created_at: string;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
  actual_arrival: string | null;
  actual_departure: string | null;
}

export const mapDbVisitorRequestToVisitorRequest = (dbVisitor: DbVisitorRequest): VisitorRequest => ({
  id: dbVisitor.id,
  resident_id: dbVisitor.resident_id,
  host_name: dbVisitor.host_name,
  host_flat_number: dbVisitor.host_flat_number,
  host_contact: dbVisitor.host_contact,
  visitor_name: dbVisitor.visitor_name,
  visitor_phone: dbVisitor.visitor_phone,
  visitor_email: dbVisitor.visitor_email || undefined,
  expected_arrival: dbVisitor.expected_arrival,
  purpose: dbVisitor.purpose,
  status: dbVisitor.status,
  created_at: dbVisitor.created_at,
  updated_at: dbVisitor.updated_at,
  approved_by: dbVisitor.approved_by || undefined,
  approved_at: dbVisitor.approved_at || undefined,
  actual_arrival: dbVisitor.actual_arrival || undefined,
  actual_departure: dbVisitor.actual_departure || undefined,
}); 