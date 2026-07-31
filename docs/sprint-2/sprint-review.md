# Sprint 2 Review — InternAI

**Sprint hedefi:** CV ve başvuru metni süreçleri → **Karşılandı**  
**Takım:** Feyza Sağman (tek kişi)

## Planlanan işler

| ID | İş | SP |
|----|----|----|
| S2-01 | PDF upload UI | 3 |
| S2-02 | Extract API | 5 |
| S2-03 | Context kaydı | 3 |
| S2-04 | Beceri/bölüm tespiti | 2 |
| S2-05 | Analyze API + schema | 5 |
| S2-06 | Analiz UI + geçmiş | 3 |
| S2-07 | Generate-application API | 5 |
| S2-08 | Asistan UI | 5 |
| S2-09 | Rate limit / güvenlik | 2 |

## Tamamlanan işler

- PDF’den metin çıkarma
- CV context
- Gemini CV–ilan analizi + geçmiş
- AI Başvuru Asistanı (5 mod)
- Server-only API key, rate limit

**Kanıt (commit, yaklaşık):** `e4ff48e`, `87a8565` — *tarih doğrulanmalı*

## Yetişmeyen işler

Sprint 2 backlog maddelerinde **açık kalan S2 işi yok**.

## Sonraki sprinte aktarılanlar

| Product Backlog | Aktarıldığı sprint | Not |
|-----------------|--------------------|-----|
| PB-07 Başvuru panosu | Sprint 3 | Planlı |
| PB-08 Dashboard + koç | Sprint 3 | Planlı |
| PB-09 Final polish/docs | Sprint 3 | Planlı |

## Çalışan özellikler / stable durum

- `/resume-analysis`
- `/ai-assistant`
- İlgili API route’ları

## Ekran görüntüleri

[screenshots/README.md](./screenshots/README.md) — gerçek PNG’ler manuel.

## Teknik kararlar

- Structured JSON + sunucu doğrulama
- CV loglanmaz / sunucuda kalıcı saklanmaz

## Test / build

- Validasyon ve rate limit senaryoları manuel denendi
- O dönem build log’u burada yok → *Sprint 3’te `npm run build` başarılı olarak kaydedildi*

## Görev dağılımı

Tüm işler Feyza Sağman tarafından yapıldı.
