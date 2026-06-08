import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import NewsScreen from '../screens/app/NewsScreen';
import ClubsScreen from '../screens/app/ClubsScreen';
import ClubDetailScreen from '../screens/app/ClubDetailScreen';
import TournamentsScreen from '../screens/app/TournamentsScreen';
import TournamentDetailScreen from '../screens/app/TournamentDetailScreen';
import FavoritesScreen from '../screens/app/FavoritesScreen';
import NotificationsScreen from '../screens/app/NotificationsScreen';
import AdminNotificationsScreen from '../screens/app/AdminNotificationsScreen';
import AccountScreen from '../screens/app/AccountScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Actus" component={NewsScreen} />
      <Tab.Screen name="Matchs" component={MatchesScreen} />
      <Tab.Screen name="Clubs" component={ClubsScreen} />
      <Tab.Screen name="Tournois" component={TournamentsScreen} />
      <Tab.Screen name="Favoris" component={FavoritesScreen} />
      <Tab.Screen name="Notif" component={NotificationsScreen} />
      {isAdmin ? <Tab.Screen name="Admin notif" component={AdminNotificationsScreen} /> : null}
      <Tab.Screen name="Compte" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="App" component={AppTabs} />
          <Stack.Screen
            name="ClubDetail"
            component={ClubDetailScreen}
            options={{ headerShown: true, title: 'Détail club', headerTintColor: '#1f6e3a' }}
          />
          <Stack.Screen
            name="TournamentDetail"
            component={TournamentDetailScreen}
            options={{ headerShown: true, title: 'Détail tournoi', headerTintColor: '#134b2a' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
