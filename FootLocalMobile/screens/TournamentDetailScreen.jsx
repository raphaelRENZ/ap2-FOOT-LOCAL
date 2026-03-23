import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native'
import { useAuth } from '../context/AuthContext'
import { getTournamentDetails } from '../services/api'

export default function TournamentDetailScreen({ route, navigation }) {
  const { tournamentId } = route.params || {}
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTournament()
  }, [tournamentId])

  async function loadTournament() {
    try {
      setLoading(true)
      const result = await getTournamentDetails(tournamentId)
      if (result.success) {
        setTournament(result.data)
      } else {
        Alert.alert('Erreur', 'Impossible de charger le tournoi')
      }
    } catch (error) {
      console.error('Load tournament error:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  function getStatusColor(status) {
    const statusLower = status?.toLowerCase()
    if (statusLower === 'planned') return '#FFA500'
    if (statusLower === 'ongoing') return '#34a853'
    if (statusLower === 'finished') return '#999'
    return '#1a73e8'
  }

  function getStatusLabel(status) {
    const statusLower = status?.toLowerCase()
    if (statusLower === 'planned') return '📋 Prévu'
    if (statusLower === 'ongoing') return '🏃 En cours'
    if (statusLower === 'finished') return '✅ Terminé'
    return status
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1a73e8" />
        </View>
      </SafeAreaView>
    )
  }

  if (!tournament) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Tournoi non trouvé</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonSmall}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backButtonTextSmall}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {tournament.name}
        </Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Tournament Info */}
        <View style={styles.infoCard}>
          <Text style={styles.tournamentName}>{tournament.name}</Text>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(tournament.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(tournament.status)}
            </Text>
          </View>

          {tournament.description && (
            <Text style={styles.description}>{tournament.description}</Text>
          )}
        </View>

        {/* Dates & Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Informations</Text>

          {tournament.startDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Début:</Text>
              <Text style={styles.infoValue}>{formatDate(tournament.startDate)}</Text>
            </View>
          )}

          {tournament.endDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Fin:</Text>
              <Text style={styles.infoValue}>{formatDate(tournament.endDate)}</Text>
            </View>
          )}

          {tournament.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Lieu:</Text>
              <Text style={styles.infoValue}>{tournament.location}</Text>
            </View>
          )}

          {tournament.maxTeams && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👥 Équipes max:</Text>
              <Text style={styles.infoValue}>{tournament.maxTeams}</Text>
            </View>
          )}

          {tournament.registeredTeams && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>✅ Équipes inscrites:</Text>
              <Text style={styles.infoValue}>{tournament.registeredTeams}</Text>
            </View>
          )}
        </View>

        {/* Rules Section */}
        {tournament.rules && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Règlement</Text>
            <Text style={styles.description}>{tournament.rules}</Text>
          </View>
        )}

        {/* Fee Section */}
        {tournament.fee !== undefined && tournament.fee !== null && (
          <View style={styles.detailsCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💰 Frais d'inscription:</Text>
              <Text style={styles.infoValue}>{tournament.fee} €</Text>
            </View>
          </View>
        )}

        {/* Contact Section */}
        {tournament.contactEmail && (
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>✉️ Email:</Text>
              <Text style={styles.infoValue}>{tournament.contactEmail}</Text>
            </View>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButtonSmall: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backButtonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
})
