import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme";
import GlassCard from "../components/GlassCard";
import { SALON_SERVICES, SALON_PRODUCTS } from "../data/salonData";

interface ServicesScreenProps {
  selectedServices: string[];
  setSelectedServices: (services: string[] | ((prev: string[]) => string[])) => void;
  selectedProducts: string[];
  setSelectedProducts: (products: string[] | ((prev: string[]) => string[])) => void;
  onNext: () => void;
}

const CATEGORIES = [
  { id: "hair", name: "HAIR" },
  { id: "makeup", name: "MAKEUP" },
  { id: "nail", name: "NAILS" },
  { id: "skin", name: "SKIN" },
  { id: "spa", name: "SPA" },
  { id: "package", name: "PACKAGES" },
  { id: "products", name: "RETAIL PRODUCTS" },
];

export default function ServicesScreen({
  selectedServices,
  setSelectedServices,
  selectedProducts,
  setSelectedProducts,
  onNext,
}: ServicesScreenProps) {
  const [activeCategory, setActiveCategory] = useState("hair");

  const handleServiceToggle = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleProductToggle = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredServices = SALON_SERVICES.filter((s) => s.category === activeCategory);
  const filteredProducts = SALON_PRODUCTS; // Show products category if activeCategory === "products"

  return (
    <View style={styles.container}>
      {/* Horizontally Scrollable Categories */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[styles.categoryTab, isActive && styles.categoryTabActive]}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Services or Products List */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {activeCategory !== "products" ? (
          filteredServices.map((service) => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <TouchableOpacity
                key={service.id}
                onPress={() => handleServiceToggle(service.id)}
                activeOpacity={0.9}
              >
                <GlassCard style={isSelected ? styles.selectedCard : undefined}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.checkboxContainer}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && <Feather name="check" size={10} color={COLORS.background} />}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={12} color={COLORS.gold} />
                      <Text style={styles.metaText}>{service.duration}</Text>
                    </View>
                    <Text style={styles.servicePrice}>LKR {service.price.toLocaleString()}</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        ) : (
          filteredProducts.map((product) => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => handleProductToggle(product.id)}
                activeOpacity={0.9}
              >
                <GlassCard style={isSelected ? styles.selectedCard : undefined}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.serviceName}>{product.name}</Text>
                    <View style={styles.checkboxContainer}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && <Feather name="check" size={10} color={COLORS.background} />}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.serviceDescription}>{product.description}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.metaItem}>
                      <Feather name="tag" size={12} color={COLORS.gold} />
                      <Text style={styles.metaText}>
                        {product.category.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.servicePrice}>LKR {product.price.toLocaleString()}</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })
        )}

        {/* Selection Summary floating banner if any item is selected */}
        {(selectedServices.length > 0 || selectedProducts.length > 0) && (
          <GlassCard style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryLabel}>SELECTED ITEMS</Text>
                <Text style={styles.summaryValue}>
                  {selectedServices.length} Services • {selectedProducts.length} Products
                </Text>
              </View>
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Text style={styles.nextButtonText}>SELECT ARTISAN</Text>
                <Feather name="arrow-right" size={12} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoryBar: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(13, 11, 9, 0.95)",
  },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  categoryTabActive: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(217, 119, 6, 0.1)",
  },
  categoryText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  categoryTextActive: {
    color: COLORS.gold,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  selectedCard: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(217, 119, 6, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "500",
    flex: 1,
  },
  checkboxContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold,
  },
  serviceDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: "300",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.03)",
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  servicePrice: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: "600",
  },
  summaryCard: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(13, 11, 9, 0.98)",
    borderWidth: 1.5,
    marginTop: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 9,
    color: COLORS.gold,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  summaryValue: {
    fontSize: 13,
    color: COLORS.white,
    marginTop: 2,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
});
