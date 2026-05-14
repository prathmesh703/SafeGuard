import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView
} from 'react-native';

const STATIC_OTP = '123456';

export default function OTPScreen({ navigation, route }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = Array(6).fill(null).map(() => useRef(null));

  const handleChange = (val, idx) => {
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 5) refs[idx + 1].current.focus();
  };

  const handleVerify = () => {
    if (otp.join('') === STATIC_OTP) {
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Invalid OTP', 'Use 123456 for this demo.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>Verify OTP</Text>
        <Text style={styles.sub}>Sent to +91 {phone}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.hint}>Demo OTP: 1 2 3 4 5 6</Text>
        <View style={styles.otpRow}>
          {otp.map((val, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              style={styles.otpBox}
              maxLength={1}
              keyboardType="number-pad"
              value={val}
              onChangeText={v => handleChange(v, i)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleVerify}>
          <Text style={styles.btnText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>← Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#fff' },
  hero:    { backgroundColor: '#1a1a2e', padding: 32, paddingTop: 60 },
  brand:   { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  heading: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  sub:     { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  form:    { padding: 24 },
  hint:    { backgroundColor: '#FCEBEB', color: '#A32D2D', borderRadius: 8, padding: 12, fontSize: 13, marginBottom: 24 },
  otpRow:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  otpBox:  { width: 46, height: 54, borderWidth: 1, borderColor: '#e2e0da', borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: '600' },
  btn:     { backgroundColor: '#E24B4A', borderRadius: 10, padding: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  linkText:{ textAlign: 'center', marginTop: 18, color: '#888', fontSize: 13 },
});