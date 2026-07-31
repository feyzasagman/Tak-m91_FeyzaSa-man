import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  type NotificationSettingKey,
  type NotificationSettings,
} from "../types/notification-settings";

export function notificationSettingsRef(uid: string) {
  return doc(db, "users", uid, "settings", "notifications");
}

function normalizeSettings(data: Partial<NotificationSettings> | undefined): NotificationSettings {
  return {
    newInternships:
      typeof data?.newInternships === "boolean"
        ? data.newInternships
        : DEFAULT_NOTIFICATION_SETTINGS.newInternships,
    applicationReminders:
      typeof data?.applicationReminders === "boolean"
        ? data.applicationReminders
        : DEFAULT_NOTIFICATION_SETTINGS.applicationReminders,
    aiCareerSuggestions:
      typeof data?.aiCareerSuggestions === "boolean"
        ? data.aiCareerSuggestions
        : DEFAULT_NOTIFICATION_SETTINGS.aiCareerSuggestions,
  };
}

/** Sayfa açılışında oku; yoksa varsayılanları oluştur. */
export async function fetchNotificationSettings(
  uid: string
): Promise<NotificationSettings> {
  const ref = notificationSettingsRef(uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const defaults = { ...DEFAULT_NOTIFICATION_SETTINGS };
    await setDoc(ref, defaults);
    return defaults;
  }

  return normalizeSettings(snap.data() as Partial<NotificationSettings>);
}

export async function updateNotificationSetting(
  uid: string,
  key: NotificationSettingKey,
  value: boolean
): Promise<void> {
  await updateDoc(notificationSettingsRef(uid), { [key]: value });
}
