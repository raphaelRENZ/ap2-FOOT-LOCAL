import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { addFavorite, getClubs, getFavorites, removeFavorite } from '../../services/api';
import { notifyFavoriteAdded } from '../../services/notifications';

function ClubAvatar({ club, size = 44 }) {
  const initials = club.name
    ? club.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';
  if (club.logo) {
    return (
      <Image
        source={{ uri: club.logo }}
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: '#1f6e3a', marginRight: 10 }}
      />
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#1f6e3a', alignItems: 'center', justifyContent: 'center', marginRight: 10,
    }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.3 }}>{initials}</Text>
    </View>
  );
}

export default function ClubsScreen({ navigation }) {
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
              <View style={styles.cardHeader}>
                <ClubAvatar club={item} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>{item.city || '-'} • {item.country || '-'}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <Pressable
                  onPress={() => navigation.navigate('ClubDetail', { clubId: item.id })}
                  style={styles.btnInfo}
                >
                  <Text style={styles.btnInfoText}>Voir les infos</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleToggleFavorite(item)}
                  style={[styles.button, isFav && styles.buttonActive]}
                >
                  <Text style={styles.buttonText}>
                    {isFav ? '★ Retirer' : '☆ Favori'}
                  </Text>
                </Pressable>
              </View>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 17, fontWeight: '700', color: '#143524' },
  meta: { marginTop: 2, color: '#4b6655', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8 },
  btnInfo: { flex: 1, backgroundColor: '#e8f5ee', borderWidth: 1, borderColor: '#1f6e3a', borderRadius: 10, padding: 9, alignItems: 'center' },
  btnInfoText: { color: '#1f6e3a', fontWeight: '700', fontSize: 13 },
  button: { flex: 1, backgroundColor: '#1f6e3a', borderRadius: 10, padding: 9, alignItems: 'center' },
  buttonActive: { backgroundColor: '#b91c1c' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  error: { color: '#b91c1c', marginBottom: 8 },
});
