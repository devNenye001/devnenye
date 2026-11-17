# ⚡ VoltPass - AIoT Smart Socket (React Native)

> **An Intelligent Power-Aware Electrical Socket Using AI and IoT**  
> *Pure React Native mobile application converted from Figma UI screenshots (`iPhone 16 - 1` through `iPhone 16 - 21` and `Frame 65`), incorporating ESP32 + PZEM-004T continuous energy telemetry and TinyML anomaly detection.*

---

## 📱 Mobile Screens Architecture

This is a **pure React Native** codebase (with zero web wrappers or mock frames):

- **Splash Screen** ([`SplashScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/SplashScreen.tsx)) — *`iPhone 16 - 1`*  
  VoltPass brand mark with orange lightning bolt.
- **Onboarding Screen** ([`OnboardingScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/OnboardingScreen.tsx)) — *`iPhone 16 - 2`*  
  Architecture interior background, *"Experience the Future of smart living."*, and interactive *"Slide to get started"* thumb slider.
- **Login Screen** ([`LoginScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/LoginScreen.tsx)) — *`iPhone 16 - 4`*  
  Email/password inputs, solid blue Login, Sign Up outline, and Google & Apple sign-in.
- **Dashboard Screen** ([`HomeScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/HomeScreen.tsx)) — *`iPhone 16 - 8`*  
  Blue header *"Hello, Emma"*, Energy Usage card (17 active sockets / 76,2Kw today), room filter pills (*Bedroom*, *Living Room*, *Kitchen*), 2x2 socket grid with toggle switches, and the floating bottom navigation bar.
- **Rooms Screen** ([`RoomsScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/RoomsScreen.tsx)) — *`iPhone 16 - 20`*  
  Rooms header with room cards (*Bedroom*, *Kitchen*, *Sitting Room*) showing active sockets and power metrics.
- **Room Detail Screen** ([`RoomDetailScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/RoomDetailScreen.tsx)) — *`iPhone 16 - 15`*  
  Bedroom banner, floating energy card (4 active sockets / 48,2Kw), and swipeable socket cards revealing orange **Edit** and red **Delete** actions.
- **Add Socket Wizard** ([`AddSocketScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/AddSocketScreen.tsx)) — *`iPhone 16 - 10, 11, 12, 13, 21`*  
  Radar scanning -> Device discovery (*Socket MXH-76809* checkmark) -> Room & photo configuration -> Big green pulse badge confirmation (*"Congratulations!! you have successfully added a new socket."* + *Proceed*).
- **Add Room Screen** ([`AddRoomScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/AddRoomScreen.tsx)) — *`iPhone 16 - 9`*  
  Picture picker placeholder and room name field.
- **Edit Socket Screen** ([`EditSocketScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/EditSocketScreen.tsx)) — *`iPhone 16 - 18, 19`*  
  Name, room selector, and **Schedule Card** (Year/Month/Day selectors `2025 Sept 7` and On/Off times `08:00 AM - 13:00 PM`).
- **Add New Modal** ([`AddNewModal.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/components/AddNewModal.tsx)) — *`Frame 65`*  
  Bottom sheet modal with **Socket** and **Room** action buttons.
- **AI & PZEM-004T Analytics** ([`AnalyticsScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/AnalyticsScreen.tsx)) *(From Docx)*  
  Live AC Voltage, Load Current, Active Power, Energy, Power Factor, Frequency, TinyML Anomaly score, vampire drain alerts, voice announcements, fault simulation, and emergency cutoff.
- **Settings Screen** ([`SettingsScreen.tsx`](file:///c:/Users/USER/Documents/NEW-PROJECTS/smart-socket2/src/screens/SettingsScreen.tsx))  
  User profile, hardware specifications, and voice alert preferences.

---

## 📁 Clean Native Project Structure

```
smart-socket2/
  ├── package.json               # Pure React Native dependencies
  ├── app.json                   # React Native / Expo configuration
  ├── index.js                   # Application entry point
  ├── App.tsx                    # Pure native router & SafeAreaView container
  └── src/
       ├── components/
       │    ├── Header.tsx
       │    ├── EnergyCard.tsx
       │    ├── SocketCard.tsx
       │    ├── RoomCard.tsx
       │    ├── FloatingNavBar.tsx
       │    └── AddNewModal.tsx
       ├── context/
       │    └── SocketContext.tsx
       ├── screens/              # All native screens
       ├── services/
       │    ├── aiEngine.ts      # TinyML anomaly evaluation
       │    └── iotSimulator.ts  # PZEM-004T telemetry stream
       └── types/
            └── index.ts
```

---

## 🚀 Running on Mobile

```bash
cd smart-socket2
npm install
npm start
```
Use `npm run android` for Android or `npm run ios` for iOS.
