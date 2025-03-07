import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AuthPage from './screens/AuthPage';
import SchedulePage from './screens/SchedulePage';
import ProfilePage from './screens/ProfilePage';
import ThemesPage from './screens/ThemesPage';
import SkippingPage from './screens/SkippingPage';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Расписание') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Пропуски занятий') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Темы работ') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Профиль') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5786ff', // Цвет активных иконок
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: () => null, // Убираем текст из пунктов меню
      })}
    >
      <Tab.Screen name="Расписание" component={SchedulePage} />
      <Tab.Screen name="Пропуски занятий" component={SkippingPage} />
      <Tab.Screen name="Темы работ" component={ThemesPage} />
      <Tab.Screen name="Профиль" component={ProfilePage} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthPage} />
        <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
