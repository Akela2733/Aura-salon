import React, { useState, useEffect, FormEvent } from "react";
import { db } from "../lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Appointment, SalonService, StyleProfile } from "../types";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Printer,
  Download,
  AlertCircle
} from "lucide-react";

interface BookingPortalProps {
  initialStation: number;
  aiProfile: StyleProfile | null;
  selectedServices: string[];
  setSelectedServices: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStylist: string | null;
  setSelectedStylist: React.Dispatch<React.SetStateAction<string | null>>;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  onRedirectToWelcome?: () => void;
}

export const SALON_PRODUCTS = [
  // Hair Care
  { id: "p-shampoo", name: "Professional Shampoo (Kérastase Paris)", price: 4800, description: "Nutritive lipid formulation for architectural hair shine and bounce.", category: "hair_care" },
  { id: "p-serum", name: "Hair Serum (Moroccanoil Infusion)", price: 5500, description: "Infused with pure cold-pressed argan oil to defend against humidity.", category: "hair_care" },
  { id: "p-mask", name: "Hair Mask (Aura Clay Sanctuary)", price: 6200, description: "Intense ocean silt mask with wild-harvested mint and gotukola.", category: "hair_care" },

  // Skin Care
  { id: "p-cleanser", name: "Facial Cleanser (Dermalogica Active)", price: 3900, description: "Ultra-gentle deep pore cleanser with lavender and tea tree extracts.", category: "skin_care" },
  { id: "p-toner", name: "Botanical Toner (Aveda Rose Silt)", price: 4200, description: "Rebalancing hydration spray utilizing organic micro-distilled hydrosols.", category: "skin_care" },

  // Makeup
  { id: "p-foundation", name: "HD Foundation (M·A·C Studio)", price: 7800, description: "Long-lasting camera-ready liquid foundation with SPF protection.", category: "makeup" },
  { id: "p-palette", name: "Nude Eyeshadow Palette (Anastasia)", price: 8500, description: "Sartorial Earth tones formulated with highly concentrated mineral pigments.", category: "makeup" },

  // Nail Products
  { id: "p-polish", name: "Nail Polish Collection (OPI Infinite)", price: 2800, description: "Chip-resistant rich pastel formula featuring dual-coat lacquer technology.", category: "nail" }
];

