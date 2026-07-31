# Sprint 1 — Product Status

## Sprint hedefi

Proje altyapısı ve temel ürün iskeleti: kimlik doğrulama, InternAI markası, AppShell ve staj keşfi.

## Sprint sonunda çalışan özellikler

- Firebase Authentication (kayıt, giriş, şifre sıfırlama)
- Korumalı platform rotaları
- InternAI markası ve navigasyon (AppShell)
- Dashboard iskeleti
- Staj ilanı listesi, arama ve filtreler
- İlan detay sayfası
- İlan kaydetme (localStorage)
- Profil / ayarlar sayfa iskeleti

## Tamamlanan ekranlar

| Rota | Açıklama |
|------|----------|
| `/login`, `/register`, `/forgot-password` | Auth akışları |
| `/dashboard` | Dashboard iskeleti |
| `/internships` | İlan listesi |
| `/internships/[id]` | İlan detay |
| Profil / ayarlar | Kabuk sayfalar |

## Test edilen akışlar

- Oturumsuz kullanıcının platforma girememesi
- Giriş / kayıt sonrası dashboard’a yönlenme
- İlan listesinde filtre ve arama
- İlan detayını açma ve kaydetme

## Ürünün stabil durumu

Sprint 1 sonunda ürün **iskelet + staj keşfi** seviyesinde stabildir. Auth ve ilan sayfaları demoda gezilebilir. AI, CV analizi ve başvuru panosu henüz yoktur.

## Bilinen eksikler

- CV yükleme / analiz yok
- AI Başvuru Asistanı yok
- Başvuru takip panosu yok
- AI Kariyer Koçu yok
- Ayarlar “Kaydet” kalıcı kayıt yok
- Gerçek ekran görüntüleri klasöre eklenmedi

## Sonraki sprintte geliştirilecekler

- PDF’den CV metni çıkarma
- Gemini ile CV–ilan analizi
- AI Başvuru Asistanı

## Ekran görüntüleri

Mevcut dosyalar: [screenshots/README.md](./screenshots/README.md)

| Dosya | İçerik |
|-------|--------|
| `landing-page.png` | Ana sayfa |
| `login.png` | Giriş |
| `register.png` | Kayıt |
| `internships.png` | Staj ilanları |
| `profile.png` | Profil |

Eksik: ilan detay; erken dashboard (bkz. Sprint 3 `final-dashboard.png`).
