import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
      <Text style={styles.title}>Foot Local Mobile</Text>
      <Text style={styles.subtitle}>Connexion obligatoire</Text>

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f8f4' },
  title: { fontSize: 28, fontWeight: '700', color: '#134b2a', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#3d5a46', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderColor: '#c8d8ca',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1f6e3a',
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
