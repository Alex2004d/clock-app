import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';

import AlarmScreen from '../screens/AlarmScreen';
import ClockScreen from '../screens/ClockScreen';
import StopwatchScreen from '../screens/StopwatchScreen';
import TimerScreen from '../screens/TimerScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
        }}
      >
        <Tab.Screen 
          name="Reloj" 
          component={ClockScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: 24, color }}>🕐</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Cronómetro" 
          component={StopwatchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: 24, color }}>⏱️</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Alarma" 
          component={AlarmScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: 24, color }}>⏰</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Temporizador" 
          component={TimerScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: 24, color }}>⏲️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}