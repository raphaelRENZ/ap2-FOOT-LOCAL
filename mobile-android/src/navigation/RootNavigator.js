import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import NewsScreen from '../screens/app/NewsScreen';
import ClubsScreen from '../screens/app/ClubsScreen';
import TournamentsScreen from '../screens/app/TournamentsScreen';
import FavoritesScreen from '../screens/app/FavoritesScreen';
import NotificationsScreen from '../screens/app/NotificationsScreen';
import AdminNotificationsScreen from '../screens/app/AdminNotificationsScreen';
import AccountScreen from '../screens/app/AccountScreen';

const Stack = createNativeStackNavigator();

const SCREEN_MAP = {
  actus: { label: 'Actus', component: NewsScreen },
  matchs: { label: 'Matchs', component: MatchesScreen },
  clubs: { label: 'Clubs', component: ClubsScreen },
  tournois: { label: 'Tournois', component: TournamentsScreen },
  favoris: { label: 'Favoris', component: FavoritesScreen },
  notif: { label: 'Notifications', component: NotificationsScreen },
  adminNotif: { label: 'Admin notif', component: AdminNotificationsScreen },
  compte: { label: 'Compte', component: AccountScreen },
};

function AppShell() {
  const { isAdmin, showWelcomeToast, dismissWelcomeToast } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState('actus');

  React.useEffect(() => {
    if (!showWelcomeToast) return undefined;

    const timer = setTimeout(() => {
      dismissWelcomeToast();
    }, 3800);

    return () => clearTimeout(timer);
  }, [showWelcomeToast, dismissWelcomeToast]);

  const menuItems = [
    'actus',
    'matchs',
    'clubs',
    'tournois',
    'favoris',
    'notif',
    ...(isAdmin ? ['adminNotif'] : []),
    'compte',
  ];

  const ActiveScreen = SCREEN_MAP[activeKey]?.component || NewsScreen;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandWrap}>
          <Image source={require('../../img/logo_foot_local-removebg-preview.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brandText}>Foot Local</Text>
        </View>
        <Pressable onPress={() => setMenuOpen(true)} style={styles.burgerBtn}>
          <Text style={styles.burgerText}>☰</Text>
        </Pressable>
      </View>

      <View style={styles.screenWrap}>
        <ActiveScreen />
      </View>

      {menuOpen ? (
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
          <View style={styles.drawer}>
            <Text style={styles.drawerTitle}>Navigation</Text>
            {menuItems.map((key) => {
              const isActive = key === activeKey;
              return (
                <Pressable
                  key={key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => {
                    setActiveKey(key);
                    setMenuOpen(false);
                  }}
                >
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]}>{SCREEN_MAP[key].label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {showWelcomeToast ? (
        <View style={styles.toastWrap}>
          <View style={styles.toast}>
            <Text style={styles.toastText}>Bienvenue sur l'app mobile Foot Local.</Text>
            <Pressable onPress={dismissWelcomeToast} style={styles.toastCloseBtn}>
              <Text style={styles.toastCloseText}>✕</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
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
        <Stack.Screen name="App" component={AppShell} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f7f2',
  },
  topBar: {
    backgroundColor: '#1b7a43',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 36,
    height: 36,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  burgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  burgerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: -2,
  },
  screenWrap: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  drawer: {
    width: 250,
    backgroundColor: '#ffffff',
    paddingTop: 56,
    paddingHorizontal: 14,
    borderLeftWidth: 1,
    borderLeftColor: '#dbe7db',
  },
  drawerTitle: {
    color: '#134b2a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  menuItem: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  menuItemActive: {
    backgroundColor: '#e8f3eb',
  },
  menuText: {
    color: '#234634',
    fontSize: 16,
    fontWeight: '600',
  },
  menuTextActive: {
    color: '#1b7a43',
  },
  toastWrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 102,
  },
  toast: {
    backgroundColor: '#123f29',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  toastCloseBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  toastCloseText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: -1,
  },
});
