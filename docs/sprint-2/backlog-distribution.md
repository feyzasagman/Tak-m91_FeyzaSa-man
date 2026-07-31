# Sprint 2 — Backlog Dağıtma Mantığı

## Amaç

İskelet üzerine **CV → analiz → başvuru metni** zincirini kurmak.

## Seçim kriterleri

| Kriter | Uygulama |
|--------|----------|
| Kullanıcı değeri | PDF’siz AI anlamsız → önce extract (PB-04), sonra analiz (PB-05) |
| Teknik risk | Gemini server-only + schema erken ele alındı |
| Bağımlılık | Asistan (PB-06), CV context’ten beslenir → aynı sprintte |
| Kapasite | ~33 SP; Kanban Sprint 3’e bırakıldı |

## Sprint 2’ye alınanlar

| Product Backlog ID | Neden bu sprint? |
|--------------------|------------------|
| PB-04 | Analizin girdisi |
| PB-05 | Ürünün AI farklılaştırıcısı |
| PB-06 | Başvuru metni üretimi |

## Bilinçli olarak alınmayanlar

| ID | Sonraki sprint | Gerekçe |
|----|----------------|---------|
| PB-07 | Sprint 3 | Panoya yazmadan önce metin üretimi stabil olmalı |
| PB-08, PB-09 | Sprint 3 | Veri birikimi sonrası dashboard/koç |

## Dağıtım özeti

```
PB-04 → extract/context
PB-05 → analyze API + rapor
PB-06 → generate-application + asistan UI
```
