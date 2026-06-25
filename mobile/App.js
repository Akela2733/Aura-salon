import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Sparkles, Scissors, Calendar, User } from 'lucide-react-native';

import SanctuaryScreen from './src/screens/SanctuaryScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import AiConsultantScreen from './src/screens/AiConsultantScreen';
import BookingScreen from './src/screens/BookingScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: '#C9A35B',
        background: '#0a0a0a',
        card: '#000000',
        text: '#F5F5F0',
        border: '#2a2a2a',
        notification: '#C9A35B',
      },
    }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#2a2a2a',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarActiveTintColor: '#C9A35B',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen 
          name="Sanctuary" 
          component={SanctuaryScreen} 
          options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
        />
        <Tab.Screen 
          name="Services" 
          component={ServicesScreen} 
          options={{ tabBarIcon: ({ color, size }) => <Scissors color={color} size={size} /> }}
        />
        <Tab.Screen 
          name="AI Consult" 
          component={AiConsultantScreen} 
          options={{ tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} /> }}
        />
        <Tab.Screen 
          name="Booking" 
          component={BookingScreen} 
          options={{ tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
