
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { login as apiLogin } from '../../../api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);

    try {
      const res = await apiLogin(email, password);
      login(res.token);
      // Decode JWT payload to get roles
      try {
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const roles = payload.roles ?? [];
        router.replace(roles.includes('ROLE_ADMIN') ? '/admin' : '/account');
      } catch {
        router.replace('/account');
      }
    } catch (err) {
      setError(err.message ?? 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.form}>
        <View style={styles.field}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus
          />
        </View>

        <View style={styles.field}>
          <Text>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <Button
          title={loading ? 'Connexion...' : 'Se connecter'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>

      <Pressable onPress={() => router.push('/register')}>
        <Text style={styles.link}>Pas encore de compte ? Inscription</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  form: {
    width: '100%',
  },
  field: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  link: {
    marginTop: 20,
    color: 'blue',
  },
});
