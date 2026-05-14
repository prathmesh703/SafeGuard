import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView
} from 'react-native';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
// import CustomAlert from '../components/CustomAlert.js';


export default function RegisterScreen({ navigation }) {
  const [phone, setPhone]     = useState('');
  const [pass, setPass]       = useState('');
  const [confirm, setConfirm] = useState('');
  // const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

//   // const showAlert = (title, message) => {
//   // setAlert({ visible: true, title, message });
// };

 const handleRegister = async () => {
  if (!phone || phone.length < 10) {
    alert('Enter a valid 10-digit number.');
    return;
  }

  if (pass.length < 6) {
    alert('Password must be 6+ characters.');
    return;
  }

  if (pass !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  try {
    await setDoc(doc(db, 'users', phone), {
      phone: phone,
      password: pass,
      createdAt: new Date().toISOString()
    });

    alert('Account created!');

    navigation.navigate('OTP', { phone });

  } catch (error) {
    alert(error.message);
  }
};
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.sub}>Join SafeGuard — your personal safety companion</Text>
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

        <Text style={styles.label}>CREATE PASSWORD</Text>
        <TextInput
          style={styles.inputFull}
          placeholder="Min 6 characters"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <Text style={styles.label}>CONFIRM PASSWORD</Text>
        <TextInput
          style={styles.inputFull}
          placeholder="Repeat password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <TouchableOpacity style={styles.btn} onPress={handleRegister}>
          <Text style={styles.btnText}>Send OTP →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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