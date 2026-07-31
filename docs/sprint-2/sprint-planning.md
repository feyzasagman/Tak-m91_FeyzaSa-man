# Sprint 2 Planning — InternAI

## Sprint bilgisi

| Alan | Değer |
|------|-------|
| Sprint | 2 |
| Hedef | CV ve başvuru metni süreçleri |
| Takım | Tek kişi — Feyza Sağman (PO + SM + Developer) |

## Sprint hedefi

Kullanıcının PDF CV yükleyip metin çıkarmasını, CV bağlamını saklamasını, Gemini ile CV–ilan uyum analizi almasını ve AI Başvuru Asistanı ile ilana özel metinler üretmesini sağlamak.

## Seçilen backlog maddeleri

- PB-04 CV PDF + metin çıkarma
- PB-05 CV–ilan uyum analizi
- PB-06 AI Başvuru Asistanı

## Kapsam

- PDF yükleme, tür/boyut kontrolü
- `/api/resume/extract`
- Metin düzenleme ve CV context (localStorage)
- `/api/resume/analyze` + structured JSON
- AI asistan modları: ön yazı, e-posta, CV iyileştirme, mülakat, motivasyon
- Rate limit, server-only API key, geliştirme ortamı yedek çıktısı

## Sprint dışında bırakılanlar

- Kanban başvuru panosu (Sprint 3)
- Kariyer koçu (Sprint 3)
- Final UI polish (Sprint 3)

## Tanım of Done (Sprint 2)

- [x] PDF’den metin çıkarılabiliyor
- [x] Analiz sonucu UI’da gösteriliyor
- [x] Asistan metin üretip kaydedebiliyor
- [x] Anahtar istemcide yok
- [x] Kullanıcıya Türkçe hata mesajları gösteriliyor
