import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TimerProvider } from './src/context/TimerContext';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <TimerProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'timer' : 'timer-outline';
                } else if (route.name === 'History') {
                  iconName = focused ? 'list' : 'list-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4caf50',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </TimerProvider>
    </SafeAreaProvider>
  );
};

export default App;