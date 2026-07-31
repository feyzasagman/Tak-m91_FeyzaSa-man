# Sprint 3 — Product Status

## Sprint hedefi

Ürün bütünlüğü ve finalizasyon: başvuru panosu, dashboard + kariyer koçu, UX/güvenlik polish ve Bootcamp dokümantasyonu.

## Sprint sonunda çalışan özellikler

- Başvurularım: liste ve Kanban
- Durum değiştirme, notlar, timeline
- Mülakat / kabul / red bilgileri
- Dashboard’da gerçek veri özetleri
- AI Kariyer Koçu (kural tabanlı; ek Gemini çağrısı yok)
- Toast, empty/loading, 404 / error sınırları
- Auth guest yönlendirme, mobil drawer Escape
- Süreç dokümantasyonu (`docs/`)

Sprint 1–2 özellikleri (auth, ilanlar, CV analizi, AI asistan) çalışmaya devam eder.

## Tamamlanan ekranlar

| Rota | Açıklama |
|------|----------|
| `/applications` | Liste + Kanban + detay drawer |
| `/dashboard` | İstatistikler + kariyer koçu + hızlı işlemler |
| Önceki sprint ekranları | Auth, ilanlar, CV, asistan |

## Test edilen akışlar

- İlandan başvuruya ekleme → durum güncelleme → not / timeline
- Liste ↔ Kanban görünüm geçişi
- Dashboard’un CV geçmişi, başvuru ve kaydedilen ilanları göstermesi
- Kariyer koçu önerilerinin mevcut verilere göre üretilmesi
- TypeScript / ESLint / `npm run build` (final polish döneminde geçti)

## Ürünün stabil durumu

Sprint 3 sonunda MVP döngüsü stabildir: **keşif → CV → AI metin → takip → dashboard/koç**. Sunuma uygun çekirdek özellikler çalışır. Deferred maddeler ve bazı kısmi işler Done sayılmaz.

## Bilinen eksikler

- Ayarlar “Kaydet” kalıcı kayıt yok (UI disabled)
- GitHub / LinkedIn profil analizi yapılmadı
- Firma / kariyer merkezi paneli yapılmadı
- `screenshots/` klasörlerinde gerçek PNG yok (yalnızca liste)

## Sonraki sprintte geliştirilecekler

Bootcamp sonrası / post-MVP:

- Gerçek ekran görüntülerini klasörlere ekleme
- Ayarlar kalıcı kayıt
- PB-11 (GitHub/LinkedIn) ve PB-12 (firma paneli) için ayrı epik kırılımı

## Eklenecek ekran görüntüleri

Gerçek PNG dosyaları henüz yoktur; aşağıdaki dosyalar `screenshots/` klasörüne manuel eklenmelidir.

| Dosya | İçerik |
|-------|--------|
| `01-applications.png` | Başvurularım liste / özet |
| `02-kanban.png` | Kanban panosu |
| `03-career-coach.png` | Dashboard’da AI Kariyer Koçu |
| `04-final-dashboard.png` | Final dashboard (istatistik + hızlı işlemler) |

Ayrıntı: [screenshots/README.md](./screenshots/README.md)
