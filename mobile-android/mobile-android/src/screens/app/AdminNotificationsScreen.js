import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { adminSendNotification } from '../../services/api';

export default function AdminNotificationsScreen() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function handleSend() {
    setError('');
    setResult('');
    setLoading(true);

    try {
      const res = await adminSendNotification({ title, message, recipients });
      setResult(`Envoye: ${res.sent ?? 0} | Echec: ${res.failed ?? 0}`);
      setTitle('');
      setMessage('');
    } catch (e) {
      setError(e.message || 'Envoi impossible');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin notifications</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titre" />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        placeholder="Message"
        multiline
      />

      <View style={styles.row}>
        <Pressable style={[styles.chip, recipients === 'all' && styles.chipActive]} onPress={() => setRecipients('all')}>
          <Text style={[styles.chipText, recipients === 'all' && styles.chipTextActive]}>Tous</Text>
        </Pressable>
        <Pressable style={[styles.chip, recipients === 'admins' && styles.chipActive]} onPress={() => setRecipients('admins')}>
          <Text style={[styles.chipText, recipients === 'admins' && styles.chipTextActive]}>Admins</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result ? <Text style={styles.ok}>{result}</Text> : null}

      <Pressable style={styles.button} onPress={handleSend} disabled={loading || !title || !message}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Envoyer notification</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dbe7db', padding: 10, marginBottom: 10 },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: '#e5efe5', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16 },
  chipActive: { backgroundColor: '#1f6e3a' },
  chipText: { color: '#1f3b2a', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  button: { backgroundColor: '#1f6e3a', borderRadius: 10, padding: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c', marginBottom: 8 },
  ok: { color: '#14532d', marginBottom: 8 },
});
