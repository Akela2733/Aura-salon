import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GlassCard({ children, style }: GlassCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 18,
    marginVertical: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3, // Android fallback shadow
  },
});
