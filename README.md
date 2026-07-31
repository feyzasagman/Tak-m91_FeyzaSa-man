<p align="center">
  <img src="./web-admin/public/brand/internai-logo-light-v2.svg" alt="InternAI — Kariyer Platformu" width="320" />
</p>

<h1 align="center">InternAI</h1>

<p align="center">
  <strong>Yapay zekâ destekli akıllı staj ve kariyer platformu</strong>
</p>

<p align="center">
  Doğru stajı bul, yapay zekâ ile daha güçlü başvur.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img alt="Gemini AI" src="https://img.shields.io/badge/Gemini-2.5--flash--lite-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

---

## 🌐 Canlı Demo

Sistemi tarayıcıdan deneyebilirsiniz:

🔗 **https://internai-fngvr2dgc-feyza.vercel.app**

Hesap oluşturup giriş yaptıktan sonra staj keşfi, CV analizi, AI başvuru asistanı, başvuru panosu ve ayarları kullanabilirsiniz.

---

## Genel Bakış

InternAI, üniversite öğrencileri ve yeni mezunların staj süreçlerini tek bir çalışma alanında yönetmesini sağlar. Şehir bazlı ilan keşfi, Gemini ile CV analizi, ilana özel başvuru metinleri, başvuru takibi ve kariyer önerilerini bir araya getirir.

| | |
|---|---|
| **Problem** | Aynı CV ve ön yazıyla yapılan başvurular düşük uyum üretir; takip dağınık kalır. |
| **Çözüm** | Keşif → analiz → AI metin → takip → dashboard döngüsü. |
| **Slogan** | Doğru stajı bul, yapay zekâ ile daha güçlü başvur. |

### Veri kaynağı (şeffaflık)

MVP’de staj ilanları **temsili demo verisidir**; canlı bir staj API’sinden çekilmez. Amaç ürün akışını göstermektir. Veri erişimi `getInternships()` / `getInternshipById()` üzerinden yapılır ve ileride gerçek API’ye taşınmaya uygundur.

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| **Kimlik doğrulama** | Firebase Authentication ile kayıt, giriş ve şifre sıfırlama |
| **Dashboard** | Özet istatistikler, hızlı işlemler ve kariyer çalışma alanı |
| **Staj keşfi** | Şehir / alan / model filtreleriyle staj kataloğu (demo veri) |
| **AI CV analizi** | PDF metin çıkarma, Gemini ile CV–ilan uyumu ve ATS tahmini |
| **AI ön yazı / başvuru metni** | AI Başvuru Asistanı ile ön yazı, e-posta, mülakat ve motivasyon |
| **Başvuru panosu** | Liste + Kanban, not ve timeline |
| **AI Kariyer Koçu** | Mevcut veriden kural tabanlı kişiselleştirilmiş öneriler |
| **Kullanıcı profili** | Hesap bilgisi ve kariyer kimliği alanı |
| **Ayarlar** | Hesap tercihleri ve görünüm ayarları |
| **Bildirim tercihleri** | Firestore’a kaydedilen tercihler (push bildirimi yok) |
| **Firebase entegrasyonu** | Auth + Firestore |
| **Gemini AI entegrasyonu** | Sunucu tarafı Gemini API (`gemini-2.5-flash-lite`) |
| **Responsive tasarım** | Mobil ve masaüstü uyumlu arayüz |

---

## 👤 Kullanıcı Akışı

1. Kayıt ol / giriş yap (Firebase Auth)
2. Dashboard üzerinden çalışma alanına gir
3. Staj ilanlarını filtrele ve incele (demo katalog)
4. CV PDF yükle → metni çıkar → kontrol et
5. Gemini ile CV analizi ve ATS / ilan uyumu raporunu gör
6. AI Başvuru Asistanı ile ön yazı veya e-posta üret
7. Başvuruyu panoya ekle; durum, not ve timeline ile takip et
8. Ayarlardan bildirim tercihlerini kaydet

---

## 🏗 Sistem Mimarisi

```text
Kullanıcı (Tarayıcı)
        │
        ▼
   Next.js (App Router)
   web-admin/
        │
        ├──────────────► Firebase Authentication
        │
        ├──────────────► Cloud Firestore
        │                 (örn. bildirim tercihleri)
        │
        └──────────────► API Routes (sunucu)
                           /api/resume/extract
                           /api/resume/analyze
                           /api/ai/generate-application
                                      │
                                      ▼
                               Google Gemini API
                               (gemini-2.5-flash-lite)
```

İstemci tarafında başvuru panosu, kaydedilen ilanlar, CV bağlamı ve üretim geçmişi `localStorage` ile tutulur. AI çağrıları yalnızca sunucu API route’ları üzerinden yapılır.

