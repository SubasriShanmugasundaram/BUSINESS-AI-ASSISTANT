# BizPartner AI — Design System & Visual Architecture

> **Attribution Note:** Adapted design direction inspired by the provided Daniel Sun design reference. BizPartner AI does not claim original authorship of the aesthetic foundation; it translates the visual principles into a production-grade business intelligence platform for MSMEs.

---

## 1. Design Philosophy & Character

BizPartner AI is an autonomous business management and predictive intelligence suite for MSMEs, retail stores, supermarkets, and wholesalers.

The visual direction rejects generic admin templates, neon cryptocurrency aesthetics, bloated Bootstrap interfaces, and superficial glassmorphism. Instead, it embodies:

- **Editorial SaaS:** Clean, high-impact serif typography paired with crisp, functional geometric sans-serif.
- **Minimal Business Intelligence:** Architectural precision, restrained borders, and clear data hierarchy.
- **Soft Warm Glow:** Subtle, large, diffused yellow glow providing warmth without visual clutter.
- **Tactical Yellow Accent:** Reference color `#fcec4d` used deliberately as an accent, highlight, AI indicator, and primary action cue — never overwhelming the workspace.
- **Architectural Grid:** Subtle mathematical grid background reminiscent of financial spreadsheets and engineering blueprints.

---

## 2. Color System & Semantic Tokens

### Base Reference Colors
- `#fcec4d` — Vibrant Warm Yellow (Primary Accent / Highlight / CTAs)
- `#fbfb89` — Pale Luminous Yellow (Glow Tint / Soft Highlights)
- `#827602` — Deep Antique Gold / Ochre (High Contrast Text in Light Mode)
- `#857c5d` — Warm Olive Slate (Muted Neutral Text / Borders)
- `#bcb4ae` — Limestone Grey (Crisp Neutral Borders / Dividers)

### Semantic Token Architecture

| Token | Dark Mode | Light Mode | Purpose |
|---|---|---|---|
| `--color-background` | `#0d0e11` | `#f7f6f2` | Primary application canvas |
| `--color-surface` | `#14161a` | `#ffffff` | Standard card and panel surface |
| `--color-surface-raised` | `#1c1e24` | `#f0eee8` | Elevated states, hovers, table rows |
| `--color-surface-subtle` | `#111216` | `#faf9f6` | Recessed inputs, search bars, tags |
| `--color-text-primary` | `#fbfbfa` | `#181715` | High-contrast editorial titles and values |
| `--color-text-secondary` | `#c5c1b8` | `#545048` | Supporting body copy and labels |
| `--color-text-muted` | `#857c5d` | `#857c5d` | Microcopy, captions, timestamp metadata |
| `--color-accent` | `#fcec4d` | `#fcec4d` | Primary CTA, highlight, AI indicator |
| `--color-accent-soft` | `rgba(252,236,77,0.12)` | `rgba(252,236,77,0.26)` | Subtle badge backgrounds, card glow |
| `--color-accent-strong` | `#fbfb89` | `#827602` | High-contrast accent text/indicators |
| `--color-accent-contrast` | `#0d0e11` | `#181715` | Text rendered on top of yellow buttons |
| `--color-border` | `#282a32` | `#e2ded5` | Standard structural borders |
| `--color-border-subtle` | `#1f2127` | `#ede9e0` | Dividers and table horizontal rules |
| `--color-border-accent` | `rgba(252,236,77,0.35)` | `rgba(130,118,2,0.35)` | Highlighted card borders |
| `--color-success` | `#34d399` | `#059669` | Positive stock, profitable margins, cash paid |
| `--color-warning` | `#f59e0b` | `#d97706` | Low stock warnings, GST due reminders |
| `--color-danger` | `#f87171` | `#dc2626` | Out of stock, deficit margins, cancellations |
| `--color-info` | `#60a5fa` | `#2563eb` | Informational badges and bank transfers |

---

## 3. Light Mode & Dark Mode

- **Light Mode (`[data-theme="light"]`):** Warm off-white limestone foundation (`#f7f6f2`), pure white cards (`#ffffff`), dark high-contrast typography (`#181715`), antique gold accent text (`#827602`), and subtle warm olive borders (`#e2ded5`).
- **Dark Mode (`[data-theme="dark"]`):** Deep obsidian neutral (`#0d0e11`), raised cards (`#14161a`), warm yellow accent highlights (`#fcec4d`), crisp muted borders (`#282a32`), and diffused ambient glow.
- **Theme Persistence:** Controlled via `ThemeContext.jsx` using `localStorage.getItem('bizpartner_theme')` and dynamic `data-theme` attribute toggling on the `<html>` root.

---

## 4. Typography

### Font Stacks
- **Display / Editorial:** `'Newsreader', 'Playfair Display', Georgia, Cambria, 'Times New Roman', serif;`
- **Body / Interface:** `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;`
- **Monospace / Numerical:** `'JetBrains Mono', 'Fira Code', Menlo, Consolas, monospace;`

