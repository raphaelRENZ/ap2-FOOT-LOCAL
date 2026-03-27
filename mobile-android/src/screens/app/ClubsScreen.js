import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { addFavorite, getClubs } from '../../services/api';
import { notifyFavoriteAdded } from '../../services/notifications';

export default function ClubsScreen() {
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getClubs()
      .then((res) => setClubs(res.data || []))
      .catch((e) => setError(e.message || 'Erreur chargement clubs'));
  }, []);

  async function handleFavorite(club) {
    try {
      await addFavorite(club.id);
      await notifyFavoriteAdded(club.name);
      Alert.alert('OK', `${club.name} ajoute aux favoris`);
    } catch (e) {
      Alert.alert('Erreur', e.message || 'Impossible d\'ajouter en favori');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clubs</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={clubs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.city || '-'} • {item.country || '-'}</Text>
            <Pressable onPress={() => handleFavorite(item)} style={styles.button}>
              <Text style={styles.buttonText}>Ajouter aux favoris</Text>
            </Pressable>
          </View>
        )}
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
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
