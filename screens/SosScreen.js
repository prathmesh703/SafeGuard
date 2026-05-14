import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert';

export default function SOSScreen({ navigation }) {
  const [alertData, setAlertData] = useState({ visible: false, title: '', message: '' });
  const [sosList, setSosList]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);

  const showAlert = (title, message, onClose) => {
    setAlertData({ visible: true, title, message, onClose });
  };

  // ✅ Fetch SOS history from Firestore on screen load
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setFetching(true);
    try {
      const q = query(
        collection(db, 'sos_events'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSosList(events);
    } catch (error) {
      showAlert('Error', 'Could not load history: ' + error.message);
    }
    setFetching(false);
  };

  const handleSOS = async () => {
    setLoading(true);
    const timestamp = new Date();

    const event = {
      type: 'SOS',
      timestamp: timestamp.toISOString(),
      displayTime: timestamp.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
    };

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'sos_events'), event);

      // Add to top of local list instantly
      setSosList(prev => [{ id: docRef.id, ...event }, ...prev]);

      showAlert(
        '🆘 SOS Triggered!',
        `Emergency alert sent!\n\n🕐 ${event.displayTime}\n\nHelp is on the way. Stay calm.`
      );

    } catch (error) {
      showAlert('Error', 'Failed to send SOS: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>SOS Emergency</Text>
        <Text style={styles.sub}>Press the button if you are in danger</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>

        {/* SOS Button */}
        <TouchableOpacity
          style={[styles.sosBtn, loading && styles.sosBtnDisabled]}
          onPress={handleSOS}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="large" />
            : <>
                <Text style={styles.sosBtnText}>SOS</Text>
                <Text style={styles.sosBtnSub}>Press for emergency</Text>
              </>
          }
        </TouchableOpacity>

        <Text style={styles.warningText}>
          ⚠️ Only press in a real emergency situation
        </Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Home</Text>
        </TouchableOpacity>

        {/* SOS History */}
        <View style={styles.historyBox}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>📋 SOS History</Text>
            <TouchableOpacity onPress={fetchHistory}>
              <Text style={styles.refreshText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>

          {/* Loading state */}
          {fetching && (
            <ActivityIndicator color="#E24B4A" style={{ marginVertical: 20 }} />
          )}

          {/* Empty state */}
          {!fetching && sosList.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No SOS events yet</Text>
              <Text style={styles.emptySubText}>Your emergency history will appear here</Text>
            </View>
          )}

          {/* History list */}
          {!fetching && sosList.map((item, index) => (
            <View key={item.id || index} style={styles.historyItem}>
              <View style={styles.historyDot} />
              <View>
                <Text style={styles.historyType}>🆘 {item.type} Alert Sent</Text>
                <Text style={styles.historyTime}>🕐 {item.displayTime}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      <CustomAlert
        visible={alertData.visible}
        title={alertData.title}
        message={alertData.message}
        onClose={alertData.onClose || (() => setAlertData({ visible: false, title: '', message: '' }))}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff', maxHeight: '100vh' },
  header:          { backgroundColor: '#1a1a2e', padding: 32, paddingTop: 60 },
  brand:           { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  heading:         { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  sub:             { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  body:            { alignItems: 'center', padding: 24 },

  sosBtn: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#E24B4A',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 40, marginBottom: 20,
    shadowColor: '#E24B4A', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 30,
    elevation: 20,
    borderWidth: 6, borderColor: '#ff8080',
  },
  sosBtnDisabled:  { backgroundColor: '#aaa', borderColor: '#ccc', shadowOpacity: 0 },
  sosBtnText:      { color: '#fff', fontSize: 42, fontWeight: '900', letterSpacing: 4 },
  sosBtnSub:       { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  warningText:     { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 16 },

  backBtn:         { marginBottom: 24, paddingVertical: 10, paddingHorizontal: 28, borderRadius: 10, borderWidth: 1, borderColor: '#e2e0da' },
  backBtnText:     { fontSize: 13, color: '#4a4a6a', fontWeight: '500' },

  historyBox:      { width: '100%', backgroundColor: '#f7f6f3', borderRadius: 14, padding: 16 },
  historyHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  historyTitle:    { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  refreshText:     { fontSize: 12, color: '#E24B4A', fontWeight: '600' },

  historyItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 12, marginBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#e2e0da', paddingBottom: 12
  },
  historyDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E24B4A', marginTop: 4 },
  historyType:     { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  historyTime:     { fontSize: 12, color: '#888', marginTop: 2 },

  emptyBox:        { alignItems: 'center', paddingVertical: 20 },
  emptyText:       { fontSize: 15, color: '#aaa', fontWeight: '600' },
  emptySubText:    { fontSize: 12, color: '#ccc', marginTop: 4 },
});