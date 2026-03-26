import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ensureNotificationPermission, notifyFavoriteAdded } from '../../services/notifications';

export default function NotificationsScreen() {
  const [granted, setGranted] = useState(false);
  const [statusText, setStatusText] = useState('Verification permission...');

  useEffect(() => {
    (async () => {
      const ok = await ensureNotificationPermission();
      setGranted(ok);
      setStatusText(ok ? 'Notifications actives' : 'Notifications non autorisees');
    })();
  }, []);

  async function requestAgain() {
    const ok = await ensureNotificationPermission();
    setGranted(ok);
    setStatusText(ok ? 'Notifications actives' : 'Toujours bloquees');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.card}>
        <Text style={styles.info}>{statusText}</Text>
        <Pressable style={styles.button} onPress={requestAgain}>
          <Text style={styles.buttonText}>Verifier / Activer permission</Text>
        </Pressable>
        <Pressable
          style={[styles.button, !granted && styles.buttonDisabled]}
          onPress={() => notifyFavoriteAdded('Club test')}
          disabled={!granted}
        >
          <Text style={styles.buttonText}>Envoyer une notification test</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#dbe7db', padding: 14 },
  info: { color: '#143524', marginBottom: 10 },
  button: { marginTop: 8, backgroundColor: '#1f6e3a', borderRadius: 10, padding: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#8aa796' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
