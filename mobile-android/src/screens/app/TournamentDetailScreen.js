import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getTournamentDetail } from '../../services/api';

function TournamentAvatar({ tournoi, size = 72 }) {
  const initials = tournoi.name
    ? tournoi.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';
  if (tournoi.logo) {
    return (
      <Image
        source={{ uri: tournoi.logo }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }
  return (
    <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>{initials}</Text>
    </View>
  );
}

const STATUS_LABELS = { active: 'En cours', upcoming: 'À venir', finished: 'Terminé' };
const STATUS_COLORS = { active: '#14532d', upcoming: '#0e7490', finished: '#6b7280' };

export default function TournamentDetailScreen({ route, navigation }) {
  const { tournamentId } = route.params;
  const [tournoi, setTournoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTournamentDetail(tournamentId)
      .then((res) => setTournoi(res.data ?? res))
      .catch((e) => setError(e.message || 'Tournoi introuvable'))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#1f6e3a" style={{ marginTop: 40 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {tournoi && (
        <>
          <View style={styles.header}>
            <TournamentAvatar tournoi={tournoi} size={80} />
            <Text style={styles.title}>{tournoi.name}</Text>
            {tournoi.status && (
              <Text style={[styles.badge, { backgroundColor: STATUS_COLORS[tournoi.status] ?? '#6b7280' }]}>
                {STATUS_LABELS[tournoi.status] ?? tournoi.status}
              </Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations</Text>
            {tournoi.season ? <Text style={styles.info}><Text style={styles.label}>Saison : </Text>{tournoi.season}</Text> : null}
            {tournoi.location ? <Text style={styles.info}><Text style={styles.label}>Lieu : </Text>{tournoi.location}</Text> : null}
            {tournoi.startDate ? <Text style={styles.info}><Text style={styles.label}>Début : </Text>{tournoi.startDate}</Text> : null}
            {tournoi.endDate ? <Text style={styles.info}><Text style={styles.label}>Fin : </Text>{tournoi.endDate}</Text> : null}
            {tournoi.description ? <Text style={styles.info}><Text style={styles.label}>Description : </Text>{tournoi.description}</Text> : null}
          </View>

          {tournoi.matches && tournoi.matches.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Matchs ({tournoi.matches.length})</Text>
              {tournoi.matches.map((m) => (
                <View key={m.id} style={styles.matchRow}>
                  <Text style={styles.matchTeams}>
                    {m.homeTeam?.name ?? m.homeTeam} <Text style={styles.vs}>vs</Text> {m.awayTeam?.name ?? m.awayTeam}
                  </Text>
                  {m.status !== 'scheduled' && (
                    <Text style={styles.score}>{m.homeScore ?? '-'} - {m.awayScore ?? '-'}</Text>
                  )}
                  <Text style={styles.matchDate}>{m.matchDate || ''}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7faf7' },
  content: { padding: 16, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { color: '#1f6e3a', fontWeight: '700', fontSize: 15 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#134b2a', marginTop: 10, textAlign: 'center' },
  badge: { marginTop: 6, color: '#fff', fontSize: 12, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, overflow: 'hidden' },
  avatar: { borderWidth: 2, borderColor: '#134b2a' },
  avatarFallback: { backgroundColor: '#134b2a', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#dbe7db' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#134b2a', marginBottom: 10 },
  info: { fontSize: 14, color: '#334d3e', marginBottom: 5 },
  label: { fontWeight: '700' },
  matchRow: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#e8f0e8' },
  matchTeams: { fontSize: 14, fontWeight: '600', color: '#143524' },
  vs: { color: '#4b6655', fontWeight: '400' },
  score: { fontSize: 16, fontWeight: '700', color: '#0f5132', marginTop: 2 },
  matchDate: { fontSize: 12, color: '#667f70', marginTop: 2 },
  empty: { color: '#667f70', fontStyle: 'italic' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
