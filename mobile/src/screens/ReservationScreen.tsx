import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import GlassCard from "../components/GlassCard";
import { SALON_SERVICES, SALON_PRODUCTS } from "../data/salonData";
import { Appointment, StyleProfile } from "../types";
import { db } from "../firebase";
import { doc, collection, setDoc } from "firebase/firestore";

interface ReservationScreenProps {
  clientName: string;
  setClientName: (name: string) => void;
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  selectedStylist: string | null;
  setSelectedStylist: (stylist: string | null) => void;
  selectedProducts: string[];
  setSelectedProducts: (products: string[]) => void;
  aiProfile: StyleProfile | null;
  setAiProfile: (profile: StyleProfile | null) => void;
  onRedirectToWelcome: () => void;
}

const API_BASE_URL = "http://localhost:3000";

export default function ReservationScreen({
  clientName,
  setClientName,
  selectedServices,
  setSelectedServices,
  selectedStylist,
  setSelectedStylist,
  selectedProducts,
  setSelectedProducts,
  aiProfile,
  setAiProfile,
  onRedirectToWelcome,
}: ReservationScreenProps) {
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "offline">("offline");

  // Mock Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardName, setCardName] = useState("");

  const [loading, setLoading] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Appointment | null>(null);

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

  const handleCheckout = async () => {
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !selectedDate || !selectedTime) {
      Alert.alert("AURA Reservations", "Please complete guest details, reservation date, and time slot.");
      return;
    }

    if (selectedServices.length === 0) {
      Alert.alert("AURA Reservations", "Please select at least one of our signature services.");
      return;
    }

    setLoading(true);

    try {
      const finalAmount = getSubtotal();
      let paymentId = undefined;
      let status: Appointment["status"] = "pending";

      // If online card payment is selected
      if (paymentMethod === "card") {
        if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim() || !cardName.trim()) {
          throw new Error("Please complete all credit card information fields.");
        }

        // Mock payment request
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const payResponse = await fetch(`${API_BASE_URL}/api/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appointmentId: "TEMP-" + Date.now(),
              amount: finalAmount,
              cardName,
              cardNumber,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (payResponse.ok) {
            const payData = await payResponse.json();
            paymentId = payData.transactionId;
            status = "paid";
          } else {
            throw new Error("Online transaction processing declined.");
          }
        } catch (payErr) {
          console.warn("Card processing API offline, simulating secure settlement:", payErr);
          // Fallback simulation
          paymentId = "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase();
          status = "paid";
        }
      }

      const reservationId = "COR-" + Math.floor(1000 + Math.random() * 9000);

      const appointmentRecord: Appointment = {
        id: reservationId,
        clientName,
        clientEmail,
        clientPhone,
        date: selectedDate,
        time: selectedTime,
        selectedStation: selectedStylist ? 2 : 1,
        selectedServices,
        selectedStylist: selectedStylist || undefined,
        selectedProducts: selectedProducts.length > 0 ? selectedProducts : undefined,
        notes: notes.trim() ? notes : undefined,
        totalAmount: finalAmount,
        status,
        createdAt: new Date().toISOString(),
        paymentId,
      };

      if (aiProfile) {
        appointmentRecord.styleProfile = aiProfile;
      }

      // Save reservation to Firebase Firestore!
      await setDoc(doc(collection(db, "appointments"), reservationId), appointmentRecord);

      setCompletedBooking(appointmentRecord);
    } catch (err: any) {
      Alert.alert("AURA Reservations", err.message || "An issue occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!completedBooking) return;
    try {
      await Share.share({
        message: `AURA Luxury Salon Reservation Confirmed!\nReservation ID: ${completedBooking.id}\nDate: ${completedBooking.date}\nTime: ${completedBooking.time}\nAmount: LKR ${completedBooking.totalAmount.toLocaleString()}\nAddress: 14 Horton Place, Colombo 7`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetApp = () => {
    // Clear selections and reset
    setSelectedServices([]);
    setSelectedProducts([]);
    setSelectedStylist(null);
    setAiProfile(null);
    setCompletedBooking(null);
    onRedirectToWelcome();
  };

  // If completed, show luxury ticket
  if (completedBooking) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.completedContent}>
        <GlassCard style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.checkIconCircle}>
              <Feather name="check" size={24} color={COLORS.gold} />
            </View>
            <Text style={styles.ticketMainTitle}>RESERVATION CONFIRMED</Text>
            <Text style={styles.ticketSubtitle}>14 Horton Place, Colombo 7</Text>
          </View>

          <View style={styles.ticketDivider} />

          <View style={styles.ticketBody}>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>RESERVATION ID</Text>
              <Text style={[styles.ticketValue, styles.monoText]}>{completedBooking.id}</Text>
            </View>

            <View style={styles.ticketGrid}>
              <View style={styles.gridHalf}>
                <Text style={styles.ticketLabel}>GUEST</Text>
                <Text style={styles.ticketValue}>{completedBooking.clientName}</Text>
              </View>
              <View style={styles.gridHalf}>
                <Text style={styles.ticketLabel}>PHONE</Text>
                <Text style={styles.ticketValue}>{completedBooking.clientPhone}</Text>
              </View>
            </View>

            <View style={styles.ticketGrid}>
              <View style={styles.gridHalf}>
                <Text style={styles.ticketLabel}>DATE</Text>
                <Text style={styles.ticketValue}>{completedBooking.date}</Text>
              </View>
              <View style={styles.gridHalf}>
                <Text style={styles.ticketLabel}>TIME</Text>
                <Text style={styles.ticketValue}>{completedBooking.time}</Text>
              </View>
            </View>

            {completedBooking.selectedStylist && (
              <View style={styles.ticketRow}>
                <Text style={styles.ticketLabel}>MASTER ARTISAN</Text>
                <Text style={styles.ticketValue}>{completedBooking.selectedStylist}</Text>
              </View>
            )}

            <View style={styles.ticketRow}>
              <Text style={styles.ticketLabel}>SERVICES</Text>
              {completedBooking.selectedServices.map((id) => {
                const match = SALON_SERVICES.find((s) => s.id === id);
                return (
                  <Text key={id} style={styles.ticketDetailItem}>
                    • {match ? match.name : id}
                  </Text>
                );
              })}
            </View>

            <View style={[styles.ticketRow, styles.borderTopSummary]}>
              <Text style={styles.ticketLabel}>TOTAL SECURED</Text>
              <Text style={styles.ticketPrice}>LKR {completedBooking.totalAmount.toLocaleString()}</Text>
              <Text style={styles.statusLabel}>
                STATUS: {completedBooking.status === "paid" ? "SETTLED ONLINE" : "PENDING SALON SETTLEMENT"}
              </Text>
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
          <Feather name="share-2" size={14} color={COLORS.white} />
          <Text style={styles.shareBtnText}>SHARE TICKET</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.doneBtn} onPress={handleResetApp} activeOpacity={0.8}>
          <Text style={styles.doneBtnText}>BACK TO SANCTUARY</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titleEyebrow}>STATION 04 — BESPOKE CHAIR BOOKING</Text>
        <Text style={styles.titleText}>Reservation Desk</Text>
      </View>

      {/* Booking Summary */}
      <GlassCard>
        <Text style={styles.sectionLabel}>1. RESERVATION SUMMARY</Text>

        <Text style={styles.summarySubLabel}>SELECTED SERVICES:</Text>
        {selectedServices.length === 0 ? (
          <Text style={styles.emptyText}>No services selected. Go back to services.</Text>
        ) : (
          selectedServices.map((id) => {
            const match = SALON_SERVICES.find((s) => s.id === id);
            return (
              <View key={id} style={styles.summaryItemRow}>
                <Text style={styles.summaryItemName}>{match ? match.name : id}</Text>
                <Text style={styles.summaryItemPrice}>LKR {match ? match.price.toLocaleString() : 0}</Text>
              </View>
            );
          })
        )}

        {selectedProducts.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.summarySubLabel}>SELECTED PRODUCTS:</Text>
            {selectedProducts.map((id) => {
              const match = SALON_PRODUCTS.find((p) => p.id === id);
              return (
                <View key={id} style={styles.summaryItemRow}>
                  <Text style={styles.summaryItemName}>{match ? match.name : id}</Text>
                  <Text style={styles.summaryItemPrice}>LKR {match ? match.price.toLocaleString() : 0}</Text>
                </View>
              );
            })}
          </View>
        )}

        {selectedStylist && (
          <View style={styles.summaryStylistRow}>
            <Text style={styles.summarySubLabel}>ARTISAN STYLIST:</Text>
            <Text style={styles.stylistNameVal}>{selectedStylist}</Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.totalVal}>LKR {getSubtotal().toLocaleString()}</Text>
        </View>
      </GlassCard>

      {/* Guest Info */}
      <GlassCard>
        <Text style={styles.sectionLabel}>2. GUEST DETAILS</Text>

        <Text style={styles.inputTitle}>GUEST FULL NAME</Text>
        <TextInput
          style={styles.textInput}
          value={clientName}
          onChangeText={setClientName}
          placeholder="e.g. Sarah Perera"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={[styles.inputTitle, { marginTop: 12 }]}>EMAIL ADDRESS</Text>
        <TextInput
          style={styles.textInput}
          value={clientEmail}
          onChangeText={setClientEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="e.g. sarah@domain.com"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={[styles.inputTitle, { marginTop: 12 }]}>CONTACT NUMBER</Text>
        <TextInput
          style={styles.textInput}
          value={clientPhone}
          onChangeText={setClientPhone}
          keyboardType="phone-pad"
          placeholder="e.g. +94 77 123 4567"
          placeholderTextColor={COLORS.textMuted}
        />
      </GlassCard>

      {/* Date & Time */}
      <GlassCard>
        <Text style={styles.sectionLabel}>3. APPOINTMENT TIME SLOT</Text>

        <Text style={styles.inputTitle}>PREFERRED DATE (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.textInput}
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="e.g. 2026-06-30"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={[styles.inputTitle, { marginTop: 12 }]}>PREFERRED TIME SLOT (HH:MM)</Text>
        <TextInput
          style={styles.textInput}
          value={selectedTime}
          onChangeText={setSelectedTime}
          placeholder="e.g. 10:30 AM"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={[styles.inputTitle, { marginTop: 12 }]}>SPECIAL SERVICE NOTES (OPTIONAL)</Text>
        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={setNotes}
          placeholder="Describe any custom styling requirements or hair sensitivities..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={3}
        />
      </GlassCard>

      {/* Payment Option */}
      <GlassCard>
        <Text style={styles.sectionLabel}>4. PAYMENT PREFERENCE</Text>
        <View style={styles.paymentBtnRow}>
          <TouchableOpacity
            style={[styles.paymentSelectBtn, paymentMethod === "offline" && styles.paymentSelectBtnActive]}
            onPress={() => setPaymentMethod("offline")}
          >
            <Ionicons
              name={paymentMethod === "offline" ? "radio-button-on" : "radio-button-off"}
              size={14}
              color={COLORS.gold}
            />
            <Text style={styles.paymentSelectText}>Pay at Salon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentSelectBtn, paymentMethod === "card" && styles.paymentSelectBtnActive]}
            onPress={() => setPaymentMethod("card")}
          >
            <Ionicons
              name={paymentMethod === "card" ? "radio-button-on" : "radio-button-off"}
              size={14}
              color={COLORS.gold}
            />
            <Text style={styles.paymentSelectText}>Secure Card</Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === "card" && (
          <View style={styles.cardForm}>
            <Text style={styles.inputTitle}>CARDHOLDER NAME</Text>
            <TextInput
              style={styles.textInput}
              value={cardName}
              onChangeText={setCardName}
              placeholder="e.g. Sarah Perera"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={[styles.inputTitle, { marginTop: 12 }]}>CARD NUMBER</Text>
            <TextInput
              style={styles.textInput}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
              placeholder="1234 5678 1234 5678"
              placeholderTextColor={COLORS.textMuted}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardHalf}>
                <Text style={styles.inputTitle}>EXPIRY DATE</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                  placeholder="MM/YY"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
              <View style={styles.cardHalf}>
                <Text style={styles.inputTitle}>CVC SECURITY</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardCVC}
                  onChangeText={setCardCVC}
                  keyboardType="number-pad"
                  placeholder="123"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          </View>
        )}
      </GlassCard>

      {/* Checkout Action Button */}
      <TouchableOpacity
        style={styles.checkoutBtn}
        onPress={handleCheckout}
        disabled={loading || selectedServices.length === 0}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <>
            <Text style={styles.checkoutBtnText}>COMPLETE CHAIR RESERVATION</Text>
            <Feather name="lock" size={14} color={COLORS.white} />
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  completedContent: {
    padding: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  titleEyebrow: {
    fontSize: 9,
    color: COLORS.gold,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 6,
  },
  titleText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: "300",
    letterSpacing: 1.5,
  },
  sectionLabel: {
    fontSize: 9,
    color: COLORS.gold,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  summarySubLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontStyle: "italic",
  },
  summaryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  summaryItemName: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "300",
  },
  summaryItemPrice: {
    color: COLORS.white,
    fontSize: 13,
  },
  summaryStylistRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stylistNameVal: {
    color: COLORS.goldLight,
    fontSize: 13,
    fontWeight: "400",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "500",
  },
  totalVal: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  inputTitle: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  textInput: {
    color: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 5,
    fontSize: 13,
    fontWeight: "300",
    marginBottom: 8,
  },
  textArea: {
    color: COLORS.white,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 8,
    fontSize: 13,
    fontWeight: "300",
    textAlignVertical: "top",
    minHeight: 60,
  },
  paymentBtnRow: {
    flexDirection: "row",
    gap: 15,
  },
  paymentSelectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    flex: 1,
  },
  paymentSelectBtnActive: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(217, 119, 6, 0.05)",
  },
  paymentSelectText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "300",
  },
  cardForm: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 15,
  },
  cardRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 8,
  },
  cardHalf: {
    flex: 1,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 15,
    gap: 8,
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  ticketCard: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.white, // Luxury physical white ticket feel
    width: "100%",
    padding: 24,
    borderRadius: 24,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  ticketHeader: {
    alignItems: "center",
    paddingBottom: 15,
  },
  checkIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(217, 119, 6, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketMainTitle: {
    fontSize: 16,
    color: "#1c1917",
    fontWeight: "600",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  ticketSubtitle: {
    fontSize: 11,
    color: COLORS.goldDark,
    fontWeight: "500",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  ticketDivider: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#e7e5e4",
    marginVertical: 15,
  },
  ticketBody: {
    gap: 12,
  },
  ticketRow: {
    gap: 3,
  },
  ticketGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridHalf: {
    width: "48%",
    gap: 3,
  },
  ticketLabel: {
    fontSize: 8,
    color: "#78716c",
    fontWeight: "600",
    letterSpacing: 1,
  },
  ticketValue: {
    fontSize: 13,
    color: "#292524",
    fontWeight: "500",
  },
  monoText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1c1917",
  },
  ticketDetailItem: {
    fontSize: 12,
    color: "#44403c",
    fontWeight: "300",
  },
  borderTopSummary: {
    borderTopWidth: 1,
    borderTopColor: "#f5f5f4",
    paddingTop: 12,
    marginTop: 6,
  },
  ticketPrice: {
    fontSize: 20,
    color: COLORS.goldDark,
    fontWeight: "700",
    marginTop: 2,
  },
  statusLabel: {
    fontSize: 9,
    color: "#78716c",
    fontWeight: "600",
    marginTop: 4,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    borderRadius: 20,
    width: "100%",
    gap: 8,
    marginTop: 20,
  },
  shareBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  doneBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 14,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
    marginTop: 12,
  },
  doneBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
