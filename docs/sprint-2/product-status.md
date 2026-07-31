# Sprint 2 — Product Status

## Sprint hedefi

CV ve başvuru metni süreçleri: PDF extract, Gemini CV analizi ve AI Başvuru Asistanı.

## Sprint sonunda çalışan özellikler

- PDF yükleme (tür / boyut kontrolü)
- PDF’den metin çıkarma (extract API)
- CV metnini düzenleme ve tarayıcıda context saklama
- Gemini ile CV–ilan uyum analizi (yapılandırılmış çıktı)
- Analiz geçmişi (localStorage)
- AI Başvuru Asistanı (ön yazı, e-posta, CV önerisi, mülakat, kısa motivasyon)
- İlan / CV bağlamından form doldurma
- Server-only `GEMINI_API_KEY`, rate limit

## Tamamlanan ekranlar

| Rota | Açıklama |
|------|----------|
| `/resume-analysis` | CV yükleme, extract, analiz raporu, geçmiş |
| `/ai-assistant` | Asistan formları ve üretim paneli |

Sprint 1 ekranları (auth, ilanlar, dashboard iskeleti) çalışmaya devam eder.

## Test edilen akışlar

- PDF seçme → metin çıkarma → düzenleme → context kaydı
- CV + ilan ile analiz isteği ve rapor gösterimi
- Asistan modlarında metin üretimi, kopyalama / kaydetme
- Rate limit ve yapılandırma hatası mesajlarının kullanıcıya gösterilmesi

## Ürünün stabil durumu

Sprint 2 sonunda ürün **keşif + CV + AI metin** döngüsünde stabildir. Gemini anahtarı tanımlı ortamda asistan ve analiz kullanılabilir. Başvuru Kanban’ı ve kariyer koçu henüz yoktur.

## Bilinen eksikler

- Başvuru takip panosu (Kanban / liste) yok
- Dashboard’da gerçek veri birleşimi ve kariyer koçu yok
- Final UI/UX polish tamamlanmadı
- GitHub / LinkedIn analizi yok (yapılmadı)
- Firma paneli yok (yapılmadı)
- Gerçek ekran görüntüleri klasöre eklenmedi

## Sonraki sprintte geliştirilecekler

- Başvurularım (liste + Kanban + timeline)
- Dashboard veri birleşimi + AI Kariyer Koçu
- Global UX / güvenlik polish ve süreç dokümantasyonu

## Eklenecek ekran görüntüleri

Gerçek PNG dosyaları henüz yoktur; aşağıdaki dosyalar `screenshots/` klasörüne manuel eklenmelidir.

| Dosya | İçerik |
|-------|--------|
| `01-cv-upload.png` | PDF seçme / yükleme alanı |
| `02-cv-analysis.png` | AI CV analiz sonucu (skorlar görünür) |
| `03-ai-assistant.png` | AI Başvuru Asistanı (üretim sonucu ile) |

Ayrıntı: [screenshots/README.md](./screenshots/README.md)
