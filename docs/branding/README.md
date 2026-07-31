# InternAI Marka / Branding

## Uygulama logoları (kullanılan)

Üretim arayüzünde yalnızca şu optimize dosyalar kullanılır:

| Dosya | Kullanım |
|-------|----------|
| `web-admin/public/brand/internai-logo-dark.svg` | Koyu zemin (navbar, auth, sidebar) |
| `web-admin/public/brand/internai-logo-light.svg` | Açık zemin / README |
| `web-admin/public/brand/internai-icon.svg` | İkon / mobil |
| `web-admin/public/favicon.ico` | Favicon |

Bileşen: `web-admin/components/brand/BrandLogo.tsx`

## Tasarım referansı (uygulamada kullanılmaz)

| Dosya | Not |
|-------|-----|
| [internai-logo-design-reference.png](./internai-logo-design-reference.png) | Büyük mockup; yalnızca tasarım referansı |

Bu referans görsel, AI destekli marka tasarım sürecinde üretilmiş bir tasarım panosudur. Uygulama bileşenlerinde, metadata’da veya favicon olarak **kullanılmaz**. Üretim logoları bu referanstan ilham alınarak özgün SVG olarak yeniden çizilmiştir; referans birebir kopyalanmamıştır.

## Süreç özeti

1. AI destekli tasarım sürecinde marka yönü (mor–mavi degrade, AI monogramı, slogan) belirlendi.
2. Referans mockup `docs/branding/` altında saklandı.
3. Uygulama için hafif SVG + favicon üretildi ve `BrandLogo` ile entegre edildi.
