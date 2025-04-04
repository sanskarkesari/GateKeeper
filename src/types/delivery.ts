export type DeliveryStatus = 'scheduled' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';

export interface Delivery {
  id: string;
  user_id: string;
  delivery_name: string;
  carrier?: string;
  tracking_number?: string;
  scheduled_date?: string;
  status: DeliveryStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbDelivery {
  id: string;
  user_id: string;
  delivery_name: string;
  carrier: string;
  tracking_number: string;
  scheduled_date: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const mapDbDeliveryToDelivery = (dbDelivery: DbDelivery): Delivery => ({
  ...dbDelivery,
  status: dbDelivery.status as DeliveryStatus,
});
