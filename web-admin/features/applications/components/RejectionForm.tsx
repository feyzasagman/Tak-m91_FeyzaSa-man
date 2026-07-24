"use client";

import { useState } from "react";
import type { RejectionDetails } from "../types";

const emptyRejection: RejectionDetails = { reason: "", reflection: "" };

export function RejectionForm({
  initial,
  onSave,
}: {
  initial: RejectionDetails | null;
  onSave: (details: RejectionDetails) => void;
}) {
  const [details, setDetails] = useState(initial ?? emptyRejection);
  return (
    <div className="grid gap-3">
      <label className="text-sm">Red nedeni<input value={details.reason} onChange={(e) => setDetails((current) => ({ ...current, reason: e.target.value }))} className="ui-input mt-2" /></label>
      <label className="text-sm">Değerlendirme notu<textarea value={details.reflection} onChange={(e) => setDetails((current) => ({ ...current, reflection: e.target.value }))} className="ui-input mt-2 min-h-20" /></label>
      <button type="button" onClick={() => onSave(details)} className="ui-button ui-button-brand">Red Değerlendirmesini Kaydet</button>
    </div>
  );
}
