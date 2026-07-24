"use client";

import { useState } from "react";
import type { InterviewDetails } from "../types";

const emptyInterview: InterviewDetails = {
  date: "",
  time: "",
  interviewType: "",
  attendanceType: "online",
  location: "",
  note: "",
};

export function InterviewForm({
  initial,
  onSave,
}: {
  initial: InterviewDetails | null;
  onSave: (details: InterviewDetails) => void;
}) {
  const [details, setDetails] = useState(initial ?? emptyInterview);
  const update = <K extends keyof InterviewDetails>(key: K, value: InterviewDetails[K]) =>
    setDetails((current) => ({ ...current, [key]: value }));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">Mülakat tarihi<input type="date" value={details.date} onChange={(e) => update("date", e.target.value)} className="ui-input mt-2" /></label>
      <label className="text-sm">Mülakat saati<input type="time" value={details.time} onChange={(e) => update("time", e.target.value)} className="ui-input mt-2" /></label>
      <label className="text-sm">Görüşme türü<input value={details.interviewType} onChange={(e) => update("interviewType", e.target.value)} placeholder="Teknik, İK veya vaka" className="ui-input mt-2" /></label>
      <label className="text-sm">Katılım şekli<select value={details.attendanceType} onChange={(e) => update("attendanceType", e.target.value as InterviewDetails["attendanceType"])} className="ui-input mt-2"><option value="online">Online</option><option value="in-person">Yüz yüze</option></select></label>
      <label className="text-sm sm:col-span-2">Toplantı bağlantısı veya adres<input value={details.location} onChange={(e) => update("location", e.target.value)} className="ui-input mt-2" /></label>
      <label className="text-sm sm:col-span-2">Ek not<textarea value={details.note} onChange={(e) => update("note", e.target.value)} className="ui-input mt-2 min-h-20" /></label>
      <button type="button" onClick={() => onSave(details)} className="ui-button ui-button-brand sm:col-span-2">Mülakat Bilgilerini Kaydet</button>
    </div>
  );
}
