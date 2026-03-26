import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission() {
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function notifyFavoriteAdded(clubName) {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Favori ajoute',
      body: `${clubName} est maintenant dans tes favoris.`,
    },
    trigger: null,
  });
}

export async function notifyNow(title, body) {
  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });

  return true;
}

const NOTIFIED_MATCHES_KEY = 'footlocal.notified.matches';

function toDate(matchDate) {
  if (!matchDate) return null;
  const isoLike = String(matchDate).replace(' ', 'T');
  const d = new Date(isoLike);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function notifyUpcomingFavoriteMatches(favorites, scheduledMatches) {
  const granted = await ensureNotificationPermission();
  if (!granted) return;

  const raw = (await AsyncStorage.getItem(NOTIFIED_MATCHES_KEY)) || '[]';
  const alreadyNotified = new Set(JSON.parse(raw));
  const next24h = Date.now() + 24 * 60 * 60 * 1000;
  const favoriteIds = new Set((favorites || []).map((c) => c.id));
  const newlyNotified = [];

  for (const match of scheduledMatches || []) {
    const matchId = match?.id;
    if (!matchId || alreadyNotified.has(matchId)) continue;

    const homeId = match?.homeTeam?.id;
    const awayId = match?.awayTeam?.id;
    if (!favoriteIds.has(homeId) && !favoriteIds.has(awayId)) continue;

    const d = toDate(match?.matchDate);
    if (!d) continue;
    const ts = d.getTime();
    if (ts < Date.now() || ts > next24h) continue;

    const home = match?.homeTeam?.name || 'Equipe domicile';
    const away = match?.awayTeam?.name || 'Equipe exterieure';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Match favori bientot',
        body: `${home} vs ${away} commence dans moins de 24h.`,
      },
      trigger: null,
    });

    alreadyNotified.add(matchId);
    newlyNotified.push(matchId);
  }

  if (newlyNotified.length > 0) {
    await AsyncStorage.setItem(NOTIFIED_MATCHES_KEY, JSON.stringify(Array.from(alreadyNotified)));
  }
}
