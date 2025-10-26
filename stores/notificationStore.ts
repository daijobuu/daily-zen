import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDayOfYear, getQuoteForDay } from '../constants/quotes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotificationStore = create(
  combine(
    {
      permissionStatus: 'undetermined' as string,
      isScheduled: false,
    },
    (set) => ({
      checkPermissions: async () => {
        if (Platform.OS === 'web') {
          set({ permissionStatus: 'unsupported' });
          return;
        }
        const { status } = await Notifications.getPermissionsAsync();
        set({ permissionStatus: status });
      },

      checkIfScheduled: async () => {
        if (Platform.OS === 'web') {
          set({ isScheduled: false });
          return;
        }
        const scheduled =
          await Notifications.getAllScheduledNotificationsAsync();
        set({ isScheduled: scheduled.length > 0 });
      },

      requestPermissions: async (): Promise<boolean> => {
        if (Platform.OS === 'web') {
          console.log('Notifications are not supported on web');
          return false;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        set({ permissionStatus: finalStatus });
        return finalStatus === 'granted';
      },

      scheduleDailyNotifications: async () => {
        if (Platform.OS === 'web') {
          console.log('Notifications are not supported on web');
          return;
        }

        await Notifications.cancelAllScheduledNotificationsAsync();

        const now = new Date();
        const scheduledDate = new Date();
        scheduledDate.setHours(9, 0, 0, 0);

        if (scheduledDate <= now) {
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'dailyzen',
            body: 'Your daily inspiration awaits',
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 9,
            minute: 0,
          },
        });

        set({ isScheduled: true });
        console.log('Daily notifications scheduled for 9:00 AM');
      },

      cancelNotifications: async () => {
        if (Platform.OS === 'web') {
          return;
        }

        await Notifications.cancelAllScheduledNotificationsAsync();
        set({ isScheduled: false });
        console.log('All notifications cancelled');
      },

      getTodayQuote: () => {
        const dayOfYear = getDayOfYear();
        return getQuoteForDay(dayOfYear);
      },
    }),
  ),
);
