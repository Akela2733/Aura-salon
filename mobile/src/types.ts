export interface StyleProfile {
  hairType: string;
  hairConcerns: string[];
  desiredStyle: string;
  aiRecommendation: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  selectedStation: number;
  selectedServices: string[];
  notes?: string;
  selectedStylist?: string;
  selectedProducts?: string[];
  totalAmount: number;
  status: "pending" | "confirmed" | "paid" | "cancelled";
  styleProfile?: StyleProfile;
  createdAt: string;
  paymentId?: string;
}

export interface SalonService {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  stationIndex: number;
  category?: string;
}

export interface SalonProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}
