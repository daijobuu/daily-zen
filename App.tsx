import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import quotes from './assets/quotes.json';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / 86400000);
  };

  const dayIndex = getDayOfYear() % quotes.length;
  const quote = quotes[dayIndex];

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
          title: 'Daily Zen 🪷',
          body: `“${quote.text}” – ${quote.author}`,
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf6e3" />
      <Text style={styles.title}>Daily Zen 🪷</Text>
      <Text style={styles.quote}>“{quote.text}”</Text>
      <Text style={styles.author}>– {quote.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6e3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 40,
  },
  quote: {
    fontSize: 22,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 24,
  },
  author: {
    fontSize: 18,
    color: '#444',
  },
});
