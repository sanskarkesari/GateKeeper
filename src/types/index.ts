
export type UserRole = "resident" | "admin" | "security";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  mfaEnabled: boolean;
  lastLogin: Date;
}

export interface Delivery {
  id: string;
  residentId: string;
  scheduledTime: Date;
  status: "pending" | "delivered" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  userId: string;
  address: string;
  unit: string;
  preferredNotifications: ("email" | "push" | "sms")[];
}
