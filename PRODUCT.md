# Product

## Register

product

## Users

A single user: the project maintainer, moderating a Svelte-focused Bluesky custom feed. Context: quick check-ins throughout the day (often evenings, dark room, sometimes from a phone) to clear a queue of pending posts. The job: scan a post, glance at Claude's auto-assessment, approve or delete, move to the next one. Low friction and fast triage beat feature richness.

## Product Purpose

A Bluesky (AT Protocol) custom feed generator with a human-in-the-loop moderation workflow. Jetstream ingests candidate posts, Claude pre-assesses them, and the `/approve` page lets the maintainer make the final call before posts appear in the feed. Success: the pending queue is cleared in seconds per post, with zero hesitation about what each action does.

## Brand Personality

Calm, efficient, personal. A well-kept personal workshop, not a corporate console. Quiet surfaces, decisive actions, a touch of Svelte identity through the `#ff3e00` orange accent. Dark mode as the home theme (evening triage in a dim room). Pleasant to look at, never showy.

## Anti-references

- Generic shadcn/Tailwind SaaS dashboard: hero metrics, card grids, gradient accents.
- Enterprise admin panels: sidebars, breadcrumbs, dense data tables, chrome everywhere.
- Neon-on-black hacker aesthetics: no terminal green, no glow effects.

## Design Principles

1. **Triage speed is the design.** Every screen optimizes for scan, decide, act. Actions are one click, clearly labeled, impossible to confuse.
2. **The post is the interface.** Content dominates; UI chrome recedes. No wrappers, panels, or navigation that the queue doesn't need.
3. **One accent, spent wisely.** Svelte orange marks identity and primary action, never decoration.
4. **Personal, not enterprise.** A tool for one person can afford warmth and opinion; it never needs to look "professional".
5. **Trust through clarity.** Claude's assessment is advice, visually subordinate to the human decision.

## Accessibility & Inclusion

Good defaults: WCAG-reasonable contrast, visible focus states, keyboard-operable actions, `prefers-reduced-motion` respected. No formal compliance target.
