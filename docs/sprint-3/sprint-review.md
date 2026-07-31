# Sprint 3 Review — InternAI

**Sprint hedefi:** Ürün bütünlüğü ve finalizasyon → **Karşılandı**  
**Takım:** Feyza Sağman (tek kişi)

## Planlanan işler

| ID | İş | SP |
|----|----|----|
| S3-01 | Application store | 5 |
| S3-02 | Kanban + liste | 5 |
| S3-03 | Not / timeline / mülakat-kabul-red | 3 |
| S3-04 | Dashboard veri birleşimi | 3 |
| S3-05 | AI Kariyer Koçu | 5 |
| S3-06 | Toast / empty / loading / 404 / error | 3 |
| S3-07 | Auth guest + Escape drawer | 2 |
| S3-08 | Form bölümleri + CV timeline | 2 |
| S3-09 | Güvenlik + orphan temizlik | 2 |
| S3-10 | Bootcamp docs + README | 3 |

## Tamamlanan işler

- Başvurularım (liste + Kanban + timeline)
- Dashboard gerçek veri + kariyer koçu
- Global UX / güvenlik polish
- Sprint dokümantasyonu

**Kanıt (commit, yaklaşık):** `2f4d5cc`, `71dc58f` — *tarih doğrulanmalı*  
**Docs commit’i:** henüz yoksa *tarih doğrulanmalı*

## Yetişmeyen işler (bilinçli / ürün kapsamı)

| Madde | Durum | Açıklama |
|-------|-------|----------|
| Ayarlar “Kaydet” | Kısmi | UI var, kalıcı kayıt disabled — **tamamlanmış sayılmaz** |
| PB-11 GitHub/LinkedIn analizi | Deferred | Yapılmadı |
| PB-12 Firma paneli | Deferred | Yapılmadı |
| screenshots/*.png | Bekliyor | Klasörde yalnızca README listesi var |

## Sonraki sprinte / post-bootcamp aktarılanlar

| Madde | Hedef |
|-------|-------|
| PB-11, PB-12 | Post-bootcamp backlog |
| Gerçek ekran görüntüleri | `docs/sprint-*/screenshots/` |
| Ayarlar kalıcı kayıt | Sonraki iterasyon |

## Çalışan özellikler / stable durum

MVP döngüsü: keşif → CV → AI metin → takip → dashboard/koç.

## Ekran görüntüleri

[screenshots/README.md](./screenshots/README.md) — gerçek görseller manuel eklenmeli.

## Teknik kararlar

- Kariyer koçu kural tabanlı (ek model çağrısı yok)
- Ortak toast + `lib/routes.ts`

## Test / build

| Kontrol | Sonuç |
|---------|--------|
| TypeScript | Geçti (final polish döneminde) |
| ESLint | Geçti |
| `npm run build` | Geçti |

## Görev dağılımı

Tüm işler Feyza Sağman tarafından yapıldı (PO + SM + Developer).
