import React, { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../services/api';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      if (!res.token) throw new Error('Token manquant dans la reponse login.');
      await login(res.token);
    } catch (e) {
      setError(e.message || 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../../img/logo_foot_local-removebg-preview.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Heureux de vous revoir sur Foot Local</Text>

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
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Se connecter</Text>}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkWrap}>
          <Text style={styles.linkText}>Pas de compte ? S'inscrire</Text>
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
    width: 130,
    height: 90,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '700', color: '#134b2a', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#3d5a46', marginBottom: 20, textAlign: 'center' },
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
  linkWrap: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#1f6e3a', fontWeight: '600' },
});
