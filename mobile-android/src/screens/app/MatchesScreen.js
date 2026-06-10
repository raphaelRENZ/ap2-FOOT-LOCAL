import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getMatchesByStatus } from '../../services/api';

const FILTERS = ['scheduled', 'live', 'finished'];

function Badge({ status }) {
  const label = status === 'scheduled' ? 'A venir' : status === 'live' ? 'En cours' : 'Termine';
  const color = status === 'scheduled' ? '#0e7490' : status === 'live' ? '#b91c1c' : '#14532d';
  return <Text style={[styles.badge, { backgroundColor: color }]}>{label}</Text>;
}

function MatchCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.date}>{item.matchDate || '-'}</Text>
        <Badge status={item.status} />
      </View>
      <Text style={styles.teams}>
        {item.homeTeam?.name || item.homeTeam} vs {item.awayTeam?.name || item.awayTeam}
      </Text>
      {item.status !== 'scheduled' && (
        <Text style={styles.score}>{item.homeScore ?? '-'} - {item.awayScore ?? '-'}</Text>
      )}
      <Pressable onPress={() => setExpanded((v) => !v)} style={styles.btnInfo}>
        <Text style={styles.btnInfoText}>{expanded ? 'Masquer' : 'Voir les infos'}</Text>
      </Pressable>
      {expanded && (
        <View style={styles.details}>
          {item.location ? <Text style={styles.detailRow}><Text style={styles.detailLabel}>Lieu : </Text>{item.location}</Text> : null}
          {item.tournament?.name ? <Text style={styles.detailRow}><Text style={styles.detailLabel}>Tournoi : </Text>{item.tournament.name}</Text> : null}
          {item.homeTeam?.name ? <Text style={styles.detailRow}><Text style={styles.detailLabel}>Équipe domicile : </Text>{item.homeTeam.name}{item.homeTeam.city ? ` (${item.homeTeam.city})` : ''}</Text> : null}
          {item.awayTeam?.name ? <Text style={styles.detailRow}><Text style={styles.detailLabel}>Équipe extérieur : </Text>{item.awayTeam.name}{item.awayTeam.city ? ` (${item.awayTeam.city})` : ''}</Text> : null}
          {item.status === 'finished' && <Text style={styles.detailRow}><Text style={styles.detailLabel}>Score final : </Text>{item.homeScore ?? '-'} - {item.awayScore ?? '-'}</Text>}
        </View>
      )}
    </View>
  );
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('scheduled');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    getMatchesByStatus(filter)
      .then((res) => setMatches(res.data || []))
      .catch((e) => setError(e.message || 'Erreur chargement matchs'));
  }, [filter]);

  const filtered = useMemo(() => matches, [matches]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchs</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'scheduled' ? 'A venir' : f === 'live' ? 'En cours' : 'Termines'}
            </Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MatchCard item={item} />}
        ListEmptyComponent={<Text style={styles.empty}>Aucun match pour ce filtre.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#e5efe5', borderRadius: 20 },
  filterActive: { backgroundColor: '#1f6e3a' },
  filterText: { color: '#1f3b2a', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#dbe7db' },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  date: { color: '#355140' },
  teams: { fontSize: 16, fontWeight: '700', color: '#143524' },
  score: { marginTop: 5, fontSize: 18, fontWeight: '700', color: '#0f5132' },
  badge: { color: '#fff', fontSize: 11, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 12, overflow: 'hidden' },
  btnInfo: { marginTop: 8, backgroundColor: '#e8f5ee', borderWidth: 1, borderColor: '#1f6e3a', borderRadius: 10, padding: 8, alignItems: 'center' },
  btnInfoText: { color: '#1f6e3a', fontWeight: '700', fontSize: 13 },
  details: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: '#e8f0e8' },
  detailRow: { fontSize: 13, color: '#334d3e', marginBottom: 4 },
  detailLabel: { fontWeight: '700' },
  empty: { color: '#667f70', marginTop: 18 },
  error: { color: '#b91c1c', marginBottom: 8 },
});