export const SALON_SERVICES: SalonService[] = [
  // Hair Services
  { id: "h-cut", name: "Haircut & Styling", duration: "45 mins", price: 2500, description: "Precision trim & signature styling mapped to your hair's geometric volume.", stationIndex: 1, category: "hair" },
  { id: "h-color", name: "Hair Coloring", duration: "90 mins", price: 12000, description: "Bespoke highlights or balayage with ammonia-free premium organic pigments.", stationIndex: 2, category: "hair" },
  { id: "h-treat", name: "Hair Treatments", duration: "60 mins", price: 8000, description: "Deep botanical restoration mask and essential oils for luxurious silk texture.", stationIndex: 1, category: "hair" },
  { id: "h-straight", name: "Hair Straightening", duration: "120 mins", price: 15000, description: "Sleek organic keratin therapy for long-lasting frizz-free shine and structure.", stationIndex: 3, category: "hair" },
  { id: "h-spa", name: "Hair Spa", duration: "50 mins", price: 4500, description: "Quiet rinse, mineral steam towel, cold eye relief, and wild mint massage.", stationIndex: 1, category: "hair" },
  { id: "h-bridal", name: "Bridal Hair Styling", duration: "90 mins", price: 10000, description: "Elegant, customized headwear-compatible hair design for your special day.", stationIndex: 4, category: "hair" },

  // Makeup Services
  { id: "m-party", name: "Party Makeup", duration: "60 mins", price: 5000, description: "Sophisticated and luminous evening look tailored for high-profile gatherings.", stationIndex: 4, category: "makeup" },
  { id: "m-bridal", name: "Bridal Makeup", duration: "120 mins", price: 25000, description: "Exquisite waterproof high-definition airbrush makeup with glowing contours.", stationIndex: 4, category: "makeup" },
  { id: "m-event", name: "Event Makeup", duration: "75 mins", price: 8000, description: "Bespoke camera-ready styling for private occasions and long-lasting wear.", stationIndex: 4, category: "makeup" },
  { id: "m-photo", name: "Photoshoot Makeup", duration: "90 mins", price: 12000, description: "Studio-balanced matte lighting application customized under specialized ring light rigs.", stationIndex: 4, category: "makeup" },

  // Nail Services
  { id: "n-mani", name: "Manicure", duration: "40 mins", price: 3000, description: "Soothing cuticle care, natural ocean mineral soak, and professional polish.", stationIndex: 0, category: "nail" },
  { id: "n-pedi", name: "Pedicure", duration: "45 mins", price: 3500, description: "Lavender sea salt scrub, pressure point foot massage, and luxury coat.", stationIndex: 0, category: "nail" },
  { id: "n-ext", name: "Nail Extensions", duration: "80 mins", price: 6000, description: "Seamless, premium quality extensions shaped to your preferred silhouette.", stationIndex: 0, category: "nail" },
  { id: "n-art", name: "Nail Art", duration: "30 mins", price: 2500, description: "Hand-painted minimal geometric lines or organic botanical patterns.", stationIndex: 0, category: "nail" },

  // Skin Care
  { id: "s-facial", name: "Facials", duration: "60 mins", price: 5000, description: "Deep botanical extraction, pore balancing, and cold-pressed oil moisture infusion.", stationIndex: 1, category: "skin" },
  { id: "s-cleanup", name: "Cleanups", duration: "45 mins", price: 3500, description: "Exfoliating sea clay peel and refresh designed for immediate radiance.", stationIndex: 1, category: "skin" },
  { id: "s-treatment", name: "Skin Treatments", duration: "75 mins", price: 10000, description: "Therapeutic vitamin-rich serum therapy and active oxygen skin hydration.", stationIndex: 1, category: "skin" },
  { id: "s-aging", name: "Anti-Aging Treatments", duration: "90 mins", price: 12000, description: "Gold leaf luxury peptide lift and microcurrent collagen stimulation.", stationIndex: 1, category: "skin" },

  // Spa Services
  { id: "sp-body", name: "Full Body Spa", duration: "90 mins", price: 9000, description: "Aromatherapy oil massage with heated river stones and full sensory alignment.", stationIndex: 1, category: "spa" },
  { id: "sp-head", name: "Head Massage", duration: "30 mins", price: 4500, description: "Traditional Ayurvedic warm oil head and neck tension relief session.", stationIndex: 1, category: "spa" },
  { id: "sp-relax", name: "Relaxation Therapy", duration: "60 mins", price: 6000, description: "Sandalwood sensory body wrap, relaxing ambient sounds, and steam therapy.", stationIndex: 1, category: "spa" },

  // Special Packages (starting prices matching pricing request)
  { id: "pkg-hair", name: "Hair Package", duration: "60 mins", price: 2500, description: "Starting package featuring signature geometric dry sculpture and conditioning.", stationIndex: 3, category: "package" },
  { id: "pkg-makeup", name: "Makeup Package", duration: "65 mins", price: 5000, description: "Starter package for evening wear and luminous glowing highlight aesthetics.", stationIndex: 4, category: "package" },
  { id: "pkg-bridal", name: "Bridal Package", duration: "180 mins", price: 25000, description: "Full luxury wedding ritual including bespoke bridal hair and waterproof makeup.", stationIndex: 5, category: "package" },
  { id: "pkg-spa", name: "Spa Package", duration: "45 mins", price: 4500, description: "Holistic bundle including Ayurvedic head massage and cold stone eye relief.", stationIndex: 1, category: "package" }
];

