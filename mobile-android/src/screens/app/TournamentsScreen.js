import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { getTournaments } from '../../services/api';

function TournamentAvatar({ item, size = 44 }) {
  const initials = item.name
    ? item.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';
  if (item.logo) {
    return (
      <Image
        source={{ uri: item.logo }}
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: '#134b2a', marginRight: 10 }}
      />
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#134b2a', alignItems: 'center', justifyContent: 'center', marginRight: 10,
    }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.3 }}>{initials}</Text>
    </View>
  );
}

export default function TournamentsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTournaments()
      .then((res) => setItems(res.data || []))
      .catch((e) => setError(e.message || 'Erreur chargement tournois'));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournois</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TournamentAvatar item={item} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.season || '-'} • {item.location || '-'}</Text>
                <Text style={styles.meta}>Statut: {item.status || '-'}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
              style={styles.btnInfo}
            >
              <Text style={styles.btnInfoText}>Voir les infos</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 17, fontWeight: '700', color: '#143524' },
  meta: { marginTop: 2, color: '#4b6655', fontSize: 13 },
  btnInfo: { backgroundColor: '#e8f5ee', borderWidth: 1, borderColor: '#134b2a', borderRadius: 10, padding: 9, alignItems: 'center' },
  btnInfoText: { color: '#134b2a', fontWeight: '700', fontSize: 13 },
  error: { color: '#b91c1c', marginBottom: 8 },
});
