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

export interface ColorFormula {
  baseR: number;
  baseG: number;
  baseB: number;
  toneR: number;
  toneG: number;
  toneB: number;
  mixRatio: number; // 0 to 1
  selectedPigment: string;
}
