# 🛡 SafeGuard
### Personal Safety MVP App using React Native, Expo & Firebase

SafeGuard is a mobile safety application built using React Native and Expo.  
The app provides emergency SOS alerts, GPS location tracking, OTP-based login flow, and incident reporting features integrated with Firebase Firestore.

---

## ✨ Features

- **User Registration** — Mobile number + password signup
- **OTP Verification** — Static OTP (`123456`) for demo purposes
- **User Login** — Authentication using Firebase Firestore
- **SOS Emergency Alert** — One-tap emergency SOS trigger with timestamp logging
- **GPS Tracking** — Fetch and store live latitude & longitude
- **Incident Reporting** — Report incidents with:
  - Incident type
  - Description
  - Image upload
  - Auto-detected location

---

## 🛠 Tech Stack

| Layer        | Technology                |
|---------------|---------------------------|
| Frontend      | React Native + Expo       |
| Navigation    | React Navigation v6       |
| Backend       | Firebase Firestore        |
| Location API  | expo-location             |
| Image Picker  | expo-image-picker         |

---

## 📁 Project Structure

```bash
SafeGuard/
├── App.js
├── firebase.js
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── OTPScreen.js
│   ├── DashboardScreen.js
│   ├── SOSScreen.js
│   ├── GPSScreen.js
│   └── IncidentScreen.js
└── components/
    └── CustomAlert.js
```

---

## ⚙️ Setup Instructions

### Prerequisites

Make sure you have installed:

- Node.js v20.19.4 or higher
- Expo CLI
- Firebase account
- Expo Go app (Android/iOS)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/prathmesh703/SafeGuard.git
cd SafeGuard
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Firebase

1. Go to: https://console.firebase.google.com
2. Create a new Firebase project
3. Add a **Web App**
4. Copy Firebase configuration
5. Paste config into `firebase.js`
6. Enable **Firestore Database**
7. Start Firestore in **test mode**

Example:

```javascript
// firebase.js

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export default app;
```

---

## ▶️ Run the App

Start Expo development server:

```bash
npx expo start
```

Then:

- Open **Expo Go** app on your mobile
- Scan the QR code
- App will launch on your device

---

## 🔐 Demo Credentials

| Field      | Value      |
|------------|------------|
| Phone      | 9876543210 |
| Password   | demo123    |
| OTP        | 123456     |

---

## ☁️ Firebase Collections

| Collection   | Stored Data                          |
|--------------|--------------------------------------|
| users        | phone, password, createdAt           |
| sos_events   | type, timestamp, displayTime         |
| gps_logs     | latitude, longitude, accuracy, time  |
| incidents    | type, description, image, location   |

---

## 📸 Screenshots

_Add screenshots here after uploading images to your repository._

Example:

```markdown
![Login Screen](screenshots/login.png)
![Dashboard Screen](screenshots/dashboard.png)
```

---

## 📦 APK Download

Add your Expo EAS APK link here after build generation.

```markdown
[Download APK](YOUR_APK_LINK_HERE)
```

---

## ⚠️ Important Notes

- Passwords are stored as plain text for demo purposes only
- OTP is static (`123456`) for testing/demo
- Firestore rules are currently open for development
- For production:
  - Use Firebase Authentication
  - Use encrypted/hashed passwords
  - Use Firebase Phone Authentication
  - Secure Firestore rules properly

---

## 👨‍💻 Developer

**Prathmes Kolpe**  
Safety MVP Assignment Submission

GitHub:  
https://github.com/prathmesh703

---