export default function BookingPortal({
  initialStation,
  aiProfile,
  selectedServices,
  setSelectedServices,
  selectedStylist,
  setSelectedStylist,
  selectedProducts,
  setSelectedProducts,
  onRedirectToWelcome
}: BookingPortalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "offline">("offline");

  // Credit Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Appointment | null>(null);

  // Auto-populate services or notes if they passed by some stations
  useEffect(() => {
    if (initialStation > 0 && initialStation < 5) {
      const match = SALON_SERVICES.find((s) => s.stationIndex === initialStation);
      if (match && !selectedServices.includes(match.id)) {
        setSelectedServices((prev) => [...prev, match.id]);
      }
    }
  }, [initialStation]);

  const handleServiceToggle = (id: string) => {
    if (id === "s-full") {
      if (selectedServices.includes("s-full")) {
        setSelectedServices([]);
      } else {
        setSelectedServices(["s-full"]);
      }
    } else {
      setSelectedServices((prev) => {
        const next = prev.filter((i) => i !== "s-full");
        if (next.includes(id)) {
          return next.filter((i) => i !== id);
        } else {
          return [...next, id];
        }
      });
    }
  };

  const getSubtotal = () => {
    const servicesTotal = selectedServices.reduce((sum, id) => {
      const match = SALON_SERVICES.find((s) => s.id === id);
      return sum + (match ? match.price : 0);
    }, 0);
    const productsTotal = selectedProducts.reduce((sum, id) => {
      const match = SALON_PRODUCTS.find((p) => p.id === id);
      return sum + (match ? match.price : 0);
    }, 0);
    return servicesTotal + productsTotal;
  };

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !selectedDate || !selectedTime) {
      setError("Please complete all basic client info, reservation date, and preferred time.");
      return;
    }

    if (selectedServices.length === 0) {
      setError("Please select at least one of our signature corridor services.");
      return;
    }

    setLoading(true);

    try {
      const finalAmount = getSubtotal();
      let paymentId = undefined;
      let status: Appointment["status"] = "pending";

      // If online payment is chosen, complete mock transaction with backend server first
      if (paymentMethod === "card") {
        if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim() || !cardName.trim()) {
          throw new Error("Please complete all credit card information fields.");
        }

        const payResponse = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: "TEMP-" + Date.now(),
            amount: finalAmount,
            cardName,
            cardNumber
          })
        });

        if (!payResponse.ok) {
          const errData = await payResponse.json();
          throw new Error(errData.error || "Online transaction processing failed.");
        }

        const payData = await payResponse.json();
        if (payData.success) {
          paymentId = payData.transactionId;
          status = "paid";
        }
      }

      // Generate pristine unique reservation code
      const reservationId = "COR-" + Math.floor(1000 + Math.random() * 9000);

      const appointmentRecord: Appointment = {
        id: reservationId,
        clientName,
        clientEmail,
        clientPhone,
        date: selectedDate,
        time: selectedTime,
        selectedStation: initialStation,
        selectedServices,
        selectedStylist: selectedStylist || undefined,
        selectedProducts: selectedProducts.length > 0 ? selectedProducts : undefined,
        notes: notes.trim() ? notes : undefined,
        totalAmount: finalAmount,
        status,
        createdAt: new Date().toISOString(),
        paymentId
      };

      if (aiProfile) {
        appointmentRecord.styleProfile = aiProfile;
      }

      // Save reservation document persistently to Firestore!

      // Save reservation document persistently to Firestore!
      await setDoc(doc(collection(db, "appointments"), reservationId), appointmentRecord);

      // Save to localStorage for client caching
      localStorage.setItem("corridor_active_booking", JSON.stringify(appointmentRecord));

      setCompletedBooking(appointmentRecord);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An issue occurred during checkout processing.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  }  // If completed, show luxury ticket
  if (completedBooking) {
    return (
      <div className="mt-5 rounded-3xl border border-amber-600/15 bg-white p-8 md:p-10 shadow-[0_20px_50px_rgba(180,136,67,0.08)] text-left max-w-2xl mx-auto print:border-none print:bg-white print:text-black text-neutral-800 animate-fade-in">
        <div className="text-center pb-6 border-b border-neutral-100 font-sans">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-display text-xl md:text-2xl font-light uppercase tracking-widest text-neutral-950">
            Reservation Confirmed
          </h3>
          <p className="font-mono text-sm text-amber-800">14 Horton Place, Colombo 7</p>
        </div>

        {/* Ticket Body */}
        <div className="mt-8 space-y-6 text-sm">
          <div className="flex justify-between border-b border-neutral-100 pb-3">
            <span className="font-mono text-xs text-neutral-400 uppercase font-semibold">Reservation ID</span>
            <span className="font-mono text-sm font-bold text-neutral-800">{completedBooking.id}</span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <span className="block font-mono text-xs text-neutral-400 uppercase font-semibold">Guest</span>
              <span className="font-sans text-sm text-neutral-700">{completedBooking.clientName}</span>
            </div>
            <div>
              <span className="block font-mono text-xs text-neutral-400 uppercase font-semibold">Phone</span>
              <span className="font-sans text-sm text-neutral-700">{completedBooking.clientPhone}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <div>
                <span className="block font-mono text-xs text-neutral-400 uppercase font-semibold">Date</span>
                <span className="font-sans text-sm text-neutral-700">{completedBooking.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <div>
                <span className="block font-mono text-xs text-neutral-400 uppercase font-semibold">Time</span>
                <span className="font-sans text-sm text-neutral-700">{completedBooking.time}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <span className="block font-mono text-xs text-neutral-400 uppercase font-semibold mb-2">Booked Services</span>
            <ul className="space-y-2">
              {completedBooking.selectedServices.map((sid) => {
                const match = SALON_SERVICES.find((s) => s.id === sid);
                return (
                  <li key={sid} className="flex justify-between text-sm font-sans text-neutral-600">
                    <span>{match?.name}</span>
                    <span className="font-mono text-sm text-neutral-500">LKR {match?.price.toLocaleString()}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {completedBooking.selectedProducts && completedBooking.selectedProducts.length > 0 && (
            <div className="border-t border-neutral-100 pt-4">
              <span className="block font-mono text-xs text-neutral-400 uppercase font-semibold mb-2">Botanical Products Kit</span>
              <ul className="space-y-2">
                {completedBooking.selectedProducts.map((pid) => {
                  const match = SALON_PRODUCTS.find((p) => p.id === pid);
                  return (
                    <li key={pid} className="flex justify-between text-sm font-sans text-neutral-600">
                      <span>{match?.name}</span>
                      <span className="font-mono text-sm text-neutral-500">LKR {match?.price.toLocaleString()}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {completedBooking.selectedStylist && (
            <div className="rounded-xl bg-amber-50/20 p-4 border border-amber-600/10 text-sm text-neutral-600">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-800 font-semibold block mb-1">Assigned Artisan Stylist</span>
              <span className="font-sans text-sm text-neutral-700">{completedBooking.selectedStylist}</span>
            </div>
          )}

          {/* Custom pigment/aroma details removed */}

          {completedBooking.styleProfile && (
            <div className="rounded-xl bg-amber-50/20 p-4 border border-amber-600/10 text-sm text-neutral-600">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-800 font-semibold block mb-1">AI Consult Hair Type</span>
              <p className="font-sans text-sm">{completedBooking.styleProfile.hairType} — Custom Silhouette planned</p>
            </div>
          )}

          <div className="flex justify-between border-t border-b border-neutral-100 py-4 mt-6">
            <span className="font-mono text-sm uppercase text-neutral-800 font-bold">Total Settlement</span>
            <span className="font-mono text-base font-bold text-amber-700">
              LKR {completedBooking.totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
            <span>Status: {completedBooking.status.toUpperCase()}</span>
            {completedBooking.paymentId && (
              <span>TXN: {completedBooking.paymentId}</span>
            )}
          </div>
        </div>

        {/* Barcode representation */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-dashed border-neutral-200 pt-6">
          <div className="flex h-14 w-60 justify-between bg-white p-1.5 rounded-sm overflow-hidden border border-neutral-100">
            {[1, 3, 2, 4, 1, 3, 2, 4, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2].map((w, i) => (
              <div key={i} className="bg-neutral-900 h-full" style={{ width: `${w * 3}px` }} />
            ))}
          </div>
          <span className="font-mono text-xs text-neutral-400">COR-{completedBooking.id}-COLOMBO</span>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row print:hidden">
          <button
            onClick={handlePrint}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-black/40 py-3 text-xs font-mono uppercase tracking-wider text-white hover:border-amber-500/50 hover:text-amber-300 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print Ticket
          </button>
          <button
            onClick={() => {
              setCompletedBooking(null);
              if (onRedirectToWelcome) onRedirectToWelcome();
            }}
            type="button"
            className="flex-1 flex items-center justify-center gap-2.5 rounded-lg btn-ghost-gold py-3 text-xs font-mono uppercase tracking-wider cursor-pointer"
          >
            New Walkthrough
          </button>
          <button
            onClick={() => setCompletedBooking(null)}
            type="button"
            className="flex-1 flex items-center justify-center gap-2.5 rounded-lg bg-amber-600 py-3 text-xs font-mono uppercase tracking-wider text-white hover:bg-amber-700 transition-all shadow-sm cursor-pointer"
          >
            New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleCheckout} className="mt-6 glass-card rounded-2xl p-6 md:p-10 text-left text-white animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
        <Calendar className="h-6 w-6 text-amber-400 animate-pulse" />
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Reserve a Chair</h3>
          <p className="font-sans text-xs text-white/50">Colombo 7 Design Studio — Online Concierge</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Guest info */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Your Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-white/30" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Jane Perera"
                className="glass-input w-full rounded-lg p-3 pl-10 font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-white/30" />
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="e.g., jane@mail.com"
                className="glass-input w-full rounded-lg p-3 pl-10 font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 h-4 w-4 text-white/30" />
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g., +94 77 123 4567"
                className="glass-input w-full rounded-lg p-3 pl-10 font-sans text-sm"
              />
            </div>
          </div>
        </div>

        {/* Date / Time */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Reservation Date
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="glass-input w-full rounded-lg p-3 font-mono text-sm [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Preferred Session Slot
            </label>
            <select
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="glass-input w-full rounded-lg p-3 font-mono text-sm"
            >
              <option value="">Select slot...</option>
              <option value="10:00">10:00 AM (Morning session)</option>
              <option value="11:30">11:30 AM (Midday session)</option>
              <option value="13:30">01:30 PM (Afternoon session)</option>
              <option value="15:00">03:00 PM (Late session)</option>
              <option value="17:00">05:00 PM (Sunset session)</option>
            </select>
          </div>
        </div>

        {/* Services Checklist */}
        <div>
          <label className="mb-3 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
            Select Corridor Stations / Services
          </label>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1.5 hud-scroll">
            {SALON_SERVICES.map((serv) => {
              const active = selectedServices.includes(serv.id);
              return (
                <button
                  type="button"
                  key={serv.id}
                  onClick={() => handleServiceToggle(serv.id)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                    active
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-white/10 bg-white/5 hover:border-amber-500/25"
                  }`}
                >
                  <div
                    className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center flex-none transition-all ${
                      active ? "border-amber-500 bg-amber-500 text-white" : "border-white/20 bg-white/5"
                    }`}
                  >
                    {active && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans text-sm font-semibold text-white">{serv.name}</span>
                      <span className="font-mono text-sm font-medium text-amber-400">
                        LKR {serv.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-white/40 leading-relaxed mt-1">{serv.description}</p>
                    <span className="inline-block mt-2 font-mono text-xs uppercase px-2 py-0.5 rounded gold-badge">
                      Duration: {serv.duration}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom requirements */}
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
            Stylist Requests / Special Instructions
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Allergic to standard dyes, prefer senior hair architect, or specific hair history."
            rows={2}
            className="glass-input w-full rounded-lg p-3.5 font-sans text-sm"
          />
        </div>

        {/* State Indicators */}
        {(aiProfile || selectedStylist || selectedProducts.length > 0) && (
          <div className="flex flex-wrap gap-2.5 rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 text-xs">
            {aiProfile && (
              <span className="flex items-center gap-1.5 font-mono gold-badge px-2.5 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5" /> AI Profile Active
              </span>
            )}
            {/* Scent indicator removed */}
            {selectedStylist && (
              <span className="flex items-center gap-1.5 font-mono gold-badge px-2.5 py-1 rounded-full">
                👤 Stylist: {selectedStylist}
              </span>
            )}
            {selectedProducts.length > 0 && (
              <span className="flex items-center gap-1.5 font-mono gold-badge px-2.5 py-1 rounded-full">
                📦 {selectedProducts.length} Product{selectedProducts.length > 1 ? "s" : ""} Selected
              </span>
            )}
          </div>
        )}

        {/* Payment options */}
        <div className="border-t border-white/10 pt-5">
          <label className="mb-3 block font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
            Payment Alignment
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("offline")}
              className={`rounded-xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                paymentMethod === "offline"
                  ? "border-amber-500/50 bg-amber-500/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-amber-500/30"
              }`}
            >
              <div className="font-sans text-sm font-semibold">Reserve & Pay Later</div>
              <p className="font-sans text-xs text-white/40 leading-relaxed mt-1">
                Reserve the chair instantly. Complete payment at Colombo 7.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`rounded-xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                paymentMethod === "card"
                  ? "border-amber-500/50 bg-amber-500/10 text-white"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-amber-500/30"
              }`}
            >
              <div className="font-sans text-sm font-semibold flex items-center gap-1.5">
                Pay Securely Online <Lock className="h-4 w-4 text-amber-400" />
              </div>
              <p className="font-sans text-xs text-white/40 leading-relaxed mt-1">
                Complete fully-certified transaction now to secure early-bird pricing.
              </p>
            </button>
          </div>
        </div>

        {/* Online Card Form Details */}
        {paymentMethod === "card" && (
          <div className="border border-amber-500/20 bg-black/30 p-5 space-y-4 rounded-xl animate-fade-in">
            <span className="block font-mono text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
              Secure Online Gateway Credit Card
            </span>

            <div>
              <label className="block font-mono text-[10px] text-amber-400 font-bold uppercase mb-1">Cardholder Name</label>
              <input
                type="text"
                required={paymentMethod === "card"}
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Jane Perera"
                className="glass-input w-full rounded-lg p-3 font-sans text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-amber-400 font-bold uppercase mb-1">Card Number</label>
              <div className="relative flex items-center">
                <CreditCard className="absolute left-3.5 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  required={paymentMethod === "card"}
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
                    setCardNumber(val);
                  }}
                  placeholder="4111 2222 3333 4444"
                  className="glass-input w-full rounded-lg p-3 pl-10 font-sans text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[10px] text-amber-400 font-bold uppercase mb-1">Expiration Date</label>
                <input
                  type="text"
                  required={paymentMethod === "card"}
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="glass-input w-full rounded-lg p-3 font-mono text-sm text-center"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-amber-400 font-bold uppercase mb-1">Security CVC</label>
                <input
                  type="password"
                  required={paymentMethod === "card"}
                  maxLength={3}
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value)}
                  placeholder="***"
                  className="glass-input w-full rounded-lg p-3 font-mono text-sm text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary pricing */}
        <div className="flex justify-between border-t border-neutral-100 pt-5">
          <span className="font-mono text-sm uppercase text-neutral-500 font-bold">Consolidated Subtotal</span>
          <span className="font-mono text-base font-bold text-amber-700">
            LKR {getSubtotal().toLocaleString()}
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3.5 text-xs font-mono text-red-600">
            <AlertCircle className="h-4 w-4 flex-none" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-4 text-sm font-mono uppercase tracking-widest text-white transition-all duration-300 hover:bg-amber-700 disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {loading ? (
            "Booking your chair..."
          ) : (
            <>
              Confirm Booking & Complete Checkout <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
