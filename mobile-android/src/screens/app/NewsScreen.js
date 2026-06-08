import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { getNews } from '../../services/api';

export default function NewsScreen() {
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    getNews()
      .then((res) => setItems(res.data || []))
      .catch((e) => setError(e.message || 'Erreur chargement actualites'));
  }, []);

  function toggle(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualites</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isOpen = !!expanded[item.id];
          const shortText = (item.description || '').slice(0, 120);

          return (
            <View style={styles.card}>
              {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.image} /> : null}
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
              <Text style={styles.desc}>{isOpen ? item.description : `${shortText}${(item.description || '').length > 120 ? '...' : ''}`}</Text>
              {(item.description || '').length > 120 ? (
                <Pressable onPress={() => toggle(item.id)} style={styles.button}>
                  <Text style={styles.buttonText}>{isOpen ? 'Voir moins' : 'Voir plus'}</Text>
                </Pressable>
              ) : null}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Aucune actualite publiee.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderColor: '#dbe7db', borderWidth: 1, padding: 12, marginBottom: 10 },
  image: { width: '100%', height: 140, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#143524' },
  subtitle: { marginTop: 4, color: '#355140', fontWeight: '600' },
  desc: { marginTop: 8, color: '#4b6655', lineHeight: 20 },
  button: { marginTop: 10, backgroundColor: '#1f6e3a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  empty: { color: '#667f70', marginTop: 18 },
  error: { color: '#b91c1c', marginBottom: 8 },
});
