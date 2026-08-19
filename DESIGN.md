<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: bsky-svelte-feed
description: Personal moderation console for a Svelte-focused Bluesky custom feed
---

# Design System: bsky-svelte-feed

## 1. Overview

**Creative North Star: "The Ember Workshop"**

A one-person workshop lit by embers. Dark, warm surfaces where Svelte orange (#ff3e00) is not a garnish but a structural presence: it carries 30 to 60% of the interface through headers, active states, primary actions, and warm-tinted surfaces. The mood is calm and efficient, like the Bluesky app's friendly post rendering transplanted into a quieter, more personal dark room.

The system explicitly rejects: generic shadcn/Tailwind SaaS dashboards, enterprise admin-panel chrome (sidebars, breadcrumbs, data tables), and neon-on-black hacker aesthetics. This is a personal tool with warmth and opinion, never a corporate console.

**Key Characteristics:**
- Dark theme, neutrals tinted toward the orange hue (never pure black)
- Committed color strategy: orange is a surface, not just an accent
- Content-first: the post being moderated dominates; chrome recedes
- Responsive motion: actions feel acknowledged, nothing choreographed

## 2. Colors

Warm dark neutrals under a committed Svelte orange.

### Primary
- **Svelte Ember** (#ff3e00): the identity color. Carries primary actions, active states, and large committed areas (header bands, focus surfaces). [exact tonal ramp to be resolved during implementation]

### Neutral
- **Charcoal, orange-tinted** [to be resolved]: backgrounds and surfaces, chroma nudged toward hue ~35 so the dark never reads cold or pure black.
- **Warm text tones** [to be resolved]: off-white with a faint warm cast, never #fff.

### Named Rules
**The Committed Ember Rule.** Orange is structural, carrying 30 to 60% of the surface. Do not collapse it into a timid ≤10% accent.
**The No Pure Extremes Rule.** #000 and #fff are forbidden. Every neutral is tinted toward the ember hue.

## 3. Typography

**Body Font:** single warm humanist sans [pairing to be chosen at implementation, from Fontsource]
**Label/Mono Font:** monospace for handles, timestamps, and AT-proto identifiers only

**Character:** one voice, warm and legible; mono appears only where data precision matters (@handles, dates, DIDs).

### Named Rules
**The Mono Is Data Rule.** Monospace marks machine data (handles, timestamps, IDs), never headings or body copy.

## 4. Elevation

Flat by default. Depth is conveyed through tonal layering of the warm dark neutrals, not shadows. Shadows, if they ever appear, respond to state (hover, drag), never decorate.

## 5. Components

[No components exist yet; to be documented on the next scan-mode run.]

## 6. Do's and Don'ts

### Do:
- **Do** let Svelte Ember (#ff3e00) carry real surface area: headers, active states, primary buttons.
- **Do** tint every dark neutral toward the orange hue.
- **Do** make approve/delete actions instantly distinguishable and one click.
- **Do** respect `prefers-reduced-motion`; motion is feedback, not decoration.

### Don't:
- **Don't** build "generic shadcn/Tailwind SaaS dashboard" patterns: hero metrics, card grids, gradient accents.
- **Don't** add "enterprise admin panel" chrome: sidebars, breadcrumbs, dense data tables.
- **Don't** drift into "neon-on-black hacker vibes": no terminal green, no glow effects, no pure black.
- **Don't** use side-stripe borders, gradient text, or glassmorphism.
