import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TournamentDetailScreen({ route }) {
  const tournament = route?.params?.tournament;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tournament?.name || 'Detail du tournoi'}</Text>
      <Text style={styles.meta}>Saison: {tournament?.season || '-'}</Text>
      <Text style={styles.meta}>Lieu: {tournament?.location || '-'}</Text>
      <Text style={styles.meta}>Cet ecran est pret pour afficher les details complets.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  meta: { marginTop: 4, color: '#4b6655' },
});
