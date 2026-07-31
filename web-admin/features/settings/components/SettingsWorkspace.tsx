"use client";

import { PageHeader } from "@/app/components/layout/PageHeader";
import { Input } from "@/app/components/ui/input";
import { SectionCard } from "@/app/components/ui/section-card";
import { useNotificationSettings } from "../hooks/useNotificationSettings";
import { NOTIFICATION_SETTING_FIELDS } from "../types/notification-settings";
import { NotificationSwitch } from "./NotificationSwitch";

export function SettingsWorkspace() {
  const { settings, loading, saving, error, setPreference } =
    useNotificationSettings();

  const switchesDisabled = loading || saving;

  return (
    <section className="space-y-7">
      <PageHeader
        eyebrow="Hesap tercihleri"
        title="Ayarlar"
        description="Hesap, bildirim ve platform görünümü tercihlerini yöneteceğin alan."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="Hesap ayarları"
          description="Profil kaydı bir sonraki sürümde etkinleştirilecek."
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Ad soyad</span>
              <Input placeholder="Ad soyad" disabled aria-disabled="true" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Hedef şehir</span>
              <Input placeholder="Şehir tercihi" disabled aria-disabled="true" />
            </label>
            <button type="button" disabled className="ui-button ui-button-brand">
              Kaydet (yakında)
            </button>
          </div>
        </SectionCard>

        <SectionCard
          title="Bildirim tercihleri"
          description="Tercihler hesabına kaydedilir. Push bildirim gönderimi MVP kapsamı dışındadır."
        >
          <div className="space-y-3">
            {NOTIFICATION_SETTING_FIELDS.map((field) => (
              <NotificationSwitch
                key={field.key}
                id={`notification-${field.key}`}
                label={field.label}
                description={field.description}
                checked={settings[field.key]}
                disabled={switchesDisabled}
                onChange={(next) => {
                  void setPreference(field.key, next);
                }}
              />
            ))}
            {loading && (
              <p className="text-xs text-text2" role="status">
                Tercihler yükleniyor...
              </p>
            )}
            {error && !loading && (
              <p className="text-xs text-red-300" role="alert">
                {error}
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Görünüm" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {["Sistem", "Koyu", "Açık"].map((theme, index) => (
              <div
                key={theme}
                className={`rounded-2xl border p-4 ${
                  index === 1
                    ? "border-brand bg-brand/10"
                    : "border-border bg-surface2"
                }`}
              >
                <p className="text-sm font-semibold">{theme}</p>
                <p className="mt-1 text-xs text-text2">Tema seçimi yakında</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
