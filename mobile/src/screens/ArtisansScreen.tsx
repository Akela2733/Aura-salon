import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import GlassCard from "../components/GlassCard";

interface ArtisansScreenProps {
  selectedStylist: string | null;
  setSelectedStylist: (stylist: string | null) => void;
  onNext: () => void;
}

const ARTISANS = [
  {
    id: "Anura Senanayake",
    role: "Master Hair Sculptor & Geometric Lead",
    bio: "Over 12 years of experience mapping haircut outlines to natural head structures and anatomical gravity.",
    specialties: ["Dry sculpture cuts", "Geometric bobs", "Structural texture styling"],
    avatarCode: "scissors",
  },
  {
    id: "Menaka Fernando",
    role: "Senior Colorist & Balayage Specialist",
    bio: "Trained in London, focusing on ammonia-free custom pigments and light-catching gradients suited to the tropical sun.",
    specialties: ["Colombo Sunset Balayage", "Rich copper tones", "Ceylon organic oil glosses"],
    avatarCode: "feather",
  },
  {
    id: "Dilki Alwis",
    role: "Nail Art Director & Handcare Specialist",
    bio: "Passionate about minimalist botanical designs and strict organic hand therapy down to the millimeter.",
    specialties: ["24k Gold leaf detailing", "Non-toxic gel extensions", "Natural mineral hand wraps"],
    avatarCode: "sparkles",
  },
  {
    id: "Yolanda Koch",
    role: "Holistic Skin therapist & Spa Artisan",
    bio: "Specializes in Ayurvedic scalp therapy, warm oil pressure point alignment, and clean plant-based skincare prep.",
    specialties: ["Ayurvedic Head Spa", "Gold peptide facial lifts", "Aromatherapy riverscapes"],
    avatarCode: "heart",
  },
];

export default function ArtisansScreen({
  selectedStylist,
  setSelectedStylist,
  onNext,
}: ArtisansScreenProps) {
  const handleSelectStylist = (name: string) => {
    if (selectedStylist === name) {
      setSelectedStylist(null); // Deselect
    } else {
      setSelectedStylist(name);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titleEyebrow}>STATION 02 — THE ARTISANS</Text>
        <Text style={styles.titleText}>Master Artisans</Text>
        <Text style={styles.descText}>
          Select a dedicated specialist to lead your personalized design session. You may also proceed without pre-selecting.
        </Text>
      </View>

      {ARTISANS.map((artisan) => {
        const isSelected = selectedStylist === artisan.id;
        return (
          <TouchableOpacity
            key={artisan.id}
            onPress={() => handleSelectStylist(artisan.id)}
            activeOpacity={0.9}
          >
            <GlassCard style={isSelected ? styles.selectedCard : undefined}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarCircle}>
                  {artisan.avatarCode === "scissors" && <Feather name="scissors" size={18} color={COLORS.gold} />}
                  {artisan.avatarCode === "feather" && <Feather name="feather" size={18} color={COLORS.gold} />}
                  {artisan.avatarCode === "sparkles" && <Feather name="sparkles" size={18} color={COLORS.gold} />}
                  {artisan.avatarCode === "heart" && <Ionicons name="heart-outline" size={18} color={COLORS.gold} />}
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.artisanName}>{artisan.id}</Text>
                  <Text style={styles.artisanRole}>{artisan.role}</Text>
                </View>
                <View style={styles.checkCircleContainer}>
                  <View style={[styles.checkCircle, isSelected && styles.checkCircleChecked]}>
                    {isSelected && <Feather name="check" size={10} color={COLORS.background} />}
                  </View>
                </View>
              </View>

              <Text style={styles.artisanBio}>{artisan.bio}</Text>

              <View style={styles.specialtiesLabelRow}>
                <Text style={styles.specialtiesLabel}>SPECIALTIES</Text>
              </View>
              <View style={styles.tagsContainer}>
                {artisan.specialties.map((spec, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{spec}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.ctaButton} onPress={onNext} activeOpacity={0.8}>
        <Text style={styles.ctaButtonText}>
          {selectedStylist ? `PROCEED WITH ${selectedStylist.toUpperCase()}` : "PROCEED TO AI COUTURE"}
        </Text>
        <Feather name="arrow-right" size={14} color={COLORS.white} />
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
  selectedCard: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(217, 119, 6, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  artisanName: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },
  artisanRole: {
    fontSize: 11,
    color: COLORS.gold,
    marginTop: 2,
    fontWeight: "400",
    letterSpacing: 0.5,
  },
  checkCircleContainer: {
    marginLeft: 8,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleChecked: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold,
  },
  artisanBio: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
    fontWeight: "300",
  },
  specialtiesLabelRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 10,
    marginBottom: 8,
  },
  specialtiesLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: "300",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 20,
    gap: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
});
