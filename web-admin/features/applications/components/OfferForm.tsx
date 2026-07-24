"use client";

import { useState } from "react";
import type { OfferDetails } from "../types";

const emptyOffer: OfferDetails = {
  startDate: "",
  endDate: "",
  internshipType: "",
  note: "",
};

export function OfferForm({
  initial,
  onSave,
}: {
  initial: OfferDetails | null;
  onSave: (details: OfferDetails) => void;
}) {
  const [details, setDetails] = useState(initial ?? emptyOffer);
  const update = <K extends keyof OfferDetails>(key: K, value: OfferDetails[K]) =>
    setDetails((current) => ({ ...current, [key]: value }));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">Başlangıç tarihi<input type="date" value={details.startDate} onChange={(e) => update("startDate", e.target.value)} className="ui-input mt-2" /></label>
      <label className="text-sm">Bitiş tarihi<input type="date" value={details.endDate} onChange={(e) => update("endDate", e.target.value)} className="ui-input mt-2" /></label>
      <label className="text-sm sm:col-span-2">Staj türü<input value={details.internshipType} onChange={(e) => update("internshipType", e.target.value)} className="ui-input mt-2" /></label>
      <label className="text-sm sm:col-span-2">Teklif notu<textarea value={details.note} onChange={(e) => update("note", e.target.value)} className="ui-input mt-2 min-h-20" /></label>
      <button type="button" onClick={() => onSave(details)} className="ui-button ui-button-brand sm:col-span-2">Teklif Bilgilerini Kaydet</button>
    </div>
  );
}
