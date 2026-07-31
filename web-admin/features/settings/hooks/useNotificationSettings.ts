"use client";

import { useCallback, useEffect, useState, startTransition } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useToast } from "@/app/providers/ToastProvider";
import {
  fetchNotificationSettings,
  updateNotificationSetting,
} from "../services/notification-settings";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  type NotificationSettingKey,
  type NotificationSettings,
} from "../types/notification-settings";

type UseNotificationSettingsResult = {
  settings: NotificationSettings;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setPreference: (key: NotificationSettingKey, value: boolean) => Promise<void>;
};

export function useNotificationSettings(): UseNotificationSettingsResult {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS
  );
  const [booting, setBooting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    if (!user) {
      startTransition(() => {
        if (cancelled) return;
        setSettings(DEFAULT_NOTIFICATION_SETTINGS);
        setError(null);
        setBooting(false);
      });
      return () => {
        cancelled = true;
      };
    }

    startTransition(() => {
      if (!cancelled) {
        setBooting(true);
        setError(null);
      }
    });

    fetchNotificationSettings(user.uid)
      .then((next) => {
        if (cancelled) return;
        startTransition(() => {
          setSettings(next);
          setBooting(false);
        });
      })
      .catch(() => {
        if (cancelled) return;
        startTransition(() => {
          setSettings(DEFAULT_NOTIFICATION_SETTINGS);
          setError("Bildirim tercihleri yüklenemedi.");
          setBooting(false);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const setPreference = useCallback(
    async (key: NotificationSettingKey, value: boolean) => {
      if (!user || booting || saving || authLoading) return;

      let rollback: NotificationSettings | undefined;
      setSettings((current) => {
        rollback = current;
        return { ...current, [key]: value };
      });
      setSaving(true);
      setError(null);

      try {
        await updateNotificationSetting(user.uid, key, value);
        showToast("Tercihler kaydedildi.");
      } catch {
        if (rollback) setSettings(rollback);
        setError("Tercihler kaydedilemedi.");
        showToast("Tercihler kaydedilemedi.", "error");
      } finally {
        setSaving(false);
      }
    },
    [authLoading, booting, saving, showToast, user]
  );

  return {
    settings,
    loading: authLoading || booting,
    saving,
    error,
    setPreference,
  };
}
