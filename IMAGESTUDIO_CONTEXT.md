# ImageStudio - Project Context

## Overview
ImageStudio is a passport/ID photo generator. The backend is an **n8n workflow** that receives photos from a **Lovable frontend**, processes them through **Gemini AI** to create studio-quality passport photos, and sends results back via callbacks.

## Architecture
```
Lovable Frontend (React) → n8n Webhook → Gemini AI → Callback to Frontend
```

## n8n Workflow (ID: ovEb9tghDjplyWUf)
**Endpoint:** `POST /passport-photo-generator`

### Request Payload (from Lovable)
```json
{
  "image": "<base64 encoded image>",
  "photoType": "Passport (40x60mm)" | "Visa (35x45mm)" | "ID Card (35x35mm)",
  "mimeType": "image/png",
  "model": "gemini-2.5-flash-preview-image-generation",
  "callbackUrl": "https://your-lovable-app.com/api/callback",
  "jobId": "optional-unique-id"
}
```

### Workflow Flow (17 nodes)
```
1. Webhook Trigger (POST)
2. Parse Request (extract image, photoType, callbackUrl, jobId)
3. Build Analyze Request (prepare Gemini vision call)
4. Analyze Image (Gemini 2.0 Flash - analyzes input photo quality)
5. Build Prompt (creates studio photo transformation prompt with analysis context)
6. Create Variations (4 lighting variations: warm, neutral, cool, flat)
6b. Loop Variations (splitInBatches)
7. Build Generate Request (per variation)
8. Generate Photo (Gemini 2.5 Flash image generation)
9. Package Result (extract image from Gemini response)

--- NEW: ICAO Compliance Branch (Feb 2026) ---
9a. Is Passport? (IF node - checks photoType === "Passport")
    ├── TRUE → 9b. Build ICAO Check → 9c. ICAO Analyze (Gemini 2.0 Flash) → 9d. Parse ICAO Result → 10. Send Callback
    └── FALSE → 10. Send Callback (skip ICAO check)

10. Send Callback (POST to callbackUrl)
11. Prepare Response (summary after all variations done)
12. Respond to Webhook (final HTTP response)
```

### Callback Payload (sent to Lovable per variation)
```json
{
  "jobId": "job-abc123",
  "variationId": 1,
  "totalVariations": 4,
  "success": true,
  "photoType": "Passport",
  "dimensions": "40mm x 60mm",
  "resolution": "472px x 709px",
  "dpi": 300,
  "filename": "passport_photo_v1_2026-02-15.png",
  "imageBase64": "<base64 image data>",
  "mimeType": "image/png",
  "completedAt": "2026-02-15T10:00:00.000Z",

  "icaoCompliance": {
    "overall_pass": true,
    "confidence_score": 92,
    "checks": {
      "background": { "pass": true, "detail": "Pure white, uniform" },
      "head_position": { "pass": true, "detail": "Centered, straight" },
      "face_visibility": { "pass": true, "detail": "Full face visible" },
      "expression": { "pass": true, "detail": "Neutral expression" },
      "eyes": { "pass": true, "detail": "Both eyes open and visible" },
      "lighting": { "pass": true, "detail": "Even illumination" },
      "focus": { "pass": true, "detail": "Sharp focus on face" },
      "framing": { "pass": true, "detail": "Head and shoulders, 75% height" },
      "skin_tone": { "pass": true, "detail": "Natural skin tone" },
      "artifacts": { "pass": false, "detail": "Minor AI smoothing detected" }
    },
    "issues": ["Minor AI smoothing detected on skin"],
    "recommendation": "ACCEPT"
  }
}
```

> **Note:** `icaoCompliance` is ONLY present when `photoType === "Passport"`. Visa and ID Card callbacks do NOT include this field.

## ICAO 9303 Compliance Checks (10 criteria)
1. **Background** - Pure white, uniform, no gradients/shadows
2. **Head Position** - Centered, straight, no tilt/rotation
3. **Face Visibility** - Full face from chin to crown
4. **Expression** - Neutral, mouth closed
5. **Eyes** - Both open, visible, no glare
6. **Lighting** - Even, no harsh shadows, natural skin
7. **Focus** - Sharp, no blur/artifacts
8. **Framing** - Head + shoulders, face 70-80% of height
9. **Skin Tone** - Natural, not over/under exposed
10. **Artifacts** - No digital/AI rendering artifacts

## Photo Type Configurations
| Type | Dimensions | Pixels (300 DPI) |
|------|-----------|-----------------|
| Passport (40x60mm) | 40mm × 60mm | 472px × 709px |
| Visa (35x45mm) | 35mm × 45mm | 413px × 531px |
| ID Card (35x35mm) | 35mm × 35mm | 413px × 413px |

## Frontend Integration Notes

### What to implement on the Lovable side:
1. **Check for `icaoCompliance` in callback** - only exists for passport photos
2. **Display compliance status:**
   - `icaoCompliance.overall_pass` → green checkmark or red X
   - `icaoCompliance.recommendation` → "ACCEPT" / "REJECT" / "REVIEW" badge
   - `icaoCompliance.confidence_score` → percentage indicator
   - `icaoCompliance.issues` → list of problems if any
   - `icaoCompliance.checks` → expandable detail view per criterion
3. **No breaking changes** - existing Visa/ID Card flows are unchanged
4. **The ICAO check is informational** - it doesn't block the photo from being delivered

### Suggested UI Pattern:
```
┌─────────────────────────────┐
│  Variation 1    ✅ ICAO OK  │
│  [photo]        Score: 92%  │
│                 ▸ Details   │
├─────────────────────────────┤
│  Variation 2    ⚠️ REVIEW   │
│  [photo]        Score: 71%  │
│                 ▸ 2 issues  │
└─────────────────────────────┘
```

## Tech Stack
- **Backend:** n8n (self-hosted via ngrok)
- **Frontend:** Lovable (React)
- **AI:** Google Gemini (2.0 Flash for analysis, 2.5 Flash for image generation)
- **API Key:** Stored in n8n HTTP Request headers (x-goog-api-key)
