import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

export default function BookingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>04 — BESPOKE CHAIR BOOKING</Text>
        <Text style={styles.title}>Reservations</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Appointment</Text>
          <Text style={styles.cardText}>Select a service and time to reserve your chair at CORRIDOR.</Text>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: 24 },
  eyebrow: { color: '#C9A35B', fontSize: 12, letterSpacing: 2, marginBottom: 8, fontWeight: '600' },
  title: { color: '#F5F5F0', fontSize: 32, fontWeight: '300', marginBottom: 24 },
  card: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 24,
    borderRadius: 8,
  },
  cardTitle: { color: '#F5F5F0', fontSize: 20, marginBottom: 12 },
  cardText: { color: '#999', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  button: {
    backgroundColor: '#C9A35B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
