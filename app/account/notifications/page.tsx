"use client";

import { useSettingsStore, type NotificationSettings } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

const NOTIFICATION_COPY: Record<
  keyof NotificationSettings,
  { title: string; description: string }
> = {
  orderUpdates: {
    title: "Order Updates",
    description: "Shipping confirmations, delivery estimates, and delays.",
  },
  restockAlerts: {
    title: "Restock Alerts",
    description: "Get notified when wishlist items are back in stock.",
  },
  priceDrops: {
    title: "Price Drops",
    description: "Alerts when wishlist items go on sale.",
  },
  newDrops: {
    title: "New Drops",
    description: "New arrivals and limited edition announcements.",
  },
  marketingEmails: {
    title: "Marketing Emails",
    description: "Occasional promotions, roundups, and newsletters.",
  },
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={enabled}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        enabled ? "bg-accent-purple" : "bg-white/15"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const notifications = useSettingsStore((s) => s.notifications);
  const toggleNotification = useSettingsStore((s) => s.toggleNotification);

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Notification Preferences
      </h2>

      <div className="glass divide-y divide-white/10 rounded-2xl">
        {(Object.keys(NOTIFICATION_COPY) as Array<keyof typeof NOTIFICATION_COPY>).map(
          (key) => (
            <div key={key} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-white">{NOTIFICATION_COPY[key].title}</p>
                <p className="mt-0.5 text-sm text-white/50">
                  {NOTIFICATION_COPY[key].description}
                </p>
              </div>
              <Toggle
                enabled={notifications[key]}
                onChange={() => toggleNotification(key)}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
