          
# Timer App
A React Native mobile application for managing timers with category grouping and history tracking. Perfect for productivity, fitness tracking, or any timed activities.

## Project Overview
This Timer App was built as a demonstration of React Native development skills, showcasing state management, UI design, and mobile app architecture.

## Features
- **Timer Management**: Create, start, pause, and reset timers with custom names and durations
- **Category Organization**: Group timers by categories for better organization
- **Bulk Actions**: Start, pause, or reset all timers in a category with a single tap
- **Visual Progress**: Track remaining time with progress bars
- **Notifications**: Get alerts when timers complete
- **Halfway Alerts**: Optional notifications when timers reach halfway point
- **History Tracking**: View logs of all completed timers
- **Data Export**: Export timer history data
- **Category Filtering**: Filter history by specific categories

## Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs)
- **State Management**: React Context API with useReducer
- **Storage**: AsyncStorage for persistent data
- **UI Components**: Custom React Native components
- **Icons**: Expo Vector Icons

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation
```bash
git clone https://github.com/SachinM44/HealthFlex.git
cd TimerApp
npm install
npm start
```

### Running on Device/Simulator
After starting the development server:

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with the Expo Go app

## Project Structure
/src
  /components      # Reusable UI components
  /context         # State management with Context API
  /hooks           # Custom React hooks
  /screens         # Main application screens
  /types           # TypeScript type definitions
  /utils           # Utility functions

## Implementation Details
- **Timer Logic**: Custom hook manages timer countdown with setInterval
- **State Management**: Reducer pattern for predictable state updates
- **Persistence**: AsyncStorage saves app state between sessions
- **Default Categories**: Pre-populated categories (Work, Personal, Fitness)
- **Responsive Design**: Adapts to different screen sizes
- **Safe Area Handling**: Proper display on devices with notches
