# 🛡 SafeGuard — Safety MVP App

A React Native mobile application built with Expo and Firebase for personal safety management.

---

## Features

- **User Registration** — Mobile number + password signup
- **OTP Verification** — Static OTP (123456) for demo
- **User Login** — Authenticated via Firebase Firestore
- **SOS Emergency** — One-tap SOS alert with timestamp saved to Firebase
- **GPS Tracking** — Fetch and log current latitude/longitude
- **Incident Reporting** — Report incidents with type, description, image, and auto location

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React Native + Expo     |
| Navigation | React Navigation v6     |
| Database   | Firebase Firestore      |
| Location   | expo-location           |
| Images     | expo-image-picker       |

---

## Project Structure
---
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

## Setup Instructions

### Prerequisites
- Node.js v20.19.4 or higher
- Expo CLI
- Firebase account

### Installation

1. Clone the repository
```bash
   git clone https://github.com/YOURUSERNAME/SafeGuard.git
   cd SafeGuard
```

2. Install dependencies
```bash
   npm install --legacy-peer-deps
```

3. Configure Firebase
   - Go to https://console.firebase.google.com
   - Create a new project
   - Add a Web app and copy the config
   - Paste config into `firebase.js`
   - Enable Firestore Database in test mode

4. Start the app
```bash
   npx expo start
```

5. Scan QR code with **Expo Go** app on your phone

---

## Demo Credentials

| Field    | Value        |
|----------|--------------|
| Phone    | 9876543210   |
| Password | demo123      |
| OTP      | 123456       |

---

## Firebase Collections

| Collection   | Data Stored                          |
|--------------|--------------------------------------|
| users        | phone, password, createdAt           |
| sos_events   | type, timestamp, displayTime         |
| gps_logs     | latitude, longitude, accuracy, time  |
| incidents    | type, description, image, location   |

---

## APK Download

[Download APK](YOUR_EAS_BUILD_LINK_HERE)

---

## Notes

- Passwords stored as plain text for demo purposes only
- In production, use Firebase Authentication with hashed passwords
- OTP is static (123456) — production should use Firebase Phone Auth
- Firestore rules set to open for development only

---

## Developer

**Prathmes Kolpe**  
Assignment submission — Safety MVP Module
