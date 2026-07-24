"use client";

import { useRef, useState } from "react";

export function ResumeUpload({
  onSelect,
  error,
}: {
  onSelect: (file: File | null) => void;
  error: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) setDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          onSelect(event.dataTransfer.files.item(0));
        }}
        aria-label="PDF formatındaki CV dosyanızı seçin veya sürükleyip bırakın"
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center outline-none transition sm:p-12 ${
          dragActive
            ? "border-brand bg-brand/15 shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_18%,transparent)]"
            : "border-border bg-surface2/60 hover:border-brand/60 hover:bg-surface2 focus:border-brand focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_18%,transparent)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="sr-only"
          onChange={(event) => {
            onSelect(event.target.files?.item(0) ?? null);
            event.target.value = "";
          }}
          aria-hidden
          tabIndex={-1}
        />
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand/15 text-3xl">
          📄
        </span>
        <h2 className="mt-5 text-xl font-semibold">CV’ni sürükle ve bırak</h2>
        <p className="mt-2 text-sm leading-6 text-text2">
          veya bilgisayarından güvenli biçimde seç
        </p>
        <span className="ui-button ui-button-brand mt-5">Dosya Seç</span>
        <p className="mt-4 text-xs text-text2">Yalnızca PDF, maksimum 5 MB</p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
