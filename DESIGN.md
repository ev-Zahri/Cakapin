---
name: Belajar Seru
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#3f4a36'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#6f7b64'
  outline-variant: '#becbb1'
  surface-tint: '#2b6c00'
  primary: '#2b6c00'
  on-primary: '#ffffff'
  primary-container: '#58cc02'
  on-primary-container: '#1e5000'
  inverse-primary: '#6be026'
  secondary: '#755b00'
  on-secondary: '#ffffff'
  secondary-container: '#fec700'
  on-secondary-container: '#6e5400'
  tertiary: '#006590'
  on-tertiary: '#ffffff'
  tertiary-container: '#4abdff'
  on-tertiary-container: '#004a6b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#87fe45'
  primary-fixed-dim: '#6be026'
  on-primary-fixed: '#082100'
  on-primary-fixed-variant: '#1f5100'
  secondary-fixed: '#ffdf92'
  secondary-fixed-dim: '#f4bf00'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#594400'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#88ceff'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  headline-xl:
    fontFamily: Nunito Sans
    fontSize: 40px
    fontWeight: '900'
    lineHeight: 48px
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 20px
  label-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 18px
  label-sm:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '800'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets language learners seeking an encouraging, bite-sized, and friction-free learning habit. It delivers a hyper-tactile, gamified aesthetic that feels physical, resilient, and instantly rewarding. The interface leans into a contemporary **tactile vector/gamified neo-brutalist hybrid**: thick bottom borders that act as physical extrusions, bold rounded geometries, vivid flat fills, and instant micro-feedback.

The emotional core is optimistic, celebratory, and resilient. Making an error never feels punishing; achievements feel crisp, loud, and satisfying. Visual cues borrow from tactile physical game tokens, rubbery stamp buttons, and clear plastic badges to establish trust, energy, and relentless forward momentum.

## Colors

The palette is driven by purpose-built functional hues grounded in high-contrast neutrals. Every active color has a corresponding "shadow/edge" value (typically 12–18% deeper in shade) to render the tactile 3D extrusions:

- **Primary Green (`#58CC02` / Edge: `#46A302`):** Core call-to-actions, progression steps, lesson completion states, and success confirmations. Indonesian label: *Lanjut*, *Mulai*, *Selesai*.
- **Streak Yellow (`#FFC800` / Edge: `#E5A500`):** Streaks, XP boosts, and celebration crowns. Indonesian label: *Rangkaian*, *Poin XP*.
- **Gem Sky Blue (`#1CB0F6` / Edge: `#1899D6`):** Currency, quest chests, leaderboard tiers, and unit milestones. Indonesian label: *Permata*, *Misi*.
- **Life Ruby Red (`#FF4B4B` / Edge: `#EA2B2B`):** Health hearts, urgent alerts, error boundaries, and streak freezes. Indonesian label: *Nyawa*, *Coba Lagi*.
- **Tactile Neutral Canvas:** 
  - Base canvas: `#FFFFFF` and off-white background `#F7F7F7`.
  - Divider & Border Outline: `#E5E5E5` for passive boundaries, `#CECECE` for card base extrusions.
  - Ink/Typography: Active dark slate `#4B4B4B` for primary titles; secondary muted charcoal `#777777` for metadata.

## Typography

Nunito Sans provides the soft, friendly terminal curves essential for an approachable education interface, balanced by assertive heavyweight geometry (weights 700 to 900) that keeps gamified labels sharp and legible at a glance.

- **Headlines (`headline-xl`, `headline-lg`, `headline-md`):** Used for unit titles (*Unit 3: Memesan Makanan*), victory modals (*Pelajaran Selesai!*), and milestone achievements. High weight creates an anchor for large animated badges.
- **Labels (`label-lg`, `label-md`, `label-sm`):** All button actions, tab identifiers, and game stats use bold, punchy casing. Tracking is slightly loosened (`+0.5px`) on uppercase pill badges (*LEVEL 4*, *SEMPURNA*).
- **Body (`body-lg`, `body-md`, `body-sm`):** Retains weight `600` for primary exercise sentences to ensure effortless readability on desktop monitors without feeling faint.

## Layout & Spacing

The desktop layout relies on a fixed-width 3-pane structure optimized for desktop web viewports (1024px to 1440px wide):

