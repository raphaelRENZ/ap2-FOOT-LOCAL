import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function AccountScreen() {
  const { profile, logout, isAdmin } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon compte</Text>
      <View style={styles.card}>
        <Text style={styles.row}>Email: {profile?.email || '-'}</Text>
        <Text style={styles.row}>Nom: {(profile?.firstName || '') + ' ' + (profile?.lastName || '')}</Text>
        <Text style={styles.row}>Roles: {(profile?.roles || []).join(', ') || '-'}</Text>
      </View>

      {isAdmin ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>Compte admin detecte: tu peux brancher ici les actions notification.</Text>
        </View>
      ) : null}

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#dbe7db', padding: 14 },
  row: { color: '#143524', marginBottom: 8 },
  notice: { marginTop: 14, backgroundColor: '#fff4cc', borderRadius: 10, padding: 12 },
  noticeText: { color: '#6b4f00' },
  logoutBtn: { marginTop: 20, backgroundColor: '#1f6e3a', borderRadius: 10, padding: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' },
});
