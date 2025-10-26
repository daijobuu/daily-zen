import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { getDayOfYear, getQuoteForDay, QuoteWithId } from '../constants/quotes';
import zenColors from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavoritesStore } from '../stores/favoritesStore';
import SwipeLeft from '../components/SwipeLeft';
import HeartToggle from '../components/HeartToggle';
import PaywallModal from '../components/PaywallModal';
import { useUIStore } from '../stores/uiStore';
import { useActions } from '../stores/actionsStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Home() {
  const [currentQuote] = useState<QuoteWithId>(getTodayQuote());

  const showPaywall = useUIStore((s) => s.showPaywall);
  const closePaywall = useUIStore((s) => s.closePaywall);

  const toggleFavorite = useActions((s) => s.toggleFavorite);
  const isFav = useFavoritesStore((s) => s.has(currentQuote.id));

  useEffect(() => {
    const schedule = async () => {
      if (!Device.isDevice) return;

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const request = await Notifications.requestPermissionsAsync();
        if (request.status !== 'granted') return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'dailyzen 🪷',
          body: `“${currentQuote.text}” – ${currentQuote.author}`,
        },
        trigger: {
          hour: 9,
          minute: 0,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
      });
    };

    schedule();
  }, []);

  return (
    <LinearGradient
      colors={[zenColors.lavender, zenColors.peach, zenColors.cream]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>dailyzen</Text>
          <Text style={styles.quoteText}>{currentQuote.text}</Text>
          <Text style={styles.authorText}>— {currentQuote.author}</Text>

          <HeartToggle
            isFavorite={isFav}
            onToggle={() => {
              toggleFavorite(currentQuote.id);
            }}
            size={22}
            style={{ marginTop: 16, opacity: 0.9 }}
          />
        </View>
        <SwipeLeft />
        <Text style={styles.footer}>Take a moment to breathe</Text>
        <PaywallModal visible={!!showPaywall} onClose={closePaywall} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: zenColors.textDark,
    marginBottom: 28,
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    maxWidth: 500,
    shadowColor: zenColors.deepPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  quoteText: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
    color: zenColors.textDark,
    marginBottom: 12,
  },
  authorText: {
    fontSize: 16,
    color: zenColors.textLight,
    textAlign: 'center',
  },
  footer: {
    fontSize: 14,
    color: zenColors.textLight,
    marginBottom: 30,
    letterSpacing: 0.5,
  },
});

const getTodayQuote = () => {
  const dayOfYear = getDayOfYear();
  return getQuoteForDay(dayOfYear);
};
