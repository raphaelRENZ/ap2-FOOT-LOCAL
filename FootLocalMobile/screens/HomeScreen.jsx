import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { getClubs, getTournaments } from '../services/api'

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth()
  const [clubs, setClubs] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('clubs')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const [clubsResult, tournamentsResult] = await Promise.all([
        getClubs(),
        getTournaments(),
      ])

      if (clubsResult.success) setClubs(clubsResult.data || [])
      if (tournamentsResult.success) setTournaments(tournamentsResult.data || [])
    } catch (error) {
      console.error('Load data error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function onRefresh() {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  async function handleLogout() {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', onPress: () => {} },
      {
        text: 'Déconnecter',
        onPress: async () => {
          await logout()
        },
        style: 'destructive',
      },
    ])
  }

  const ClubItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation?.navigate('ClubDetail', { clubId: item.id })}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.city && <Text style={styles.cardSubtitle}>{item.city}</Text>}
      {item.stadium && <Text style={styles.cardText}>Stade: {item.stadium}</Text>}
    </TouchableOpacity>
  )

  const TournamentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation?.navigate('TournamentDetail', { tournamentId: item.id })}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.startDate && (
        <Text style={styles.cardSubtitle}>
          Début: {new Date(item.startDate).toLocaleDateString('fr-FR')}
        </Text>
      )}
      {item.status && <Text style={styles.cardText}>Statut: {item.status}</Text>}
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Bienvenue {user?.firstName || user?.email || 'Utilisateur'}! 👋
          </Text>
          <Text style={styles.headerSubtitle}>En direct de Foot Local</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'clubs' && styles.activeTab]}
          onPress={() => setActiveTab('clubs')}
        >
          <Text style={[styles.tabText, activeTab === 'clubs' && styles.activeTabText]}>
            ⚽ Clubs ({clubs.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]}
          onPress={() => setActiveTab('tournaments')}
        >
          <Text style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]}>
            🏆 Tournois ({tournaments.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'clubs' && (
        <FlatList
          data={clubs}
          renderItem={({ item }) => <ClubItem item={item} />}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun club disponible</Text>
            </View>
          }
        />
      )}

      {activeTab === 'tournaments' && (
        <FlatList
          data={tournaments}
          renderItem={({ item }) => <TournamentItem item={item} />}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun tournoi disponible</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 25,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1a73e8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#1a73e8',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#1a73e8',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 13,
    color: '#666',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
})
