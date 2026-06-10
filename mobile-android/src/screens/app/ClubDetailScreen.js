import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getClubDetail } from '../../services/api';

function ClubAvatar({ club, size = 72 }) {
  const initials = club.name
    ? club.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';
  if (club.logo) {
    return (
      <Image
        source={{ uri: club.logo }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }
  return (
    <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>{initials}</Text>
    </View>
  );
}

export default function ClubDetailScreen({ route, navigation }) {
  const { clubId } = route.params;
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getClubDetail(clubId)
      .then((res) => setClub(res.data ?? res))
      .catch((e) => setError(e.message || 'Club introuvable'))
      .finally(() => setLoading(false));
  }, [clubId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#1f6e3a" style={{ marginTop: 40 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {club && (
        <>
          <View style={styles.header}>
            <ClubAvatar club={club} size={80} />
            <Text style={styles.title}>{club.name}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations</Text>
            {club.city ? <Text style={styles.info}><Text style={styles.label}>Ville : </Text>{club.city}{club.country ? ` (${club.country})` : ''}</Text> : null}
            {club.stadium ? <Text style={styles.info}><Text style={styles.label}>Stade : </Text>{club.stadium}</Text> : null}
            {club.colors ? <Text style={styles.info}><Text style={styles.label}>Couleurs : </Text>{club.colors}</Text> : null}
            {club.founded_year ? <Text style={styles.info}><Text style={styles.label}>Fondé en : </Text>{club.founded_year}</Text> : null}
            {club.description ? <Text style={styles.info}><Text style={styles.label}>Description : </Text>{club.description}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Joueurs ({club.players?.length ?? 0})</Text>
            {club.players && club.players.length > 0 ? (
              club.players.map((p) => (
                <View key={p.id} style={styles.playerRow}>
                  <Text style={styles.jerseyNumber}>#{p.jerseyNumber ?? '-'}</Text>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{p.firstName} {p.lastName}</Text>
                    <Text style={styles.playerMeta}>{p.position || 'Position inconnue'}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.empty}>Aucun joueur enregistré.</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7faf7' },
  content: { padding: 16, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  backText: { color: '#1f6e3a', fontWeight: '700', fontSize: 15 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#134b2a', marginTop: 10, textAlign: 'center' },
  avatar: { borderWidth: 2, borderColor: '#1f6e3a' },
  avatarFallback: { backgroundColor: '#1f6e3a', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#dbe7db' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#134b2a', marginBottom: 10 },
  info: { fontSize: 14, color: '#334d3e', marginBottom: 5 },
  label: { fontWeight: '700' },
  playerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderBottomWidth: 1, borderColor: '#e8f0e8' },
  jerseyNumber: { width: 36, fontSize: 15, fontWeight: '700', color: '#1f6e3a', textAlign: 'center' },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 14, fontWeight: '600', color: '#143524' },
  playerMeta: { fontSize: 12, color: '#4b6655', marginTop: 1 },
  empty: { color: '#667f70', fontStyle: 'italic' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
