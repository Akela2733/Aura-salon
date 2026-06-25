import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

const SERVICES = [
  { id: '1', title: 'Geometric Bob Custom Cut', price: 'LKR 8,000' },
  { id: '2', title: 'Ceylon Golden Sand Balayage', price: 'LKR 25,000' },
  { id: '3', title: 'Ayurvedic Scalp Sanctuary', price: 'LKR 12,000' },
  { id: '4', title: 'Royal Kandyan Bridal Aura', price: 'LKR 65,000' },
];

export default function ServicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>01 — THE TREATMENT ATELIER</Text>
        <Text style={styles.title}>Expert Services</Text>
        
        <View style={styles.list}>
          {SERVICES.map(service => (
            <TouchableOpacity key={service.id} style={styles.card}>
              <Text style={styles.cardTitle}>{service.title}</Text>
              <Text style={styles.cardPrice}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: 24, paddingBottom: 60 },
  eyebrow: { color: '#C9A35B', fontSize: 12, letterSpacing: 2, marginBottom: 8, fontWeight: '600' },
  title: { color: '#F5F5F0', fontSize: 32, fontWeight: '300', marginBottom: 24 },
  list: { gap: 16 },
  card: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 20,
    borderRadius: 8,
  },
  cardTitle: { color: '#F5F5F0', fontSize: 18, marginBottom: 8 },
  cardPrice: { color: '#C9A35B', fontSize: 14, fontWeight: '600' },
});
