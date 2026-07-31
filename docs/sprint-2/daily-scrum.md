# Sprint 2 — Daily Scrum Notları

**Tarih notu:** Commit’lere göre taslak. *Tarih doğrulanmalı* ibaresi bilinçlidir.

---

<details>
<summary><strong>Gün 1 — ~2026-07-24</strong> — <em>tarih doğrulanmalı</em> · commit ipucu: <code>e4ff48e</code></summary>

- **Dün ne yaptım?** Sprint 1’i kapattım; CV gereksinimlerini yazdım.
- **Bugün ne yapacağım?** PDF upload UI + doğrulama (tür, boyut).
- **Engeller:** Yok.
- **Kararlar:** Max 5 MB, yalnızca PDF.
- **Tamamlanan işler:** Upload bileşeni.
</details>

<details>
<summary><strong>Gün 2 — ~2026-07-24</strong> — <em>tarih doğrulanmalı</em></summary>

- **Dün ne yaptım?** Upload doğrulamasını bitirdim.
- **Bugün ne yapacağım?** `/api/resume/extract` (pdf-parse, Node runtime).
- **Engeller:** PDF kütüphanesi seçimi.
- **Kararlar:** Extract sunucuda; istemciye ham binary işlenmez.
- **Tamamlanan işler:** Extract API iskeleti.
</details>

<details>
<summary><strong>Gün 3 — ~2026-07-24</strong> — <em>tarih doğrulanmalı</em></summary>

- **Dün ne yaptım?** Extract API’yi çalıştırdım.
- **Bugün ne yapacağım?** Temizleme, bölüm/beceri tespiti, CV context kaydı.
- **Engeller:** Yok.
- **Kararlar:** Context yalnızca localStorage; sunucuda kalıcı CV yok.
- **Tamamlanan işler:** Context + preview.
</details>

<details>
<summary><strong>Gün 4 — ~2026-07-24 / 25</strong> — <em>tarih doğrulanmalı</em></summary>

- **Dün ne yaptım?** Context akışını tamamladım.
- **Bugün ne yapacağım?** Gemini analyze route + structured schema.
- **Engeller:** JSON doğrulama kırılganlığı.
- **Kararlar:** Geçersiz çıktı ham olarak istemciye gitmeyecek.
- **Tamamlanan işler:** Schema + prompt builder.
</details>

<details>
<summary><strong>Gün 5 — ~2026-07-25</strong> — <em>tarih doğrulanmalı</em> · commit ipucu: <code>87a8565</code></summary>

- **Dün ne yaptım?** Analyze API’yi bağladım.
- **Bugün ne yapacağım?** Analiz raporu UI + geçmiş (max 10).
- **Engeller:** Yok.
- **Kararlar:** History anahtarı `internai_resume_analysis_history`.
- **Tamamlanan işler:** Rapor + history paneli.
</details>

<details>
<summary><strong>Gün 6 — ~2026-07-25</strong> — <em>tarih doğrulanmalı</em></summary>

- **Dün ne yaptım?** CV analiz UI’sini stabilize ettim.
- **Bugün ne yapacağım?** `/api/ai/generate-application` + moda özel alanlar.
- **Engeller:** Mod çeşitliliği.
- **Kararlar:** Ortak request + additionalFields.
- **Tamamlanan işler:** Generation API.
</details>

<details>
<summary><strong>Gün 7 — ~2026-07-25</strong> — <em>tarih doğrulanmalı</em></summary>

- **Dün ne yaptım?** Generation API’yi doğruladım.
- **Bugün ne yapacağım?** Asistan UI, geçmiş, ilan/CV prefill.
- **Engeller:** Yok.
- **Kararlar:** İlan seçiliyse form otomatik dolar.
- **Tamamlanan işler:** Assistant workspace.
</details>

<details>
<summary><strong>Gün 8 — Sprint kapanış</strong> — <em>tarih doğrulanmalı</em></summary>

- **Dün ne yaptım?** Asistan akışını tamamladım.
- **Bugün ne yapacağım?** Rate limit / key güvenliği kontrolü; Sprint 3’e Kanban aktarımı.
- **Engeller:** Ortamda anahtar yoksa production hata vermeli.
- **Kararlar:** Production’da yapılandırma hatası; geliştirmede güvenli yedek çıktı.
- **Tamamlanan işler:** Sprint 2 DoD.
</details>
