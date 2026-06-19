import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { getTournaments } from '../../services/api';

export default function TournamentsScreen() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');
    try {
      const res = await getTournaments();
      setItems(res.data || []);
    } catch (e) {
      setError(e.message || 'Erreur chargement tournois');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleRefresh() {
    loadData({ refresh: true });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournois</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1f6e3a" />
        </View>
      ) : null}
      <FlatList
        data={items}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.season || '-'} • {item.location || '-'}</Text>
            <Text style={styles.meta}>Statut: {item.status || '-'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  loaderWrap: { paddingVertical: 12 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe7db', borderRadius: 12, padding: 12, marginBottom: 10 },
  name: { fontSize: 17, fontWeight: '700', color: '#143524' },
  meta: { marginTop: 3, color: '#4b6655' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
