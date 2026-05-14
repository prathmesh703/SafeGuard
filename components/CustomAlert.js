import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet
} from 'react-native';

export default function CustomAlert({ visible, title, message, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  box:      { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 280, alignItems: 'center' },
  title:    { fontSize: 17, fontWeight: '700', color: '#1a1a2e', marginBottom: 10 },
  message:  { fontSize: 14, color: '#4a4a6a', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  btn:      { backgroundColor: '#E24B4A', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 40 },
  btnText:  { color: '#fff', fontWeight: '600', fontSize: 14 },
});