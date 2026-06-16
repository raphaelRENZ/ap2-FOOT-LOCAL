import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { register } from '../../services/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleRegister() {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register({ email, password, firstName, lastName });
      setSuccess('Compte cree. Connecte-toi maintenant.');
      setTimeout(() => navigation.navigate('Login'), 900);
    } catch (e) {
      setError(e.message || 'Inscription impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../../img/logo_foot_local-removebg-preview.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Créez votre compte Foot Local</Text>

        <TextInput value={firstName} onChangeText={setFirstName} placeholder="Prenom" style={styles.input} />
        <TextInput value={lastName} onChangeText={setLastName} placeholder="Nom" style={styles.input} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe (6+ caracteres)"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Creer mon compte</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.linkWrap}>
          <Text style={styles.linkText}>J'ai deja un compte</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f7f2',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 84,
    alignSelf: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#134b2a', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#3d5a46', marginBottom: 16, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderColor: '#c8d8ca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1b7a43',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b21b1b', marginBottom: 10 },
  success: { color: '#14532d', marginBottom: 10 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#1f6e3a', fontWeight: '600' },
});
