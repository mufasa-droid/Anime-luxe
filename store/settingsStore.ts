import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationSettings {
  orderUpdates: boolean;
  restockAlerts: boolean;
  priceDrops: boolean;
  newDrops: boolean;
  marketingEmails: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: {
        orderUpdates: true,
        restockAlerts: true,
        priceDrops: true,
        newDrops: false,
        marketingEmails: false,
      },
      toggleNotification: (key) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key],
          },
        })),
    }),
    { name: "anime-luxe-settings" }
  )
);
