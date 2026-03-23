import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native'
import { registerUser } from '../services/api'

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister() {
    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Email et mot de passe requis')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères')
      return
    }

    try {
      setLoading(true)
      setError('')

      const result = await registerUser(email.trim(), password, firstName.trim(), lastName.trim())

      if (result.success) {
        setSuccess(true)
        Alert.alert(
          'Inscription réussie',
          'Veuillez vérifier votre email pour confirmer votre compte, puis connectez-vous.',
          [
            {
              text: 'Aller à la connexion',
              onPress: () => navigation?.navigate('Login'),
            },
          ]
        )
      } else {
        setError(result.error || 'Inscription échouée')
      }
    } catch (err) {
      setError('Erreur inscription')
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>⚽ Foot Local</Text>
          <Text style={styles.subtitle}>Créer un compte</Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Jean"
              placeholderTextColor="#999"
              editable={!loading}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder="Dupont"
              placeholderTextColor="#999"
              editable={!loading}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 caractères"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!loading}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe *</Text>
            <TextInput
              style={styles.input}
              placeholder="Répétez le mot de passe"
              placeholderTextColor="#999"
              secureTextEntry
              editable={!loading}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà inscrit ? </Text>
          <TouchableOpacity disabled={loading} onPress={() => navigation?.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 25,
  },
  registerButton: {
    backgroundColor: '#34a853',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#c62828',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '600',
  },
})
