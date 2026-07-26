"use client";

import { useState } from "react";
import { ButtonLoading } from "@/app/components/ui/ButtonLoading";
import { Input } from "@/app/components/ui/input";
import type {
  ApplicationAssistantInput,
  AssistantFormErrors,
  AssistantMode,
} from "../types";
import { ToneSelector } from "./ToneSelector";

const textareaClass =
  "min-h-24 w-full resize-y rounded-[14px] border border-border bg-surface2 p-3 text-sm text-text outline-none placeholder:text-text2 focus:border-brand focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]";

export function ApplicationAssistantForm({
  mode,
  input,
  errors,
  loading,
  onChange,
  onSubmit,
}: {
  mode: AssistantMode;
  input: ApplicationAssistantInput;
  errors: AssistantFormErrors;
  loading: boolean;
  onChange: (input: ApplicationAssistantInput) => void;
  onSubmit: () => void;
}) {
  const [extrasOpen, setExtrasOpen] = useState(false);
  const update = <K extends keyof ApplicationAssistantInput>(
    key: K,
    value: ApplicationAssistantInput[K]
  ) => onChange({ ...input, [key]: value });
  const error = (key: keyof ApplicationAssistantInput) =>
    errors[key] ? <p className="mt-1 text-xs text-danger">{errors[key]}</p> : null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <fieldset className="space-y-4 rounded-2xl border border-border bg-surface2/30 p-4">
        <legend className="px-1 text-sm font-semibold">İlan bilgileri</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Şirket adı</span>
            <Input
              value={input.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder="Şirket"
            />
            {error("company")}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Pozisyon adı</span>
            <Input
              value={input.position}
              onChange={(e) => update("position", e.target.value)}
              placeholder="Pozisyon"
            />
            {error("position")}
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Şehir</span>
            <Input
              value={input.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Şehir"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Çalışma modeli</span>
            <Input
              value={input.workModel}
              onChange={(e) => update("workModel", e.target.value)}
              placeholder="Hibrit, uzaktan veya ofisten"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium">İlan açıklaması</span>
          <textarea
            value={input.jobDescription}
            onChange={(e) => update("jobDescription", e.target.value)}
            className={textareaClass}
          />
          {error("jobDescription")}
        </label>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-border bg-surface2/30 p-4">
        <legend className="px-1 text-sm font-semibold">Aday bilgileri</legend>
        {(
          [
            ["userSummary", "Kısa özet", "Eğitim, ilgi alanları ve öne çıkan yönlerin"],
            ["technicalSkills", "Teknik beceriler", "Örn. React, Python, SQL"],
            ["experiences", "Deneyimler", "Staj, gönüllülük veya çalışma deneyimleri"],
            ["projects", "Projeler", "Öne çıkan teknik veya akademik projeler"],
            ["careerGoal", "Kariyer hedefi", "Kısa ve uzun vadeli hedeflerin"],
          ] as const
        ).map(([key, label, placeholder]) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm font-medium">{label}</span>
            <textarea
              value={String(input[key])}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className={textareaClass}
            />
            {error(key)}
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-border bg-surface2/30 p-4">
        <legend className="px-1 text-sm font-semibold">Metin tercihleri</legend>
        <ToneSelector value={input.tone} onChange={(tone) => update("tone", tone)} />

        {mode === "cover-letter" && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Neden bu şirket?</span>
              <textarea
                value={input.companyReason}
                onChange={(e) => update("companyReason", e.target.value)}
                className={textareaClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">
                Öne çıkarılacak beceriler
              </span>
              <Input
                value={input.highlightedSkills}
                onChange={(e) => update("highlightedSkills", e.target.value)}
              />
            </label>
          </div>
        )}

        {mode === "application-email" && (
          <div className="grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-medium">Alıcı adı</span>
              <Input
                value={input.recipientName}
                onChange={(e) => update("recipientName", e.target.value)}
              />
              {error("recipientName")}
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Konu satırı</span>
              <Input
                value={input.subjectLine}
                onChange={(e) => update("subjectLine", e.target.value)}
              />
            </label>
          </div>
        )}

        {mode === "resume" && (
          <div className="grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-medium">Mevcut CV özeti</span>
              <textarea
                value={input.currentResumeSummary}
                onChange={(e) => update("currentResumeSummary", e.target.value)}
                className={textareaClass}
              />
              {error("currentResumeSummary")}
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Hedef ilan</span>
              <textarea
                value={input.targetJob}
                onChange={(e) => update("targetJob", e.target.value)}
                className={textareaClass}
              />
              {error("targetJob")}
            </label>
          </div>
        )}

        {mode === "interview" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <label>
              <span className="mb-2 block text-sm font-medium">Teknik seviye</span>
              <select
                className="ui-input"
                value={input.technicalLevel}
                onChange={(e) => update("technicalLevel", e.target.value)}
              >
                <option>Başlangıç</option>
                <option>Orta</option>
                <option>İleri</option>
              </select>
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Soru sayısı</span>
              <Input
                type="number"
                min={1}
                max={12}
                value={input.questionCount}
                onChange={(e) => update("questionCount", Number(e.target.value))}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Soru tipi</span>
              <select
                className="ui-input"
                value={input.questionType}
                onChange={(e) => update("questionType", e.target.value)}
              >
                <option>Teknik</option>
                <option>Davranışsal</option>
                <option>Karma</option>
              </select>
            </label>
          </div>
        )}

        {mode === "motivation" && (
          <div className="grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-medium">Karakter limiti</span>
              <Input
                type="number"
                min={50}
                max={1000}
                value={input.characterLimit}
                onChange={(e) => update("characterLimit", Number(e.target.value))}
              />
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">
                Program veya şirket adı
              </span>
              <Input
                value={input.programName}
                onChange={(e) => update("programName", e.target.value)}
              />
              {error("programName")}
            </label>
            <label>
              <span className="mb-2 block text-sm font-medium">Katılma amacı</span>
              <textarea
                value={input.participationGoal}
                onChange={(e) => update("participationGoal", e.target.value)}
                className={textareaClass}
              />
              {error("participationGoal")}
            </label>
          </div>
        )}
      </fieldset>

      <div className="rounded-2xl border border-border bg-surface2/20">
        <button
          type="button"
          onClick={() => setExtrasOpen((current) => !current)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
          aria-expanded={extrasOpen}
        >
          Ek bilgiler
          <span aria-hidden>{extrasOpen ? "−" : "+"}</span>
        </button>
        {extrasOpen && (
          <div className="space-y-4 border-t border-border px-4 py-4">
            {mode === "cover-letter" && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Maksimum uzunluk
                </span>
                <Input
                  type="number"
                  min={200}
                  max={2000}
                  value={input.maxLength}
                  onChange={(e) => update("maxLength", Number(e.target.value))}
                />
              </label>
            )}
            {mode === "application-email" && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Ek dosya bilgisi
                </span>
                <Input
                  value={input.attachmentInfo}
                  onChange={(e) => update("attachmentInfo", e.target.value)}
                />
              </label>
            )}
            {mode === "resume" && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Öne çıkarılacak bölümler
                </span>
                <Input
                  value={input.highlightedSections}
                  onChange={(e) => update("highlightedSections", e.target.value)}
                />
              </label>
            )}
            {mode !== "cover-letter" &&
              mode !== "application-email" &&
              mode !== "resume" && (
                <p className="text-sm text-text2">
                  Bu mod için ek isteğe bağlı alan bulunmuyor.
                </p>
              )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="ui-button ui-button-brand min-h-12 w-full"
      >
        {loading ? (
          <ButtonLoading label="Metin Oluşturuluyor..." />
        ) : (
          "Metin Oluştur"
        )}
      </button>
    </form>
  );
}