---

## 🤖 Yapay Zekâ Teknik Akışı

Model: **`gemini-2.5-flash-lite`** (`web-admin/lib/ai/gemini.ts`)

1. **PDF metin çıkarma** — Kullanıcı PDF yükler; `/api/resume/extract` sunucuda metni çıkarır.
2. **Metin kontrolü** — Kullanıcı çıkan metni gözden geçirip düzenleyebilir; bağlam tarayıcıda saklanır.
3. **CV analizi** — `/api/resume/analyze` CV metnini (ve isteğe bağlı ilan bilgisini) alır; `GEMINI_API_KEY` ile Gemini’ye istek atar.
4. **Yapılandırılmış sonuç** — Skorlar, güçlü/zayıf yönler, beceriler ve öneriler şema ile doğrulanır.
5. **ATS ve ilan uyumu** — ATS tahmini ve ilan–CV uyum değerlendirmesi raporda sunulur.
6. **Ön yazı / e-posta üretimi** — `/api/ai/generate-application` seçilen moda göre metin üretir (ön yazı, e-posta, CV iyileştirme, mülakat, motivasyon).
7. **Kariyer koçu** — Ek Gemini çağrısı yapmaz; mevcut yerel veriden kural tabanlı öneri üretir.

AI çıktıları tahmindir; kullanıcı kontrolü ve düzenlemesi gerektirir.

---

## 🖼 Demo Ekran Görüntüleri

### Ana sayfa ve kimlik doğrulama

| Ana sayfa | Giriş | Kayıt |
|:---:|:---:|:---:|
| ![Ana sayfa](./docs/sprint-1/screenshots/landing-page.png) | ![Giriş](./docs/sprint-1/screenshots/login.png) | ![Kayıt](./docs/sprint-1/screenshots/register.png) |

### Keşif ve profil

| Staj ilanları | Profil |
|:---:|:---:|
| ![Staj ilanları](./docs/sprint-1/screenshots/internships.png) | ![Profil](./docs/sprint-1/screenshots/profile.png) |

### AI CV ve asistan

| CV yükleme | CV skoru | Başvuru asistanı |
|:---:|:---:|:---:|
| ![CV yükleme](./docs/sprint-2/screenshots/resume-upload.png) | ![CV skoru](./docs/sprint-2/screenshots/resume-score.png) | ![Asistan](./docs/sprint-2/screenshots/application-assistant.png) |

### Başvurular, dashboard ve ayarlar

| Başvurular | Final dashboard | Ayarlar |
|:---:|:---:|:---:|
| ![Başvurular](./docs/sprint-3/screenshots/applications.png) | ![Dashboard](./docs/sprint-3/screenshots/final-dashboard.png) | ![Ayarlar](./docs/sprint-3/screenshots/settings.png) |

---

## 🛠 Teknoloji Yığını

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Backend

- Firebase
- Cloud Firestore
- Firebase Authentication

### Yapay zekâ

- Google Gemini API (`@google/genai`)
- Model: `gemini-2.5-flash-lite`

### Dağıtım

- Vercel

---

## 🔒 Güvenlik ve Veri Gizliliği

- `GEMINI_API_KEY` yalnızca sunucu tarafında kullanılır; istemciye gönderilmez.
- `.env.local` Git dışında tutulur; şablon `web-admin/.env.example` içindedir.
- Kimlik doğrulama Firebase Authentication ile yapılır.
- Firestore Security Rules kullanıcının kendi verisine erişimini sınırlar (örn. bildirim tercihleri).
- CV içeriği analiz için işlenir; kalıcı olarak sunucuda saklanmaz. Analiz geçmişi tarayıcı `localStorage` üzerindedir.
- AI çıktıları tahmindir; nihai başvuru metinleri kullanıcı tarafından kontrol edilmelidir.

---

## ⚠ Bilinen Sınırlamalar

- Staj ilanları canlı API değil; temsili **demo veri**dir.
- Gerçek **push notification** yoktur; yalnızca tercih kaydı vardır.
- **Firma / admin paneli** bu MVP kapsamında yoktur.
- AI skorları ve metinler **garanti değildir**; kullanıcı doğrulaması gerekir.
- Aşağıdaki veriler tarayıcı **localStorage** anahtarlarında tutulur:
  - `internai.resume-analysis-context`
  - `internai_resume_analysis_history`
  - `internai.generated-applications`
  - `internai.saved-internships`
  - `internai.applications-board`
  - `internai.applications-view`

---

## 📁 Proje Yapısı

