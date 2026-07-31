# Sprint 2 Backlog — InternAI

**Sprint hedefi:** CV + AI başvuru süreçleri  
**Sorumlu:** Feyza Sağman

| ID | Görev | Bağlı PB | SP | Durum | Kanıt / konum |
|----|-------|----------|----|-------|----------------|
| S2-01 | PDF yükleme UI + doğrulama | PB-04 | 3 | Done | `ResumeUpload`, validation |
| S2-02 | Metin çıkarma API (`pdf-parse`) | PB-04 | 5 | Done | `app/api/resume/extract` |
| S2-03 | Metin düzenleme + CV context | PB-04 | 3 | Done | `resumeContextStorage` |
| S2-04 | Beceri / bölüm tespiti | PB-04 | 2 | Done | `detectTechnicalSkills`, sections |
| S2-05 | Gemini CV analiz API + schema | PB-05 | 5 | Done | `app/api/resume/analyze` |
| S2-06 | Analiz raporu UI + geçmiş | PB-05 | 3 | Done | `features/resume-analysis` |
| S2-07 | AI asistan API + prompt’lar | PB-06 | 5 | Done | `app/api/ai/generate-application` |
| S2-08 | Asistan UI (5 mod) + geçmiş | PB-06 | 5 | Done | `features/ai-assistant` |
| S2-09 | Rate limit + güvenlik kontrolleri | PB-05/06 | 2 | Done | `lib/ai/*` |

**Toplam:** 33 SP
