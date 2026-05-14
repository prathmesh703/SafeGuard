import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  Image, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import CustomAlert from '../components/CustomAlert';

const INCIDENT_TYPES = [
  'Theft', 'Assault', 'Accident', 'Fire', 'Medical Emergency', 'Other'
];

export default function IncidentScreen({ navigation }) {
  const [type, setType]           = useState('');
  const [description, setDesc]    = useState('');
  const [image, setImage]         = useState(null);
  const [location, setLocation]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [locLoading, setLocLoad]  = useState(false);
  const [alertData, setAlertData] = useState({ visible: false, title: '', message: '' });

  const showAlert = (title, message, onClose) =>
    setAlertData({ visible: true, title, message, onClose });

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission Denied', 'Gallery access is required to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  // Auto capture location
  const captureLocation = async () => {
    setLocLoad(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required.');
        setLocLoad(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation({
        latitude:  pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    } catch (e) {
      showAlert('Error', 'Could not fetch location.');
    }
    setLocLoad(false);
  };

  // Submit incident
  const handleSubmit = async () => {
    if (!type) {
      showAlert('Error', 'Please select an incident type.'); return;
    }
    if (!description.trim()) {
      showAlert('Error', 'Please enter a description.'); return;
    }

    setLoading(true);
    try {
      const timestamp = new Date();
      await addDoc(collection(db, 'incidents'), {
        type:        type,
        description: description,
        image:       image || null,
        location:    location || null,
        timestamp:   timestamp.toISOString(),
        displayTime: timestamp.toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }),
      });

      showAlert(
        '✅ Report Submitted',
        'Your incident has been reported successfully.',
        () => {
          setAlertData({ visible: false, title: '', message: '' });
          setType(''); setDesc(''); setImage(null); setLocation(null);
          navigation.goBack();
        }
      );
    } catch (error) {
      showAlert('Error', 'Failed to submit: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>🛡 SafeGuard</Text>
        <Text style={styles.heading}>Incident Report</Text>
        <Text style={styles.sub}>Report an emergency or incident</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>

        {/* Incident Type */}
        <Text style={styles.label}>INCIDENT TYPE *</Text>
        <View style={styles.typeGrid}>
          {INCIDENT_TYPES.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, type === t && styles.typeChipActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeChipText, type === t && styles.typeChipTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>DESCRIPTION *</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Describe what happened..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDesc}
          textAlignVertical="top"
        />

        {/* Image Upload */}
        <Text style={styles.label}>UPLOAD IMAGE (optional)</Text>
        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image
            ? <Image source={{ uri: image }} style={styles.previewImage} />
            : <>
                <Text style={styles.imageIcon}>📷</Text>
                <Text style={styles.imageText}>Tap to upload image</Text>
              </>
          }
        </TouchableOpacity>
        {image && (
          <TouchableOpacity onPress={() => setImage(null)}>
            <Text style={styles.removeText}>✕ Remove image</Text>
          </TouchableOpacity>
        )}

        {/* Auto Location */}
        <Text style={styles.label}>LOCATION</Text>
        <TouchableOpacity
          style={styles.locationBtn}
          onPress={captureLocation}
          disabled={locLoading}
        >
          {locLoading
            ? <ActivityIndicator color="#1a1a2e" />
            : <Text style={styles.locationBtnText}>
                {location
                  ? `📍 ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                  : '📍 Capture Current Location'
                }
              </Text>
          }
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>Submit Report →</Text>
          }
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Home</Text>
        </TouchableOpacity>

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
  safe:                 { flex: 1, backgroundColor: '#fff' },
  header:               { backgroundColor: '#1a1a2e', padding: 32, paddingTop: 60 },
  brand:                { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },
  heading:              { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  sub:                  { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  body:                 { padding: 24 },
  label:                { fontSize: 11, fontWeight: '600', color: '#888', letterSpacing: 0.8, marginBottom: 8, marginTop: 18 },

  // Type chips
  typeGrid:             { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip:             { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#e2e0da', backgroundColor: '#f7f6f3' },
  typeChipActive:       { backgroundColor: '#E24B4A', borderColor: '#E24B4A' },
  typeChipText:         { fontSize: 13, color: '#4a4a6a', fontWeight: '500' },
  typeChipTextActive:   { color: '#fff' },

  // Description
  textarea:             { borderWidth: 1, borderColor: '#e2e0da', borderRadius: 10, padding: 12, fontSize: 14, minHeight: 100 },

  // Image
  imageBox:             { borderWidth: 1, borderColor: '#e2e0da', borderRadius: 10, borderStyle: 'dashed', height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f6f3' },
  imageIcon:            { fontSize: 28, marginBottom: 6 },
  imageText:            { fontSize: 13, color: '#aaa' },
  previewImage:         { width: '100%', height: '100%', borderRadius: 10 },
  removeText:           { fontSize: 12, color: '#E24B4A', textAlign: 'right', marginTop: 6 },

  // Location
  locationBtn:          { borderWidth: 1, borderColor: '#e2e0da', borderRadius: 10, padding: 13, alignItems: 'center', backgroundColor: '#f7f6f3' },
  locationBtnText:      { fontSize: 13, color: '#1a1a2e', fontWeight: '500' },

  // Submit
  submitBtn:            { backgroundColor: '#E24B4A', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24 },
  submitBtnDisabled:    { backgroundColor: '#aaa' },
  submitBtnText:        { color: '#fff', fontWeight: '600', fontSize: 15 },

  // Back
  backBtn:              { marginTop: 14, paddingVertical: 10, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#e2e0da' },
  backBtnText:          { fontSize: 13, color: '#4a4a6a', fontWeight: '500' },
});