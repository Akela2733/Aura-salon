import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function AiConsultantScreen() {
  const [hairType, setHairType] = useState('');
  const [desiredStyle, setDesiredStyle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleConsult = () => {
    if (!hairType || !desiredStyle) return;
    setLoading(true);
    // Simulate API call to /api/consult
    setTimeout(() => {
      setResult(`✦ THE ANALYSIS\nYour profile suggests a beautiful canvas. Given Colombo's high tropical humidity, we will focus on anti-frizz alignment...\n\n✦ CORRIDOR STYLING ARCHITECTURE\nWe recommend a customized fluid layered cut, crafted to follow your natural hair growth and facial contouring.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>03 — PORTRAIT OF ARTISTRY</Text>
        <Text style={styles.title}>AI Profile</Text>

        {!result ? (
          <View style={styles.form}>
            <TextInput 
              style={styles.input} 
              placeholder="Your Hair Type (e.g. Wavy, Thick)" 
              placeholderTextColor="#666"
              value={hairType}
              onChangeText={setHairType}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Desired Aesthetic (e.g. Sleek Bob)" 
              placeholderTextColor="#666"
              value={desiredStyle}
              onChangeText={setDesiredStyle}
            />
            <TouchableOpacity style={styles.button} onPress={handleConsult}>
              {loading ? <ActivityIndicator color="#0a0a0a" /> : <Text style={styles.buttonText}>Generate Profile</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => setResult('')}>
              <Text style={[styles.buttonText, { color: '#C9A35B' }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { padding: 24 },
  eyebrow: { color: '#C9A35B', fontSize: 12, letterSpacing: 2, marginBottom: 8, fontWeight: '600' },
  title: { color: '#F5F5F0', fontSize: 32, fontWeight: '300', marginBottom: 24 },
  form: { gap: 16 },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    color: '#F5F5F0',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#C9A35B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  resultBox: {
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C9A35B',
  },
  resultText: {
    color: '#F5F5F0',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 24,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#C9A35B',
  }
});
