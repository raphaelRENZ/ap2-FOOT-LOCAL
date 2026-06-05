import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { addFavorite, getClubs, getFavorites, removeFavorite } from '../../services/api';
import { notifyFavoriteAdded } from '../../services/notifications';

export default function ClubsScreen() {
  const [clubs, setClubs] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    getClubs()
      .then((res) => setClubs(res.data || []))
      .catch((e) => setError(e.message || 'Erreur chargement clubs'));

    getFavorites()
      .then((res) => {
        const ids = (res.data || []).map((c) => c.id);
        setFavoriteIds(new Set(ids));
      })
      .catch(() => {
        // Pas bloquant si les favoris ne chargent pas
      });
  }, []);

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
      <FlatList
        data={clubs}
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
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe7db', borderRadius: 12, padding: 12, marginBottom: 10 },
  name: { fontSize: 17, fontWeight: '700', color: '#143524' },
  meta: { marginTop: 3, color: '#4b6655' },
  button: { marginTop: 8, backgroundColor: '#1f6e3a', borderRadius: 10, padding: 10, alignItems: 'center' },
  buttonActive: { backgroundColor: '#b91c1c' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
