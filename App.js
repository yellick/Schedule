import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './screens/AuthPage';
import SchedulePage from './screens/SchedulePage';
import ProfilePage from './screens/ProfilePage';
import ThemesPage from './screens/ThemesPage';
import SkippingPage from './screens/SkippingPage';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

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
          } else if (route.name === 'Научные работы') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Профиль') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5786ff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name="Расписание" component={SchedulePage} />
      <Tab.Screen name="Пропуски занятий" component={SkippingPage} />
      <Tab.Screen name="Научные работы" component={ThemesPage} />
      <Tab.Screen name="Профиль" component={ProfilePage} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5786ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen 
          name="Расписание" 
          component={BottomTabNavigator}
          options={{ title: 'Расписание' }}
        />
      ) : (
        <Stack.Screen name="Auth" component={AuthPage} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}