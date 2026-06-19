import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ClubDetailScreen({ route }) {
  const club = route?.params?.club;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{club?.name || 'Detail du club'}</Text>
      <Text style={styles.meta}>Ville: {club?.city || '-'}</Text>
      <Text style={styles.meta}>Pays: {club?.country || '-'}</Text>
      <Text style={styles.meta}>Cet ecran est pret pour afficher les details complets.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  meta: { marginTop: 4, color: '#4b6655' },
});
