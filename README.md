# TAKIM 91 — Feyza Sağman

Diğer GitHub reposu: https://github.com/melismert805-ui/YZTA--Team-91  

Ekip arkadaşlarım ile formu doldurduktan sonra iletişim kuramadım; mesajlara dönüş alamadım ve ilgili GitHub reposuna Scrum Master tarafından eklenmediğim için süreci **bu repoda tek başıma** tamamlıyorum.

---

## InternAI – Yapay Zekâ Destekli Akıllı Staj Platformu

<p align="center">
  <img src="./web-admin/public/brand/internai-logo-light.svg" alt="InternAI logo" width="280" />
</p>

### Proje hakkında

InternAI, üniversite öğrencileri ve yeni mezunların staj başvuru süreçlerini daha hızlı, bilinçli ve başarılı yönetmelerini sağlayan yapay zekâ destekli bir kariyer platformudur.

Geleneksel staj platformları çoğunlukla ilan listelemekle sınırlıyken InternAI; şehir bazlı ilan keşfi, CV analizi, ilan–CV uyumu, ilana özel başvuru metinleri, mülakat hazırlığı ve başvuru takibini tek çalışma alanında birleştirir.

**Slogan:** Doğru stajı bul, yapay zekâ ile daha güçlü başvur.

### Veri kaynağı (şeffaflık)

MVP’de staj ilanları **temsili demo verisidir**; canlı bir staj API’sinden veya güncel açık pozisyonlardan çekilmez. Amaç keşif, filtre, CV uyumu ve başvuru akışını ürün üzerinde göstermektir.

Veri erişimi `web-admin/features/internships/data/internships.ts` içindeki `getInternships()` / `getInternshipById()` üzerinden yapılır; bu katman ileride gerçek bir API entegrasyonuna taşınmaya uygundur.

Marka dosyaları ve tasarım referansı: [docs/branding/README.md](./docs/branding/README.md)

### Problem

Öğrenciler aynı CV ve ön yazıyla birçok şirkete başvurmakta; ilan uyumu düşük kaldığı için süreç verimsiz ilerlemektedir. Eksik yetkinlikler başvuru öncesi görünmez; mülakat hazırlığı ve başvuru takibi dağınık kalır.

### Çözüm

InternAI ile kullanıcılar:

- Şehir bazlı staj ilanlarını keşfeder
- CV’sini yapay zekâ ile analiz ettirir
- İlan–CV uyumunu görür
- Ön yazı / başvuru e-postası üretir
- CV iyileştirme ve mülakat hazırlığı alır
- Başvurularını panoda takip eder
- Dashboard ve kariyer koçu ile sonraki adımları görür

### Yapay zekâ özellikleri

- **CV analizi:** güçlü yönler, eksikler, ATS tahmini, ilan uyumu
- **AI Başvuru Asistanı:** ön yazı, e-posta, CV iyileştirme, mülakat, motivasyon
- **AI Kariyer Koçu:** mevcut veriden kural tabanlı kişiselleştirilmiş öneriler

### Hedef kitle

- Üniversite öğrencileri
- Yeni mezunlar
- Zorunlu / gönüllü staj arayanlar
- Kariyer merkezleri

### Vizyon

InternAI’nin amacı yalnızca ilan listelemek değil; öğrencilerin kariyer yolculuğuna yapay zekâ ile rehberlik eden bir ekosistem oluşturmaktır.

### Gelecekte planlananlar

- GitHub / LinkedIn profil analizi
- Bulut senkronizasyonu
- Firma paneli ve istatistikler
- Daha zengin kariyer yol haritası
- Portföy değerlendirme

---

## Proje yönetimi

Bu proje **tek kişi** tarafından geliştirilmiştir. Ayrıntı: [Takım ve roller](./docs/product/team-and-roles.md)

| Rol | Kişi |
|-----|------|
| Product Owner | Feyza Sağman |
| Scrum Master | Feyza Sağman |
| Developer | Feyza Sağman |

### Sprint dokümantasyonu

Tüm süreç belgeleri `docs/` klasöründedir:

- [Dokümantasyon ana sayfa](./docs/README.md)
- [Takım ve roller](./docs/product/team-and-roles.md)
- [Product Backlog](./docs/product/product-backlog.md)
- [Ürün vizyonu](./docs/product/product-vision.md)
- [Ürün özellikleri](./docs/product/product-features.md)
- [Hedef kitle](./docs/product/target-audience.md)

### Sprint özetleri (altı Bootcamp bölümü)

| Sprint | Hedef | Özet |
|--------|-------|------|
| **Sprint 1** | Altyapı ve temel ürün iskeleti | [sprint-1/README.md](./docs/sprint-1/README.md) |
| **Sprint 2** | CV ve başvuru metni süreçleri | [sprint-2/README.md](./docs/sprint-2/README.md) |
| **Sprint 3** | Ürün bütünlüğü ve finalizasyon | [sprint-3/README.md](./docs/sprint-3/README.md) |

### Sprint bağlantıları

| Sprint | Belgeler |
|--------|----------|
| **Sprint 1** | [Dağıtım](./docs/sprint-1/backlog-distribution.md) · [Planning](./docs/sprint-1/sprint-planning.md) · [Backlog](./docs/sprint-1/sprint-backlog.md) · [Daily](./docs/sprint-1/daily-scrum.md) · [Board](./docs/sprint-1/sprint-board-updates.md) · [Status](./docs/sprint-1/product-status.md) · [Review](./docs/sprint-1/sprint-review.md) · [Retro](./docs/sprint-1/sprint-retrospective.md) · [Screenshots](./docs/sprint-1/screenshots/README.md) |
| **Sprint 2** | [Dağıtım](./docs/sprint-2/backlog-distribution.md) · [Planning](./docs/sprint-2/sprint-planning.md) · [Backlog](./docs/sprint-2/sprint-backlog.md) · [Daily](./docs/sprint-2/daily-scrum.md) · [Board](./docs/sprint-2/sprint-board-updates.md) · [Status](./docs/sprint-2/product-status.md) · [Review](./docs/sprint-2/sprint-review.md) · [Retro](./docs/sprint-2/sprint-retrospective.md) · [Screenshots](./docs/sprint-2/screenshots/README.md) |
| **Sprint 3** | [Dağıtım](./docs/sprint-3/backlog-distribution.md) · [Planning](./docs/sprint-3/sprint-planning.md) · [Backlog](./docs/sprint-3/sprint-backlog.md) · [Daily](./docs/sprint-3/daily-scrum.md) · [Board](./docs/sprint-3/sprint-board-updates.md) · [Status](./docs/sprint-3/product-status.md) · [Review](./docs/sprint-3/sprint-review.md) · [Retro](./docs/sprint-3/sprint-retrospective.md) · [Screenshots](./docs/sprint-3/screenshots/README.md) |

### Ürün durumu (özet)

MVP sunuma hazırdır: kimlik doğrulama, staj keşfi, CV analizi, AI asistan, başvuru takibi, dashboard ve kariyer koçu tamamlanmıştır. GitHub/LinkedIn analizi ve firma paneli yapılmamıştır. Ekran görüntüleri her sprintin `screenshots/` klasörüne manuel eklenmelidir (klasörde şu an yalnızca dosya listesi vardır).

### Çalıştırma (web)

```bash
cd web-admin
npm install
npm run dev
```

Ortam değişkeni: `web-admin/.env.local` içinde `GEMINI_API_KEY` (yalnızca sunucu tarafı).
