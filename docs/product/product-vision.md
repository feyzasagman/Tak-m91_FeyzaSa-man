# Ürün Vizyonu — InternAI

## Takım durumu

Bu proje **tek kişi** tarafından geliştirilmektedir.

| Rol | Kişi |
|-----|------|
| Product Owner | Feyza Sağman |
| Scrum Master | Feyza Sağman |
| Developer | Feyza Sağman |

---

## Problem

Her yıl binlerce öğrenci aynı özgeçmiş ve aynı ön yazıyla onlarca şirkete başvurmaktadır. Başvuruların büyük kısmı ilan beklentileriyle uyuşmadığı için olumsuz sonuçlanmaktadır.

Başlıca sorunlar:

- Uygun staj ilanlarını bulmak zordur.
- Aynı CV ve ön yazı her şirkete gönderilir.
- Başvuru öncesi eksik yetkinlikler fark edilmez.
- Hangi alanın geliştirileceği belirsizdir.
- Mülakat hazırlığı yetersiz kalır.
- Başvuru takibi dağınık ve zaman alıcıdır.

## Çözüm

**InternAI**, şehir bazlı staj ilanlarını; yapay zekâ destekli CV analizi, ilana özel başvuru metinleri ve başvuru takip sistemi ile birleştiren akıllı bir kariyer platformudur.

Kullanıcı tek çalışma alanında ilan keşfeder, CV’sini analiz eder, başvuru metni üretir ve sürecini takip eder.

## Hedef kullanıcı

- Üniversite öğrencileri
- Yeni mezunlar
- Zorunlu veya gönüllü staj arayan adaylar
- Kariyer merkezleri (dolaylı paydaş)

## Ürün değeri

- Başvuru sürecini tek platformda toplar.
- CV–ilan uyumunu görünür kılar.
- Her ilana özel metin üretimiyle kişiselleştirme sağlar.
- Başvuru durumlarını ATS tarzı panoda takip ettirir.
- Kural tabanlı kariyer koçu ile sonraki adımları önerir.

## Rakiplerden farkı

Klasik staj siteleri çoğunlukla ilan listesi sunar. InternAI ise:

- CV metnini PDF’den çıkarır ve analiz eder,
- İlan bağlamıyla uyum skoru üretir,
- Ön yazı / e-posta / mülakat hazırlığı gibi AI asistan modları sunar,
- Başvuru takibini ürünün merkezine koyar.

## AI’nın üründeki rolü

Yapay zekâ (Gemini) sunucu tarafında kullanılır:

- CV–ilan uyum ve ATS tahmini analizi
- Ön yazı, başvuru e-postası, CV iyileştirme, mülakat ve motivasyon metinleri

API anahtarı yalnızca sunucuda tutulur; istemciye sızdırılmaz. Kariyer koçu modülü mevcut kullanıcı verilerinden kural tabanlı öneri üretir (yeni model çağrısı yapmaz).

## MVP kapsamı

- Firebase Authentication (kayıt, giriş, şifre sıfırlama)
- Dashboard ve hızlı işlemler
- Şehir bazlı staj ilanları, filtre ve detay
- CV PDF yükleme, metin çıkarma, AI analizi
- AI Başvuru Asistanı
- Başvurularım (liste + Kanban + timeline)
- AI Kariyer Koçu
- Responsive koyu tema UI

## Gelecek geliştirmeler

- GitHub / LinkedIn profil analizi
- Kalıcı bulut veri senkronizasyonu
- Firma paneli ve başvuru istatistikleri
- Daha zengin kariyer yol haritası
- Portföy değerlendirme

## Slogan

> Doğru stajı bul, yapay zekâ ile daha güçlü başvur.
