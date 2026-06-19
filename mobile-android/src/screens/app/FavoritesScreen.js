import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, getMatchesByStatus, removeFavorite } from '../../services/api';
import { notifyUpcomingFavoriteMatches } from '../../services/notifications';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
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
      const res = await getFavorites();
      const favs = res.data || [];
      setFavorites(favs);

      try {
        const scheduled = await getMatchesByStatus('scheduled');
        await notifyUpcomingFavoriteMatches(favs, scheduled.data || []);
      } catch {
        // Le rappel push ne doit pas bloquer l'ecran favoris.
      }
    } catch (e) {
      setError(e.message || 'Erreur chargement favoris');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  function handleRefresh() {
    loadData({ refresh: true });
  }

  async function handleRemove(clubId) {
    try {
      await removeFavorite(clubId);
      setFavorites((prev) => prev.filter((c) => c.id !== clubId));
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Suppression impossible');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes favoris</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1f6e3a" />
        </View>
      ) : null}
      <FlatList
        data={favorites}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.city || '-'} • {item.country || '-'}</Text>
            <Pressable onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
              <Text style={styles.removeText}>Retirer</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun favori.</Text>}
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
  removeBtn: { marginTop: 8, backgroundColor: '#b91c1c', borderRadius: 10, padding: 10, alignItems: 'center' },
  removeText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#667f70', marginTop: 18 },
  error: { color: '#b91c1c', marginBottom: 8 },
});
