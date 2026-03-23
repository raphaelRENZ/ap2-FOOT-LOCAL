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
import { getClubDetails, addFavoriteClub, removeFavoriteClub, getFavorites } from '../services/api'

export default function ClubDetailScreen({ route, navigation }) {
  const { clubId } = route.params || {}
  const { isAuthenticated } = useAuth()
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [addingFavorite, setAddingFavorite] = useState(false)

  useEffect(() => {
    loadClub()
    if (isAuthenticated) {
      checkFavorite()
    }
  }, [clubId])

  async function loadClub() {
    try {
      setLoading(true)
      const result = await getClubDetails(clubId)
      if (result.success) {
        setClub(result.data)
      } else {
        Alert.alert('Erreur', 'Impossible de charger le club')
      }
    } catch (error) {
      console.error('Load club error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function checkFavorite() {
    try {
      const result = await getFavorites()
      if (result.success) {
        const isFav = result.data?.some((c) => c.id === clubId)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.error('Check favorite error:', error)
    }
  }

  async function toggleFavorite() {
    if (!isAuthenticated) {
      Alert.alert('Non connecté', 'Veuillez vous connecter pour ajouter aux favoris')
      return
    }

    try {
      setAddingFavorite(true)
      let result

      if (isFavorite) {
        result = await removeFavoriteClub(clubId)
      } else {
        result = await addFavoriteClub(clubId)
      }

      if (result.success) {
        setIsFavorite(!isFavorite)
        Alert.alert('Succès', result.message)
      } else {
        Alert.alert('Erreur', result.error)
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de gérer le favori')
    } finally {
      setAddingFavorite(false)
    }
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

  if (!club) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Club non trouvé</Text>
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
        <Text style={styles.title}>{club.name}</Text>
        <View style={{ width: 80 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Club Info */}
        <View style={styles.infoCard}>
          <Text style={styles.clubName}>{club.name}</Text>

          {club.city && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Ville:</Text>
              <Text style={styles.infoValue}>{club.city}</Text>
            </View>
          )}

          {club.country && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🌍 Pays:</Text>
              <Text style={styles.infoValue}>{club.country}</Text>
            </View>
          )}

          {club.stadium && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🏟️ Stade:</Text>
              <Text style={styles.infoValue}>{club.stadium}</Text>
            </View>
          )}

          {club.foundedYear && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Fondé:</Text>
              <Text style={styles.infoValue}>{club.foundedYear}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {club.description && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{club.description}</Text>
          </View>
        )}

        {/* Favorite Button */}
        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            onPress={toggleFavorite}
            disabled={addingFavorite}
          >
            {addingFavorite ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.favoriteButtonText}>
                {isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
              </Text>
            )}
          </TouchableOpacity>
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
  clubName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 16,
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
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  favoriteButton: {
    backgroundColor: '#34a853',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  favoriteButtonActive: {
    backgroundColor: '#ea4335',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
