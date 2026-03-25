import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, View } from 'react-native'

import { AuthProvider, useAuth } from './context/AuthContext'

// Screens
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import ClubDetailScreen from './screens/ClubDetailScreen'
import TournamentDetailScreen from './screens/TournamentDetailScreen'

const Stack = createNativeStackNavigator()

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // Utilisateur connecté
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            cardStyle: { backgroundColor: '#fff' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ClubDetail" component={ClubDetailScreen} />
          <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} />
        </Stack.Navigator>
      ) : (
        // Utilisateur non connecté
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            cardStyle: { backgroundColor: '#fff' },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationTypeForReplace: !isAuthenticated ? 'pop' : 'default',
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              animationEnabled: true,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}
