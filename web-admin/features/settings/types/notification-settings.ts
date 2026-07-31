export type NotificationSettings = {
  newInternships: boolean;
  applicationReminders: boolean;
  aiCareerSuggestions: boolean;
};

export type NotificationSettingKey = keyof NotificationSettings;

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  newInternships: true,
  applicationReminders: false,
  aiCareerSuggestions: true,
};

export const NOTIFICATION_SETTING_FIELDS: {
  key: NotificationSettingKey;
  label: string;
  description: string;
}[] = [
  {
    key: "newInternships",
    label: "Yeni staj ilanları",
    description: "Tercihlerine uygun ilanlardan haberdar ol.",
  },
  {
    key: "applicationReminders",
    label: "Başvuru hatırlatmaları",
    description: "Bekleyen adımlar için bildirim al.",
  },
  {
    key: "aiCareerSuggestions",
    label: "AI kariyer önerileri",
    description: "Kişiselleştirilmiş gelişim önerilerini gör.",
  },
];
