import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log("hello");
    if (!phone || !password) {
      alert('Please fill all fields.'); return;
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', phone));
      if (!userDoc.exists()) {
        alert('No account found with this number.'); return;
      }
      const userData = userDoc.data();
      if (userData.password === password) {
        navigation.replace('Dashboard');
      } else {
        alert('Incorrect password.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to keep yourself safe</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>MOBILE NUMBER</Text>
        <View style={styles.phoneRow}>
          <Text style={styles.code}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="98765 43210"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.inputFull}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Continue →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#fff' },
  hero:      { backgroundColor: '#1a1a2e', padding: 32, paddingTop: 60 },
  brand:     { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  heading:   { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  sub:       { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  form:      { padding: 24 },
  label:     { fontSize: 11, fontWeight: '600', color: '#888', letterSpacing: 0.8, marginBottom: 6, marginTop: 16 },
  phoneRow:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e0da', borderRadius: 10, paddingHorizontal: 12 },
  code:      { fontSize: 14, color: '#1a1a2e', marginRight: 8 },
  input:     { flex: 1, paddingVertical: 12, fontSize: 14 },
  inputFull: { borderWidth: 1, borderColor: '#e2e0da', borderRadius: 10, padding: 12, fontSize: 14 },
  btn:       { backgroundColor: '#E24B4A', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24 },
  btnText:   { color: '#fff', fontWeight: '600', fontSize: 15 },
  linkText:  { textAlign: 'center', marginTop: 18, color: '#E24B4A', fontSize: 13 },
});