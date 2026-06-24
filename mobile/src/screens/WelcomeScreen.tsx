import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import GlassCard from "../components/GlassCard";

const { width } = Dimensions.get("window");

interface WelcomeScreenProps {
  onStartJourney: () => void;
}

export default function WelcomeScreen({ onStartJourney }: WelcomeScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Header Area */}
      <View style={styles.heroSection}>
        <Text style={styles.titleEyebrow}>WELCOME TO THE SANCTUARY</Text>
        <Text style={styles.titleBrand}>A U R A</Text>
        <View style={styles.goldLine} />
        <Text style={styles.subtitle}>Ultra-Luxury Treatment Atelier</Text>
      </View>

      {/* Philosophy Card */}
      <GlassCard>
        <View style={styles.headerRow}>
          <Feather name="shield" size={18} color={COLORS.gold} />
          <Text style={styles.cardLabel}>OUR MISSION</Text>
        </View>
        <Text style={styles.philosophyText}>
          AURA is a sanctuary designed around personalized geometric forms, premium hair wellness, and custom colors curated specifically for the tropical Sri Lankan climate.
        </Text>
        <Text style={styles.philosophyText}>
          Here, gravity-defying architecture meets master artisans to create a portrait of bespoke elegance unique to each guest.
        </Text>
      </GlassCard>

      {/* Details Card */}
      <GlassCard>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={COLORS.gold} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>THE SANCTUARY LOCATION</Text>
            <Text style={styles.infoValue}>14 Horton Place, Colombo 7</Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.borderTop]}>
          <Ionicons name="time-outline" size={20} color={COLORS.gold} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>SANCTUARY HOURS</Text>
            <Text style={styles.infoValue}>Everyday — 9:00 AM to 8:00 PM</Text>
          </View>
        </View>

        <View style={[styles.infoRow, styles.borderTop]}>
          <Ionicons name="call-outline" size={20} color={COLORS.gold} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>BESPOKE DESK</Text>
            <Text style={styles.infoValue}>+94 11 234 5678</Text>
          </View>
        </View>
      </GlassCard>

      {/* CTA Button */}
      <TouchableOpacity style={styles.button} onPress={onStartJourney} activeOpacity={0.8}>
        <LinearGradient
          colors={[COLORS.gold, COLORS.goldDark]}
          style={styles.gradientBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>BEGIN SANCTUARY JOURNEY</Text>
          <Feather name="arrow-right" size={16} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.footerText}>AURA Colombo © 2026. All Rights Reserved.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: 35,
  },
  titleEyebrow: {
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 2.5,
    fontWeight: "600",
    marginBottom: 8,
  },
  titleBrand: {
    fontSize: 48,
    color: COLORS.white,
    fontWeight: "200",
    letterSpacing: 8,
    textAlign: "center",
  },
  goldLine: {
    width: 60,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    letterSpacing: 1.5,
    fontWeight: "300",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  cardLabel: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  philosophyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginVertical: 4,
    fontWeight: "300",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "400",
  },
  button: {
    marginTop: 20,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  footerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 35,
    letterSpacing: 1,
  },
});
