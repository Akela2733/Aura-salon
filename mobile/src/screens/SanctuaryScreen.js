import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SanctuaryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.image}
          />
          <LinearGradient
            colors={['transparent', '#0a0a0a']}
            style={styles.gradient}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>00 — AURA & HERITAGE</Text>
          <Text style={styles.title}>CORRIDOR</Text>
          <Text style={styles.subtitle}>An ultra-luxury, high-end design salon.</Text>
          <Text style={styles.body}>
            Where pristine hair health meets architectural precision. Experience customized geometric forms and bespoke color architecture in the heart of Colombo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scroll: {
    flexGrow: 1,
  },
  imageContainer: {
    height: 500,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
  },
  content: {
    padding: 24,
    marginTop: -40,
  },
  eyebrow: {
    color: '#C9A35B',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '600',
  },
  title: {
    color: '#F5F5F0',
    fontSize: 42,
    fontWeight: '300',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    color: '#C9A35B',
    fontSize: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  body: {
    color: '#999',
    fontSize: 15,
    lineHeight: 24,
  }
});
