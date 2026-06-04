import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { deleteMyAccount } from '../../services/api';

const DELETE_REASON_OPTIONS = [
  "Je n'utilise plus l'application",
  'Les fonctionnalites ne me conviennent pas',
  'Je veux proteger mes donnees personnelles',
  'Je recois trop de notifications',
  "J'ai rencontre un probleme technique",
  'Compte cree par erreur',
];

export default function AccountScreen() {
  const { profile, logout, isAdmin } = useAuth();
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);
  const [selectedDeleteReasons, setSelectedDeleteReasons] = useState([]);
  const [deleteDetails, setDeleteDetails] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function toggleDeleteReason(reason) {
    setSelectedDeleteReasons((currentReasons) => (
      currentReasons.includes(reason)
        ? currentReasons.filter((currentReason) => currentReason !== reason)
        : [...currentReasons, reason]
    ));
  }

  function buildDeletionReason() {
    const details = deleteDetails.trim();
    const reasons = [...selectedDeleteReasons];

    if (details) {
      reasons.push(`Precision: ${details}`);
    }

    return reasons.join(' | ');
  }

  function handleDeletePress() {
    setDeleteError('');

    if (!deleteFormOpen) {
      setDeleteFormOpen(true);
      return;
    }

    const deletionReason = buildDeletionReason();

    if (!deletionReason) {
      setDeleteError('Selectionne au moins une raison ou ajoute une precision.');
      return;
    }

    if (deletionReason.length > 500) {
      setDeleteError('La raison ne peut pas depasser 500 caracteres.');
      return;
    }

    Alert.alert(
      'Supprimer mon compte',
      'Cette action est definitive. Ton compte sera supprime et un email de confirmation sera envoye.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => { void confirmDeleteAccount(); } },
      ]
    );
  }

  async function confirmDeleteAccount() {
    setDeleteLoading(true);
    setDeleteError('');

    try {
      const response = await deleteMyAccount(buildDeletionReason());
      const fallbackMessage = 'Compte supprime. Un email de confirmation a ete envoye.';

      Alert.alert(
        'Compte supprime',
        response?.message || fallbackMessage,
        [{ text: 'OK', onPress: () => { void logout(); } }],
        { cancelable: false }
      );
    } catch (error) {
      setDeleteError(error.message || 'Suppression du compte impossible.');
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mon compte</Text>
      <View style={styles.card}>
        <Text style={styles.row}>Email: {profile?.email || '-'}</Text>
        <Text style={styles.row}>Nom: {(profile?.firstName || '') + ' ' + (profile?.lastName || '')}</Text>
        <Text style={styles.row}>Roles: {(profile?.roles || []).join(', ') || '-'}</Text>
      </View>

      {isAdmin ? (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>Compte admin detecte: tu peux brancher ici les actions notification.</Text>
        </View>
      ) : null}

      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </Pressable>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Suppression du compte</Text>

        {deleteFormOpen ? (
          <>
            <Text style={styles.formLabel}>Choisis une ou plusieurs raisons</Text>
            <View style={styles.reasonOptions}>
              {DELETE_REASON_OPTIONS.map((reason) => {
                const selected = selectedDeleteReasons.includes(reason);

                return (
                  <Pressable
                    key={reason}
                    style={[styles.reasonOption, selected ? styles.reasonOptionSelected : null]}
                    onPress={() => toggleDeleteReason(reason)}
                    disabled={deleteLoading}
                  >
                    <View style={[styles.reasonOptionBox, selected ? styles.reasonOptionBoxSelected : null]} />
                    <Text style={[styles.reasonOptionText, selected ? styles.reasonOptionTextSelected : null]}>
                      {reason}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              value={deleteDetails}
              onChangeText={setDeleteDetails}
              placeholder="Precisions optionnelles"
              multiline
              maxLength={300}
              style={styles.reasonInput}
            />
            <Text style={styles.helpText}>Un email sera envoye a {profile?.email || 'ton adresse email'} apres suppression.</Text>
          </>
        ) : null}

        {deleteError ? <Text style={styles.errorText}>{deleteError}</Text> : null}

        <Pressable style={styles.deleteBtn} onPress={handleDeletePress} disabled={deleteLoading}>
          {deleteLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteText}>Supprimer mon compte</Text>
          )}
        </Pressable>

        {deleteFormOpen ? (
          <Pressable
            style={styles.cancelDeleteBtn}
            onPress={() => {
              setDeleteFormOpen(false);
              setSelectedDeleteReasons([]);
              setDeleteDetails('');
              setDeleteError('');
            }}
            disabled={deleteLoading}
          >
            <Text style={styles.cancelDeleteText}>Annuler</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f7faf7' },
  title: { fontSize: 24, fontWeight: '700', color: '#134b2a', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#dbe7db', padding: 14 },
  row: { color: '#143524', marginBottom: 8 },
  notice: { marginTop: 14, backgroundColor: '#fff4cc', borderRadius: 10, padding: 12 },
  noticeText: { color: '#6b4f00' },
  logoutBtn: { marginTop: 20, backgroundColor: '#1f6e3a', borderRadius: 10, padding: 12, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '700' },
  dangerZone: { marginTop: 24, borderTopWidth: 1, borderTopColor: '#e6cdcd', paddingTop: 16 },
  dangerTitle: { color: '#7f1d1d', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  formLabel: { color: '#301313', fontWeight: '700', marginBottom: 8 },
  reasonOptions: { gap: 8, marginBottom: 12 },
  reasonOption: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#d6b7b7',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  reasonOptionSelected: { borderColor: '#b91c1c', backgroundColor: '#fff1f1' },
  reasonOptionBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b98b8b',
    marginRight: 10,
  },
  reasonOptionBoxSelected: { backgroundColor: '#b91c1c', borderColor: '#b91c1c' },
  reasonOptionText: { color: '#301313', flex: 1 },
  reasonOptionTextSelected: { color: '#7f1d1d', fontWeight: '700' },
  reasonInput: {
    minHeight: 96,
    backgroundColor: '#fff',
    borderColor: '#d6b7b7',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    color: '#301313',
    textAlignVertical: 'top',
  },
  helpText: { color: '#6b3f3f', fontSize: 12, marginTop: 8, marginBottom: 8 },
  errorText: { color: '#b21b1b', marginBottom: 10 },
  deleteBtn: { backgroundColor: '#b91c1c', borderRadius: 10, padding: 12, alignItems: 'center' },
  deleteText: { color: '#fff', fontWeight: '700' },
  cancelDeleteBtn: { marginTop: 10, padding: 10, alignItems: 'center' },
  cancelDeleteText: { color: '#7f1d1d', fontWeight: '700' },
});
