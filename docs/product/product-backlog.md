# Product Backlog — InternAI

**Product Owner:** Feyza Sağman  
**Geliştirme modeli:** Tek kişilik Scrum (PO + SM + Developer aynı kişi)

## Alanlar

Her madde şu alanları içerir:

| Alan | Açıklama |
|------|----------|
| **ID** | Benzersiz backlog kimliği |
| **User story** | “Bir … olarak … istiyorum, böylece …” |
| **Öncelik** | Must / Should / Could |
| **Story point** | Göreli efor |
| **Sprint** | Planlandığı / tamamlandığı sprint |
| **Durum** | Done / In Progress / Todo / Deferred |

Açıklama sütunu uygulamayı netleştirmek içindir (zorunlu alan setine ek bağlam).

## Backlog tablosu

| ID | User story | Öncelik | Story point | Sprint | Durum | Açıklama |
|----|------------|---------|-------------|--------|-------|----------|
| PB-01 | Bir aday olarak güvenli giriş yapmak istiyorum, böylece kariyer verilerime yalnızca ben erişebilirim. | Must | 5 | 1 | Done | Firebase Auth: kayıt, giriş, şifre sıfırlama, korumalı rotalar |
| PB-02 | Bir öğrenci olarak markalı bir kariyer paneline ulaşmak istiyorum, böylece staj sürecimi tek yerden yönetebilirim. | Must | 5 | 1 | Done | InternAI markası, AppShell, Dashboard iskeleti |
| PB-03 | Bir öğrenci olarak şehir bazlı staj ilanlarını filtrelemek istiyorum, böylece bana uygun fırsatları hızlıca bulabilirim. | Must | 8 | 1 | Done | Liste, arama, filtre, detay, kaydet |
| PB-04 | Bir öğrenci olarak CV PDF’imi yükleyip metnini çıkarmak istiyorum, böylece yapay zekâ analizi için hazır hale getirebilirim. | Must | 8 | 2 | Done | PDF doğrulama, extract API, düzenleme, context |
| PB-05 | Bir öğrenci olarak CV’min ilanla uyumunu görmek istiyorum, böylece başvurmadan önce eksiklerimi anlayabilirim. | Must | 8 | 2 | Done | Gemini CV analizi, ATS, geçmiş |
| PB-06 | Bir öğrenci olarak ilana özel ön yazı ve başvuru e-postası üretmek istiyorum, böylece başvurumu kişiselleştirebilirim. | Must | 8 | 2 | Done | AI Başvuru Asistanı (5 mod) |
| PB-07 | Bir öğrenci olarak başvurularımı durumlara göre takip etmek istiyorum, böylece süreci kaçırmam. | Must | 8 | 3 | Done | Kanban, liste, not, timeline |
| PB-08 | Bir öğrenci olarak dashboard’da kariyer önerileri görmek istiyorum, böylece sonraki adımı bilirim. | Should | 5 | 3 | Done | AI Kariyer Koçu + dashboard entegrasyonu |
| PB-09 | Bir öğrenci olarak tutarlı ve erişilebilir bir arayüz kullanmak istiyorum, böylece demoda ürün güvenilir görünür. | Must | 5 | 3 | Done | UI/UX, toast, 404/error, responsive, güvenlik, docs |
| PB-10 | Bir öğrenci olarak profil ve tercihlerimi yönetmek istiyorum. | Could | 3 | 1–3 | Done* | Profil + ayarlar iskeleti; ayarlar kaydı hâlâ disabled (*kısmi) |
| PB-11 | Bir öğrenci olarak GitHub/LinkedIn profilimin analiz edilmesini istiyorum. | Could | 8 | — | Deferred | **Yapılmadı** — gelecek kapsam |
| PB-12 | Bir kariyer merkezi olarak öğrenci istatistiklerini görmek istiyorum. | Could | 13 | — | Deferred | **Yapılmadı** — firma/admin paneli |

\* PB-10: Sayfalar mevcuttur; kalıcı ayar kaydı tamamlanmış özellik olarak iddia edilmez.

## Özet

- Tamamlanan (Done / kısmi): PB-01 … PB-10  
- Ertelenen (yapılmadı): PB-11, PB-12  
- Toplam story point (Done hedeflenen): ~58–63 (PB-10 kısmi)

## Sprint dağılım mantığı

- [Sprint 1 dağıtım](../sprint-1/backlog-distribution.md)
- [Sprint 2 dağıtım](../sprint-2/backlog-distribution.md)
- [Sprint 3 dağıtım](../sprint-3/backlog-distribution.md)

## Bağlantılar

- [Takım ve roller](./team-and-roles.md)
- [Ürün vizyonu](./product-vision.md)
- [Özellik listesi](./product-features.md) — yalnızca gerçekten tamamlananlar
- [Sprint 1 özeti](../sprint-1/README.md) · [Status](../sprint-1/product-status.md)
- [Sprint 2 özeti](../sprint-2/README.md) · [Status](../sprint-2/product-status.md)
- [Sprint 3 özeti](../sprint-3/README.md) · [Status](../sprint-3/product-status.md)
