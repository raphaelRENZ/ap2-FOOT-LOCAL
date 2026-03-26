import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
      <Text style={styles.title}>Inscription</Text>

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f8f4' },
  title: { fontSize: 28, fontWeight: '700', color: '#134b2a', marginBottom: 14 },
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
  success: { color: '#14532d', marginBottom: 10 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  linkText: { color: '#1f6e3a', fontWeight: '600' },
});