1. **Left Navigation Rail (Fixed width: 256px):** Persistent vertical navigation containing high-contrast icons and chunky text links (*Belajar*, *Papan Peringkat*, *Misi*, *Toko*, *Profil*).
2. **Central Quest Path (Flexible: 560px–640px max):** Contains the stepped learning track (the stepping-stone "pathway" nodes) and lesson review blocks.
3. **Right Stat Widgets Panel (Fixed width: 340px):** Sticky container holding Daily Goals (*Target Harian*), Streak Status (*Rangkaian Aktif*), Gems Counter, and Leaderboard Sneak Peeks.

Spacing rhythm strictly operates on multiples of 4px and 8px. Outer margins safeguard content from screen boundaries, while component gaps (`space-md`, `space-lg`) provide comfortable tap/click targets and ample breathing room between rich game widgets.

## Elevation & Depth

This system avoids blurry, diffuse ambient shadows entirely. Instead, depth is conveyed through **Tactile Extrusion Physics**:

- **Physical Extrusion:** Elements have a crisp solid outline of 2px (`#E5E5E5` or darker) paired with a solid bottom border of 4px to 5px in an anchored deeper shade. 
- **The Click Plunge:** On hover, clickable surfaces shift brightness slightly (+4%). On `:active` (mouse press), the element translates vertically down by 3px (`transform: translateY(3px)`), and its bottom extrusion shrinks from 4px to 1px, providing instantaneous, game-like haptic feedback on a flat desktop screen.
- **Surface Layering:** Modal sheets and popovers feature a 2px boundary with a solid 0px blur, 6px offset shadow (`box-shadow: 0 6px 0 rgba(0, 0, 0, 0.2)`).

## Shapes

The design language favors soft, organic, yet structured curvatures (`roundedness: 3`).

- **Pills and Bubbles:** Buttons, metric counters, chips, and progress wrappers employ maximum pill radius (`9999px` or `rounded-xl`).
- **Cards and Dialog Containers:** Exercise prompts, speech bubbles, and quest cards utilize `rounded-lg` (1.5rem to 2rem) to maintain an approachable, friendly silhouette that matches character illustrations.
- **Speech Bubble Indicators:** Character prompt containers include integrated bottom or side directional pointer carets with rounded apexes.

## Components

### Chunky 3D Buttons
- **Primary Action (*Lanjut* / *Periksa*):** Solid `#58CC02` face, 2px `#46A302` outer border, 4px solid bottom border (`#46A302`), bold white uppercase Nunito Sans typography. Hover brightens; active state pushes down 3px with 1px border.
- **Secondary / Option Choice:** White surface, 2px border `#E5E5E5`, 4px bottom border `#E5E5E5`, text `#4B4B4B`. Selected state changes border to `#1CB0F6` with sky blue tint fill (`#DDF4FF`) and 4px bottom border `#1899D6`.
- **Destructive (*Coba Lagi*):** `#FF4B4B` surface with `#EA2B2B` 4px bottom border.

### Pill Badges & Status Counters
- Top status rail capsules with icon prefixes: Flame icon + Streak number (*14 Hari*), Gem icon + Value (*1.250*), Heart icon + Count (*5*).
- Encased in a 2px `#E5E5E5` pill with subtle inset padding (`space-xs space-md`).

### Exercise Multiple Choice Cards
- Rectangular blocks with large rounded corners (16px).
- Hotkey badges (e.g., `1`, `2`, `3`) anchored on the left inside a 28px square with 2px border.
- Card responds to click by depressing downward into its own bottom border.

### Cheerful Progress Bar
- 16px height track with complete pill rounding (`border-radius: 9999px`).
- Background track: `#E5E5E5`.
- Active fill: `#58CC02` with an inner 4px white glossy highlight stripe running along the top half for a rounded rubbery tube appearance.

### Unit Milestone Pathway Nodes
- Circular 64px diameter interactive buttons sitting on the central learning snake.
- Active node pulses with an animated ring and crowns. Completed nodes show solid green with golden stars. Locked nodes render in disabled tactile slate gray (`#E5E5E5` with `#CECECE` bottom rim).

### Feedback Drawer (Footer Bar)
- Full-bleed or card-bound bottom container revealed upon answering.
- **Correct State:** `#D7FFB8` background, `#58CC02` bold copy (*"Luar biasa!"* or *"Kerja bagus!"*), accompanied by checkmark token and green *Lanjut* button.
- **Incorrect State:** `#FFDFE0` background, `#FF4B4B` bold copy (*"Jawaban yang benar:"*), along with red *Mengerti* button.