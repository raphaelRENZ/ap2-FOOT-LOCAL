
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { register as apiRegister } from '../../../api';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);

    try {
      await apiRegister({ email, password, firstName, lastName });
      router.push('/login');
    } catch (err) {
      setError(err.message ?? "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.form}>
        <View style={styles.field}>
          <Text>Prénom</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.field}>
          <Text>Nom</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.field}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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
          title={loading ? 'Création...' : 'Créer le compte'}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>

      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Déjà un compte ? Connexion</Text>
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
