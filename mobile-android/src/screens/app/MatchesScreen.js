import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getMatchesByStatus } from '../../services/api';

const FILTERS = ['scheduled', 'live', 'finished'];

function Badge({ status }) {
  const label = status === 'scheduled' ? 'A venir' : status === 'live' ? 'En cours' : 'Termine';
  const color = status === 'scheduled' ? '#0e7490' : status === 'live' ? '#b91c1c' : '#14532d';
  return <Text style={[styles.badge, { backgroundColor: color }]}>{label}</Text>;
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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowTop}>
              <Text style={styles.date}>{item.matchDate || '-'}</Text>
              <Badge status={item.status} />
            </View>
            <Text style={styles.teams}>{item.homeTeam?.name || item.homeTeam} vs {item.awayTeam?.name || item.awayTeam}</Text>
            {item.status !== 'scheduled' && (
              <Text style={styles.score}>{item.homeScore ?? '-'} - {item.awayScore ?? '-'}</Text>
            )}
          </View>
        )}
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
  empty: { color: '#667f70', marginTop: 18 },
  error: { color: '#b91c1c', marginBottom: 8 },
});
