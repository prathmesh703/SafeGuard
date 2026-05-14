import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>Dashboard</Text>
        <Text style={styles.sub}>You are protected</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SOS')}>
          <Text style={styles.cardIcon}>🆘</Text>
          <Text style={styles.cardTitle}>SOS Emergency</Text>
          <Text style={styles.cardSub}>Tap to send emergency alert</Text>
        </TouchableOpacity>

        {/* Placeholder cards for next modules */}
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('GPS')}>
        <Text style={styles.cardIcon}>📍</Text>
        <Text style={styles.cardTitle}>GPS Tracking</Text>
        <Text style={styles.cardSub}>Fetch your current location</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Incident')}>
          <Text style={styles.cardIcon}>📋</Text>
          <Text style={styles.cardTitle}>Incident Report</Text>
          <Text style={styles.cardSub}>Report an emergency</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#fff' },
  header:       { backgroundColor: '#1a1a2e', padding: 32, paddingTop: 60 },
  brand:        { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  heading:      { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  sub:          { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  body:         { padding: 24, gap: 14 },
  card: {
    backgroundColor: '#f7f6f3', borderRadius: 14,
    padding: 20, flexDirection: 'row',
    alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: '#e2e0da'
  },
  cardDisabled: { opacity: 0.4 },
  cardIcon:     { fontSize: 28 },
  cardTitle:    { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  cardSub:      { fontSize: 12, color: '#888', marginTop: 2 },
});