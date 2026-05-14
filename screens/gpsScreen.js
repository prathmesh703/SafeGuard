import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert';

export default function GPSScreen({ navigation }) {
  const [location, setLocation]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [history, setHistory]     = useState([]);
  const [alertData, setAlertData] = useState({ visible: false, title: '', message: '' });

  const showAlert = (title, message) => setAlertData({ visible: true, title, message });

  const fetchLocation = async () => {
    setLoading(true);
    try {
      // Ask permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required to use GPS tracking.');
        setLoading(false);
        return;
      }

      // Get current position
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const timestamp = new Date();
      const locationData = {
        latitude:    pos.coords.latitude,
        longitude:   pos.coords.longitude,
        accuracy:    Math.round(pos.coords.accuracy),
        timestamp:   timestamp.toISOString(),
        displayTime: timestamp.toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }),
      };

      setLocation(locationData);

      // Save to Firestore
      await addDoc(collection(db, 'gps_logs'), locationData);

      // Add to history
      setHistory(prev => [locationData, ...prev].slice(0, 5));

    } catch (error) {
      showAlert('Error', 'Could not fetch location: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>GPS Tracking</Text>
        <Text style={styles.sub}>Fetch and log your current location</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>

        {/* Fetch Button */}
        <TouchableOpacity
          style={[styles.fetchBtn, loading && styles.fetchBtnDisabled]}
          onPress={fetchLocation}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.fetchBtnText}>📍 Get My Location</Text>
          }
        </TouchableOpacity>

        {/* Location Card */}
        {location && (
          <View style={styles.locationCard}>
            <Text style={styles.cardTitle}>📍 Current Location</Text>

            <View style={styles.row}>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>LATITUDE</Text>
                <Text style={styles.coordValue}>{location.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.coordBox}>
                <Text style={styles.coordLabel}>LONGITUDE</Text>
                <Text style={styles.coordValue}>{location.longitude.toFixed(6)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🎯 Accuracy</Text>
              <Text style={styles.infoValue}>±{location.accuracy} meters</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🕐 Captured at</Text>
              <Text style={styles.infoValue}>{location.displayTime}</Text>
            </View>

            {/* Google Maps Link */}
            <TouchableOpacity
              style={styles.mapsBtn}
              onPress={() => {
                const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                window.open(url, '_blank');
              }}
            >
              <Text style={styles.mapsBtnText}>🗺 Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History */}
        {history.length > 0 && (
          <View style={styles.historyBox}>
            <Text style={styles.historyTitle}>🕐 Location History</Text>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyCoords}>
                  {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </Text>
                <Text style={styles.historyTime}>{item.displayTime}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Home</Text>
        </TouchableOpacity>

      </ScrollView>

      <CustomAlert
        visible={alertData.visible}
        title={alertData.title}
        message={alertData.message}
        onClose={() => setAlertData({ visible: false, title: '', message: '' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#fff' },
  header:        { backgroundColor: '#1a1a2e', padding: 32, paddingTop: 60 },
  brand:         { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  heading:       { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  sub:           { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  body:          { padding: 24, alignItems: 'center' },

  fetchBtn:         { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 24 },
  fetchBtnDisabled: { backgroundColor: '#aaa' },
  fetchBtnText:     { color: '#fff', fontSize: 15, fontWeight: '600' },

  locationCard:  { width: '100%', backgroundColor: '#f7f6f3', borderRadius: 14, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: '#e2e0da' },
  cardTitle:     { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 14 },

  row:           { flexDirection: 'row', gap: 12, marginBottom: 14 },
  coordBox:      { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e2e0da', alignItems: 'center' },
  coordLabel:    { fontSize: 10, fontWeight: '600', color: '#888', letterSpacing: 0.8, marginBottom: 4 },
  coordValue:    { fontSize: 15, fontWeight: '700', color: '#E24B4A' },

  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#e2e0da' },
  infoLabel:     { fontSize: 13, color: '#888' },
  infoValue:     { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },

  mapsBtn:       { backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#e2e0da' },
  mapsBtnText:   { fontSize: 13, color: '#1a1a2e', fontWeight: '600' },

  historyBox:    { width: '100%', backgroundColor: '#f7f6f3', borderRadius: 14, padding: 16, marginBottom: 20 },
  historyTitle:  { fontSize: 13, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },
  historyItem:   { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2e0da' },
  historyCoords: { fontSize: 13, fontWeight: '600', color: '#E24B4A' },
  historyTime:   { fontSize: 11, color: '#888', marginTop: 2 },

  backBtn:       { marginTop: 8, paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10, borderWidth: 1, borderColor: '#e2e0da' },
  backBtnText:   { fontSize: 13, color: '#4a4a6a', fontWeight: '500' },
});