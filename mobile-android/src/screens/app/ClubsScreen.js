import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { addFavorite, getClubs, getFavorites, removeFavorite } from '../../services/api';
import { notifyFavoriteAdded } from '../../services/notifications';

export default function ClubsScreen() {
  const [clubs, setClubs] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
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
      const [clubsRes, favoritesRes] = await Promise.all([
        getClubs(),
        getFavorites().catch(() => ({ data: [] })),
      ]);

      setClubs(clubsRes.data || []);
      const ids = (favoritesRes.data || []).map((c) => c.id);
      setFavoriteIds(new Set(ids));
    } catch (e) {
      setError(e.message || 'Erreur chargement clubs');
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

  async function handleToggleFavorite(club) {
    const isFav = favoriteIds.has(club.id);
    try {
      if (isFav) {
        await removeFavorite(club.id);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(club.id);
          return next;
        });
        Alert.alert('OK', `${club.name} retiré des favoris`);
      } else {
        await addFavorite(club.id);
        await notifyFavoriteAdded(club.name);
        setFavoriteIds((prev) => new Set([...prev, club.id]));
        Alert.alert('OK', `${club.name} ajouté aux favoris`);
      }
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Action impossible');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1f6e3a" />
        </View>
      ) : null}
      <FlatList
        data={clubs}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isFav = favoriteIds.has(item.id);
          return (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.city || '-'} • {item.country || '-'}</Text>
              <Pressable
                onPress={() => handleToggleFavorite(item)}
                style={[styles.button, isFav && styles.buttonActive]}
              >
                <Text style={styles.buttonText}>
                  {isFav ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
                </Text>
              </Pressable>
            </View>
          );
        }}
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
  button: { marginTop: 8, backgroundColor: '#1f6e3a', borderRadius: 10, padding: 10, alignItems: 'center' },
  buttonActive: { backgroundColor: '#b91c1c' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
