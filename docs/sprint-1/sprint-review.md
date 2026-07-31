# Sprint 1 Review — InternAI

**Sprint hedefi:** Altyapı ve temel ürün iskeleti → **Karşılandı**  
**Takım:** Feyza Sağman (tek kişi)

## Planlanan işler

| ID | İş | SP |
|----|----|----|
| S1-01 | Domain temizliği / marka | 3 |
| S1-02 | AppShell + navigasyon | 3 |
| S1-03 | Firebase Auth iyileştirme | 3 |
| S1-04 | Feature-based mimari | 2 |
| S1-05 | Dashboard iskeleti | 3 |
| S1-06 | Staj listesi + filtre + arama | 5 |
| S1-07 | İlan detay | 3 |
| S1-08 | İlan kaydetme | 2 |
| S1-09 | Profil/ayarlar iskeleti | 2 |

## Tamamlanan işler

- Auth korumalı platform
- InternAI markası ve shell
- Dashboard iskeleti
- Staj ilanları (liste, filtre, detay, kaydet)
- Profil / ayarlar kabuğu

**Kanıt (kod):** `web-admin/app/components/layout/*`, `features/internships`, `features/dashboard`  
**Kanıt (commit, yaklaşık):** `9200534`, `ab49cbc` — *tarih doğrulanmalı*

## Yetişmeyen işler

Bu sprint backlog’unda **yetişmeyen S1 maddesi yok**.  
AI ve başvuru panosu planlanmamıştı (bilinçli kapsam dışı).

## Sonraki sprinte aktarılanlar

| Product Backlog | Aktarıldığı sprint | Not |
|-----------------|--------------------|-----|
| PB-04 CV extract | Sprint 2 | Planlı aktarım |
| PB-05 CV analiz | Sprint 2 | Planlı aktarım |
| PB-06 AI asistan | Sprint 2 | Planlı aktarım |

## Çalışan özellikler / stable durum

- `/login`, `/register`, `/dashboard`
- `/internships`, `/internships/[id]`

## Ekran görüntüleri

Liste: [screenshots/README.md](./screenshots/README.md) — gerçek dosyalar manuel eklenmeli.

## Teknik kararlar

- Next.js App Router + TypeScript
- Feature klasörleri
- localStorage ile kayıt

## Test / build

- Manuel route ve auth kontrolü yapıldı
- O dönemki production build sonucu bu belgede ayrı log olarak saklanmadı → *güncel build için Sprint 3 Review’a bakınız*

## Görev dağılımı

Tüm işler Feyza Sağman tarafından yapıldı.
