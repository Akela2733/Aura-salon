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
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import GlassCard from "../components/GlassCard";
import { StyleProfile } from "../types";

interface AiConsultationScreenProps {
  clientName: string;
  setClientName: (name: string) => void;
  aiProfile: StyleProfile | null;
  setAiProfile: (profile: StyleProfile | null) => void;
  onNext: () => void;
}

const HAIR_TYPES = ["Straight (1A-1C)", "Wavy (2A-2C)", "Curly (3A-3C)", "Coily (4A-4C)"];

const HAIR_CONCERNS_LIST = [
  "High Tropical Humidity Frizz",
  "Sun & Chlorine Dryness",
  "Lacking Volume & Bounce",
  "Scalp Sensitivity / Hydration",
  "Heat & Chemical Damage",
  "Density & Thinning Management",
];

// Configurable API base url. Change to your local machine IP (e.g., http://192.168.1.50:3000) for native dev
const API_BASE_URL = "http://localhost:3000";

export default function AiConsultationScreen({
  clientName,
  setClientName,
  aiProfile,
  setAiProfile,
  onNext,
}: AiConsultationScreenProps) {
  const [hairType, setHairType] = useState(HAIR_TYPES[0]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [desiredStyle, setDesiredStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [consultationResult, setConsultationResult] = useState<string | null>(
    aiProfile?.aiRecommendation || null
  );

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const generateProfile = async () => {
    if (!clientName.trim()) {
      Alert.alert("AURA Sanctuary", "Please enter your name to personalize your style profile.");
      return;
    }
    if (!desiredStyle.trim()) {
      Alert.alert("AURA Sanctuary", "Please describe your desired hairstyle or structural aesthetic.");
      return;
    }

    setLoading(true);
    setConsultationResult(null);

    try {
      // Attempt connection to the local node API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

      const response = await fetch(`${API_BASE_URL}/api/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hairType,
          hairConcerns: selectedConcerns,
          desiredStyle,
          clientName,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("HTTP error status code: " + response.status);
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setConsultationResult(data.recommendation);
      setAiProfile({
        hairType,
        hairConcerns: selectedConcerns,
        desiredStyle,
        aiRecommendation: data.recommendation,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn("API endpoint failed, using premium local fallback simulator:", err.message);

      // Elegant high-end client-side fallback
      const fallbackRec = `✦ THE ANALYSIS
Your profile suggests a beautiful canvas. Given Colombo's high tropical humidity, we will focus on anti-frizz alignment and texture preservation to ensure your styled silhouette remains intact.

✦ AURA STYLING ARCHITECTURE
We recommend a customized fluid layered cut, crafted to follow your natural hair growth and facial contouring. This style allows for weight distribution and movement, keeping styling effortless at home.

✦ FORMULA & PIGMENT ARCHITECTURE
We propose our signature "Cinnamon Glaze" or "Ceylon Golden Sand Balayage" using ammonia-free, nourishing mineral pigments. These warm golden undertones will catch the Sri Lankan light gorgeously and naturally brighten your skin tone.

✦ THE COLOMBO CARE REGIMEN
Maintain this structural health by applying lightweight silicone-free shields. We will walk you through customized blow-drying shapes at our Form station during your visit.

(Note: API is offline, activated premium local fallback recommendation!)`;

      setTimeout(() => {
        setConsultationResult(fallbackRec);
        setAiProfile({
          hairType,
          hairConcerns: selectedConcerns,
          desiredStyle,
          aiRecommendation: fallbackRec,
          createdAt: new Date().toISOString(),
        });
      }, 1000); // Simulate API network latency
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConsultationResult(null);
    setAiProfile(null);
    setDesiredStyle("");
    setSelectedConcerns([]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titleEyebrow}>STATION 03 — PORTRAIT OF ARTISTRY</Text>
        <Text style={styles.titleText}>AI Style Consultation</Text>
        <Text style={styles.descText}>
          Receive an elegant hair prescription generated by Google Gemini, designed specifically for your hair structure and the local tropical climate.
        </Text>
      </View>

      {!consultationResult ? (
        <View>
          {/* Guest Name Input */}
          <GlassCard style={styles.inputCard}>
            <Text style={styles.sectionLabel}>GUEST NAME</Text>
            <TextInput
              style={styles.textInput}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Enter your name..."
              placeholderTextColor={COLORS.textMuted}
            />
          </GlassCard>

          {/* Hair Type Selector */}
          <GlassCard>
            <Text style={styles.sectionLabel}>1. SELECT HAIR TEXTURE CATEGORY</Text>
            <View style={styles.gridContainer}>
              {HAIR_TYPES.map((t) => {
                const isSelected = hairType === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setHairType(t)}
                    style={[styles.gridBtn, isSelected && styles.gridBtnActive]}
                  >
                    <Text style={[styles.gridBtnText, isSelected && styles.gridBtnTextActive]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* Hair Concerns */}
          <GlassCard>
            <Text style={styles.sectionLabel}>2. IDENTIFY TROPICAL CONCERNS</Text>
            <View style={styles.gridContainer}>
              {HAIR_CONCERNS_LIST.map((concern) => {
                const isSelected = selectedConcerns.includes(concern);
                return (
                  <TouchableOpacity
                    key={concern}
                    onPress={() => toggleConcern(concern)}
                    style={[styles.gridBtn, isSelected && styles.gridBtnActive]}
                  >
                    <View style={styles.concernCheckRow}>
                      <View style={[styles.miniCheck, isSelected && styles.miniCheckActive]}>
                        {isSelected && <Feather name="check" size={8} color={COLORS.background} />}
                      </View>
                      <Text style={[styles.gridBtnText, isSelected && styles.gridBtnTextActive, { flex: 1 }]}>
                        {concern}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>

          {/* Desired Style Text */}
          <GlassCard>
            <Text style={styles.sectionLabel}>3. DESCRIBE DESIRED SILHOUETTE</Text>
            <TextInput
              style={styles.textArea}
              value={desiredStyle}
              onChangeText={setDesiredStyle}
              placeholder="e.g. A sleek geometric bob parting naturally, or honey highlights capturing the Sri Lankan sunrise..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
            />
          </GlassCard>

          {/* Action Button */}
          <TouchableOpacity style={styles.ctaBtn} onPress={generateProfile} disabled={loading} activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <>
                <Text style={styles.ctaBtnText}>GENERATE LUXURY PRESCRIPTION</Text>
                <Feather name="sparkles" size={14} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <GlassCard style={styles.prescriptionCard}>
            <View style={styles.prescriptionHeader}>
              <Ionicons name="document-text-outline" size={22} color={COLORS.gold} />
              <View>
                <Text style={styles.prescBrand}>AURA ATELIER</Text>
                <Text style={styles.prescTitle}>BESPOKE HAIR BLUEPRINT FOR {clientName.toUpperCase()}</Text>
              </View>
            </View>

            <ScrollView style={styles.prescScroll} nestedScrollEnabled>
              <Text style={styles.prescriptionText}>{consultationResult}</Text>
            </ScrollView>
          </GlassCard>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Feather name="refresh-cw" size={12} color={COLORS.gold} />
              <Text style={styles.resetBtnText}>NEW PRESCRIPTION</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.proceedBtn} onPress={onNext}>
              <Text style={styles.proceedBtnText}>PROCEED TO BOOKING</Text>
              <Feather name="arrow-right" size={12} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    fontWeight: "300",
  },
  sectionLabel: {
    fontSize: 9,
    color: COLORS.gold,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  inputCard: {
    paddingVertical: 14,
  },
  textInput: {
    color: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: "300",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridBtn: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
  },
  gridBtnActive: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(217, 119, 6, 0.08)",
  },
  gridBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "300",
  },
  gridBtnTextActive: {
    color: COLORS.goldLight,
    fontWeight: "500",
  },
  concernCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  miniCheck: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  miniCheckActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold,
  },
  textArea: {
    color: COLORS.white,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    fontSize: 13,
    fontWeight: "300",
    textAlignVertical: "top",
    minHeight: 80,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 15,
    gap: 8,
  },
  ctaBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  prescriptionCard: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(25, 22, 19, 0.95)",
    borderWidth: 1,
  },
  prescriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingBottom: 12,
    marginBottom: 12,
  },
  prescBrand: {
    fontSize: 9,
    color: COLORS.gold,
    fontWeight: "600",
    letterSpacing: 2,
  },
  prescTitle: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "400",
    marginTop: 2,
  },
  prescScroll: {
    maxHeight: 250,
  },
  prescriptionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "300",
  },
  resultContainer: {
    marginTop: 10,
  },
  resultActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
  },
  resetBtnText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  proceedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
    gap: 6,
  },
  proceedBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