### Type Scale
- **Display Hero:** `44–64px` (`var(--font-size-display)`) — Used on the login landing statement.
- **Page Title (H1):** `32–44px` (`var(--font-size-h1)`) — Major section titles rendered in editorial serif.
- **Section Title (H2):** `24–32px` (`var(--font-size-h2)`)
- **Card Title (H3):** `15–16px` (`font-weight: 700`) — Crisp sans-serif for dashboard card headers.
- **Metric Value:** `26–28px` (`font-weight: 700`) — Clean sans-serif with tight tracking for immediate readability.
- **Body:** `14–15px` (`var(--font-size-body)`) — High-legibility sans-serif.
- **Small / Metadata:** `12–13px` (`var(--font-size-sm)`)

---

## 5. Architectural Grid & Warm Diffused Glow

### Grid Background
Generated completely in CSS via dual repeating linear gradients:
```css
background-image: 
  linear-gradient(to right, var(--color-grid-line) 1px, transparent 1px),
  linear-gradient(to bottom, var(--color-grid-line) 1px, transparent 1px);
background-size: 48px 48px;
```
Non-distracting, responsive, and available in both light and dark themes.

### Soft Warm Glow
Positioned strategically behind hero blocks, the executive dashboard header, and the AI assistant:
```css
.warm-glow-container::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 20%;
  right: 20%;
  height: 220px;
  background: radial-gradient(ellipse at center, var(--color-glow) 0%, transparent 70%);
  filter: blur(40px);
}
```

---

## 6. Spacing, Radius & Shadows

### Spacing Scale
Based around a consistent geometric progression:
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px
- `--space-7`: 64px

### Border Radii
Restrained, architectural borders avoiding exaggerated bubble cards:
- `--radius-xs`: 4px (micro tags, table badges)
- `--radius-sm`: 6px (buttons, inputs, select fields)
- `--radius-md`: 10px (dashboard cards, table containers)
- `--radius-lg`: 14px (modals, AI assistant drawer)
- `--radius-full`: 9999px (pills, status dots)

### Shadows
- `--shadow-xs`: `0 1px 2px rgba(0, 0, 0, 0.35)`
- `--shadow-sm`: `0 2px 5px rgba(0, 0, 0, 0.45)`
- `--shadow-md`: `0 6px 16px -2px rgba(0, 0, 0, 0.55)`
- `--shadow-lg`: `0 16px 32px -4px rgba(0, 0, 0, 0.65)`

---

## 7. Core Component System

1. **AI Business Insight (`AIInsight.jsx`):**
   - Distinctive brand identity for BizPartner AI.
   - Yellow accent left border (`border-left: 4px solid var(--color-accent)`).
   - Editorial italic quotation from live store data.
   - Actionable CTAs (*"Review Recommendations →"*, *"Ask AI Assistant →"*).

2. **Minimal KPI Cards (`StatCard.jsx`):**
   - Neutral surface background.
   - Strong numerical typography.
   - Small semantic accent indicator (green, orange, red, blue, purple).
   - Trend velocity percentage and comparison subtext.

3. **Status Badges (`StatusBadge.jsx`):**
   - Restrained semantic badges for `IN STOCK`, `LOW STOCK`, and `OUT OF STOCK`.
   - Subtle background tints with crisp 1px borders.

4. **Point of Sale (POS) Counter (`SalesPage.jsx`):**
   - Optimized for cashier speed and multi-item throughput.
   - Left pane: Catalog item selector, quantity stepper, custom unit pricing, and active line item cart.
   - Right pane: Customer selector, tender mode pills (UPI, Cash, Card, Bank Transfer), subtotal, tax breakdown, and 1-click checkout.

5. **AI Assistant Workspace (`AiAssistantModal.jsx`):**
   - Editorial header: *"BIZPARTNER AI — Your Business Intelligence Partner"*.
   - Contextual message classification (Normal, Business Insight, Recommendation, Alert).
   - Suggested prompt chips (*"Which products should I purchase?"*, *"What is my current stock?"*, *"How was my sales performance this month?"*).
   - Integrated Web Speech API for voice interactions in 23 languages.

---

## 8. Multilingual Architecture & RTL Support

- **23 Supported Languages:** English + all 22 official Eighth Schedule Indian languages (*Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu*).
- **RTL Layout Mode:** Native Right-to-Left directional rendering for Urdu, Kashmiri, and Sindhi via `[dir="rtl"]` CSS rules.
- **Fluid Layouts:** No fixed-width labels that truncate when translated into longer regional terms.

---

## 9. Animation Principles & Accessibility

- **Duration:** 150ms to 240ms cubic-bezier transitions for micro-interactions (hovers, focus, clicks).
- **Subtlety:** Micro-animations emphasize data change and interactive focus rather than distracting decoration.
- **Accessibility:** Full compliance with `prefers-reduced-motion: reduce`, visible high-contrast focus rings (`:focus-visible`), and semantic HTML elements.