```text
Tak-m91_FeyzaSa-man/
├── README.md
├── firebase.json
├── firestore.rules
├── .firebaserc
├── docs/
│   ├── README.md
│   ├── branding/                 # Marka kimliği
│   ├── product/                  # Vizyon, backlog, özellikler, takım
│   ├── sprint-1/                 # Sprint 1 + screenshots/
│   ├── sprint-2/                 # Sprint 2 + screenshots/
│   ├── sprint-3/                 # Sprint 3 + screenshots/
│   └── screenshots-organization-report.md
└── web-admin/                    # Next.js uygulaması
    ├── app/                      # App Router (sayfalar, API routes)
    ├── components/brand/         # BrandLogo
    ├── features/                 # Domain modülleri
    │   ├── ai-assistant/
    │   ├── applications/
    │   ├── career-coach/
    │   ├── dashboard/
    │   ├── internships/
    │   ├── resume-analysis/
    │   └── settings/
    ├── lib/                      # Firebase, AI, routes
    ├── public/brand/             # SVG logo & favicon
    ├── .env.example
    └── package.json
```

---

## 🚀 Başlangıç

### Gereksinimler

- Node.js 20+
- npm
- Firebase projesi (Auth + Firestore)
- Gemini API anahtarı

### 1. Depoyu klonla

```bash
git clone https://github.com/feyzasagman/Tak-m91_FeyzaSa-man.git
cd Tak-m91_FeyzaSa-man
```

### 2. Bağımlılıkları kur

```bash
cd web-admin
npm install
```

### 3. Ortam değişkenleri

```bash
cp .env.example .env.local
```

`.env.local` dosyasını doldurun. Şablon: [`web-admin/.env.example`](./web-admin/.env.example)

| Değişken | Açıklama |
|----------|----------|
| `GEMINI_API_KEY` | Sunucu tarafı Gemini anahtarı |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase web yapılandırması |

### 4. Geliştirme sunucusu

```bash
npm run dev
```

Uygulama: [http://localhost:3000](http://localhost:3000)

### 5. Production build (opsiyonel)

```bash
npm run build
npm start
```

---

## 📚 Dokümantasyon

| Bölüm | Bağlantı |
|-------|----------|
| Dokümantasyon ana sayfa | [docs/README.md](./docs/README.md) |
| Product Backlog | [docs/product/product-backlog.md](./docs/product/product-backlog.md) |
| Ürün vizyonu | [docs/product/product-vision.md](./docs/product/product-vision.md) |
| Ürün özellikleri | [docs/product/product-features.md](./docs/product/product-features.md) |
| Takım ve roller | [docs/product/team-and-roles.md](./docs/product/team-and-roles.md) |
| Branding | [docs/branding/README.md](./docs/branding/README.md) |
| Sprint 1 | [docs/sprint-1/README.md](./docs/sprint-1/README.md) |
| Sprint 2 | [docs/sprint-2/README.md](./docs/sprint-2/README.md) |
| Sprint 3 | [docs/sprint-3/README.md](./docs/sprint-3/README.md) |
| Ekran görüntüsü raporu | [docs/screenshots-organization-report.md](./docs/screenshots-organization-report.md) |

### Sprint özetleri

| Sprint | Hedef | Özet |
|--------|-------|------|
| **Sprint 1** | Altyapı ve temel ürün iskeleti | [README](./docs/sprint-1/README.md) |
| **Sprint 2** | CV ve başvuru metni süreçleri | [README](./docs/sprint-2/README.md) |
| **Sprint 3** | Ürün bütünlüğü ve finalizasyon | [README](./docs/sprint-3/README.md) |

---

## 🗺 Yol Haritası

- GitHub / LinkedIn profil analizi
- Bulut senkronizasyonu (başvuru / CV geçmişi)
- Firma paneli ve istatistikler
- Daha zengin kariyer yol haritası
- Portföy değerlendirme

---

## 👥 Ekip

Bu proje **Takım 91** kapsamında geliştirilmiştir.

| Rol | Kişi |
|-----|------|
| Product Owner | Feyza Sağman |
| Scrum Master | Feyza Sağman |
| Developer | Feyza Sağman |

Ayrıntı: [docs/product/team-and-roles.md](./docs/product/team-and-roles.md)

---

## 📝 Proje Geliştirme Notu

Bu teslim, Bootcamp sürecinde **Takım 91** ürünü olarak bu depoda tamamlanmıştır. Geliştirme, Product Owner / Scrum Master / Developer rollerinin aynı kişi tarafından yürütüldüğü tek kişilik Scrum düzeninde yapılmıştır. Süreç belgeleri `docs/` altında yer alır.
