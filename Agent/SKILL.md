---
name: stylish-dev-portfolio
description: Design and build a stylish, animated portfolio website for a web developer or software developer, with a curated color palette, page-load animation, scroll-triggered animation, and hover effects. Use this skill whenever the user asks for a developer portfolio, personal website, "my site as a dev", a project showcase, or wants a portfolio that looks modern, polished, animated, or "stylish", even if they never mention animation or palettes. Also use when they ask for a color palette for a developer website or want to add load, scroll, or hover animations to an existing portfolio.
---

# Stylish Dev Portfolio

Build a portfolio that feels crafted: confident color, expressive type, and one coherent motion language that plays on **page load**, **scroll**, and **hover**. The user explicitly wants animation in all three, so deliver it, but keep it a single system, not scattered effects.

## 1. Quick discovery

Infer from the conversation; ask at most one short batch of questions.

- Name, specialty (frontend, full-stack, backend, mobile, creative dev), and stack
- Goal: get hired, win freelance clients, build reputation
- 3 to 5 best projects with role and outcome (use clearly marked placeholders if missing)
- Links: GitHub, LinkedIn, email, résumé
- Palette mood preference (see section 2). If none is given, pick one and say why.

## 2. Palette: pick one, commit to it

Palette rules:
- 5 to 6 named tokens: `bg`, `surface`, `text`, `muted`, `accent`, `accent-2`.
- Text on `bg` must pass WCAG AA (4.5:1). Accent on `bg` must pass at least 3:1 for large text and UI, 4.5:1 for small text.
- Use accent for actions, links, and one hero moment. Use `accent-2` only for secondary highlights or a single gradient. Never more than two accents.
- Avoid pure `#000` and pure `#fff`. Slightly tinted neutrals feel more expensive.
- Gradients: one, used once (hero word, a glow, or the progress bar), never as decoration on every card.

### Curated presets

| Name | Mood | bg | surface | text | muted | accent | accent-2 |
|---|---|---|---|---|---|---|---|
| **Deep Ocean** (default for most devs) | Trustworthy, technical, calm | `#0B1220` | `#121B2E` | `#E8EEF9` | `#8A97B2` | `#4F8CFF` | `#7CF3D0` |
| **Violet Dusk** | Creative, frontend, design-minded | `#120E1F` | `#1B1530` | `#F2EEFF` | `#9C93BA` | `#9B7BFF` | `#FFB86B` |
| **Graphite & Amber** | Backend, systems, serious | `#15161A` | `#1E2026` | `#EDEDEF` | `#9A9CA6` | `#FFB454` | `#5BD1C0` |
| **Forest Signal** | DevOps, data, open source | `#0C1512` | `#13211C` | `#E6F2EC` | `#86A094` | `#3DDC97` | `#F2D16B` |
| **Paper & Cobalt** (light) | Clean, editorial, approachable | `#F6F7FB` | `#FFFFFF` | `#0F1424` | `#5B6478` | `#2F4BFF` | `#FF5C8A` |
| **Mono & Coral** (light) | Minimal, bold, confident | `#FAFAF9` | `#FFFFFF` | `#16161A` | `#646470` | `#FF5A4E` | `#2B2B33` |

### How to choose
1. Frontend, creative, or UI-focused: Violet Dusk or Paper & Cobalt.
2. Full-stack or generalist: Deep Ocean.
3. Backend, systems, security: Graphite & Amber.
4. DevOps, data, open source: Forest Signal.
5. Wants light and minimal: Mono & Coral.
6. The user names a color or brand: build a custom palette from it using the rules above, and show the 6 tokens.

Provide both a dark and a light value set when practical, switched by `prefers-color-scheme` and a manual toggle.

```css
:root {
  --bg: #0B1220; --surface: #121B2E;
  --text: #E8EEF9; --muted: #8A97B2;
  --accent: #4F8CFF; --accent-2: #7CF3D0;
  --border: color-mix(in srgb, var(--text) 12%, transparent);
  --radius: 14px;
  --ease: cubic-bezier(.22, 1, .36, 1);
  --dur-fast: 180ms; --dur: 520ms; --dur-slow: 900ms;
}
```

## 3. Typography

One or two typefaces, clearly distinct. Pick for personality, not defaults.
- Display: a characterful face for the name and section titles (examples: Space Grotesk, Sora, Bricolage Grotesque, Fraunces, Instrument Serif, Clash Display via fontshare).
- Body: a clean, readable face (Inter Tight, DM Sans, Manrope, Source Serif 4).
- Mono only where real code appears (JetBrains Mono, Geist Mono).
- Fluid scale with `clamp()`, hero headline roughly `clamp(2.8rem, 8vw, 7rem)`, tight tracking on large text, body at 1rem to 1.125rem, line length under 70 characters.
- Always include a fallback stack. If publishing in a restricted environment, only Google Fonts and system stacks are guaranteed.

## 4. Motion system

One language for the whole site: **smooth ease-out, short travel, staggered**. Animate only `transform` and `opacity` (plus `clip-path` and `filter` sparingly). Never animate `width`, `height`, `top`, or `left`.

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.22,1,.36,1)` | Everything entering |
| `--dur-fast` | 180ms | Hover feedback |
| `--dur` | 520ms | Reveals |
| `--dur-slow` | 900ms | Hero sequence |
| Stagger step | 70 to 90ms | Siblings |
| Travel distance | 16 to 28px | Reveal offset |

### 4a. Page load: one orchestrated hero sequence

Play once, about 1.2s total, then get out of the way.
1. Background glow or shape fades in (0ms).
2. Headline reveals line by line or word by word, masked rise from below (`clip-path` or `overflow: hidden` wrapper, `translateY(100%)` to `0`), 80ms stagger.
3. Subtitle and role fade up (+300ms).
4. Primary button and links fade up (+450ms).
5. Navigation slides down last (+600ms).

```css
.reveal-line { display: block; overflow: hidden; }
.reveal-line > span {
  display: inline-block;
  transform: translateY(110%);
  animation: rise var(--dur-slow) var(--ease) forwards;
  animation-delay: calc(var(--i, 0) * 80ms + 150ms);
}
@keyframes rise { to { transform: translateY(0); } }

.fade-up {
  opacity: 0; transform: translateY(20px);
  animation: fadeUp var(--dur) var(--ease) forwards;
  animation-delay: calc(var(--d, 0) * 1ms);
}
@keyframes fadeUp { to { opacity: 1; transform: none; } }
```

Set `style="--i:0"`, `--i:1`, and so on on spans, and `--d:450` on delayed elements.

### 4b. Scroll: reveal, progress, and one signature effect

**Reveal on enter** with `IntersectionObserver` (not scroll listeners). Reveal each element once.

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.setProperty('--stagger', `${(i % 4) * 80}ms`);
  io.observe(el);
});
```

```css
[data-reveal] {
  opacity: 0; transform: translateY(24px);
  transition: opacity var(--dur) var(--ease) var(--stagger, 0ms),
              transform var(--dur) var(--ease) var(--stagger, 0ms);
}
[data-reveal].in { opacity: 1; transform: none; }
```

**Scroll progress bar** (accent to accent-2 gradient, the one allowed gradient):

```css
.progress {
  position: fixed; inset: 0 0 auto 0; height: 3px; z-index: 50;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transform-origin: 0 50%; transform: scaleX(0);
}
```
```js
const bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  const p = scrollY / (document.documentElement.scrollHeight - innerHeight);
  bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
}, { passive: true });
```

**Pick one signature scroll effect** and do it well (modern CSS scroll-driven animations are fine with a fallback):
- Sticky stacked project cards that scale down slightly as the next one slides over.
- Horizontal scroll of the project strip pinned while vertical scroll continues.
- Headline words that shift from `muted` to `text` color as they pass the viewport center.
- Subtle parallax (max 40px) on one hero image or shape.

Also: nav gets a blurred, bordered background after 40px of scroll, and the active section link highlights.

### 4c. Hover: tactile and fast

Every interactive element gets feedback within 180ms. Include these:

- **Links**: underline draws left to right (`background-size` or `scaleX` on a pseudo-element).
- **Buttons**: lift 2px, accent glow shadow, optional magnetic pull toward the cursor (max 8px).
- **Project cards**: image scales to 1.05 inside an `overflow: hidden` frame, a cursor-following spotlight on the surface, optional 3D tilt (max 6 degrees), title arrow nudges right.
- **Nav items**: others dim to 60% opacity when one is hovered.
- **Custom cursor** (optional, desktop only): small dot that grows over interactive elements. Never hide the native cursor on touch or when `prefers-reduced-motion` is set.

```css
.link { position: relative; }
.link::after {
  content: ''; position: absolute; left: 0; bottom: -2px; width: 100%; height: 1.5px;
  background: var(--accent); transform: scaleX(0); transform-origin: right;
  transition: transform var(--dur-fast) var(--ease);
}
.link:hover::after { transform: scaleX(1); transform-origin: left; }

.card { position: relative; overflow: hidden; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius);
  transition: transform var(--dur-fast) var(--ease), border-color var(--dur-fast); }
.card::before { /* cursor spotlight */
  content: ''; position: absolute; inset: 0; opacity: 0; pointer-events: none;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%),
    color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%);
  transition: opacity var(--dur-fast);
}
.card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--accent) 50%, transparent); }
.card:hover::before { opacity: 1; }
```
```js
document.querySelectorAll('.card').forEach((c) => {
  c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});
```

Wrap hover-only effects in `@media (hover: hover) and (pointer: fine)` so touch devices do not get stuck states.

### 4d. Accessibility and performance guardrails (non-negotiable)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important;
  }
  [data-reveal], .fade-up, .reveal-line > span { opacity: 1; transform: none; }
}
```

- Content must be visible if JavaScript fails: add the hidden initial state only when `html.js` is present.
- Use `will-change` only on elements actively animating, and remove it after.
- Keep total motion tasteful: nothing loops endlessly except one optional, slow, low-contrast ambient element.
- Keep visible keyboard focus (`:focus-visible` ring in accent) and ensure hover effects have focus equivalents.

## 5. Page structure

1. **Hero**: name set large in the display face, one sentence on what they build, primary button ("View my work"), secondary link (GitHub or email). One memorable visual: an ambient accent glow, a subtle grid, a live mini-demo, or a bold type treatment. Run the load sequence here.
2. **Selected work**: 3 to 5 project cards (see below). The signature scroll effect lives here.
3. **About**: 3 to 6 first-person sentences, a portrait if available, headline words that brighten on scroll.
4. **Experience**: a short vertical timeline whose line draws as you scroll.
5. **Skills**: grouped plain-text chips (Daily, Comfortable, Learning). No progress bars. Chips lift on hover.
6. **Contact**: large email link with the underline-draw hover, social links, availability line. Footer with a back-to-top.

Navigation: sticky, minimal, 4 to 5 links, a theme toggle, and a primary "Contact" button.

### Project card contents
Outcome-oriented title, one line on the problem, role, stack chips, and links (live, code). Add a real screenshot or a short looping video muted and paused for reduced motion. Where possible, link to a case study with problem, key decisions, and measurable result.

## 6. Copywriting

- Plain, specific, active voice. "Built a checkout flow that cut drop-off by 18%," not "Passionate about great user experiences."
- No filler ("ninja," "rockstar," "cutting-edge," "passionate"). No fake typing taglines.
- Sentence case. Buttons say what happens ("View my work," "Email me," "Download résumé").
- Mark placeholder text clearly so the developer knows what to replace.

## 7. Build guidance

- Default: a single self-contained HTML file with inline CSS and JS (or Astro/Next.js if the user asks). No heavy animation libraries needed. If one is wanted, GSAP with ScrollTrigger is the best choice; pin the version and load from an allowed CDN.
- Tokens on `:root`, flat selectors, mobile-first, responsive from 360px, no horizontal scroll.
- Semantic HTML, one `h1`, logical heading order, alt text, `lang` attribute.
- Add `<title>`, meta description, Open Graph tags, an emoji or SVG favicon.
- Images with explicit dimensions and lazy loading. Lighthouse performance target above 90.
- When publishing as an artifact, follow the host's rules (self-contained file, pinned script versions, no remote images, both light and dark token sets, safe-area padding).

## 8. Process: plan, self-critique, build

1. **Plan** in a compact block: chosen palette (6 hex tokens and why), type pairing, layout concept with an ASCII wireframe of the hero, and the one signature scroll effect.
2. **Critique** against the brief: is the palette specific to this developer? Is every animation using the same easing and distances? Is there exactly one gradient and one memorable element? Revise and say what changed.
3. **Build** the page.
4. **Verify** with the checklist below and screenshot at desktop and mobile widths if the environment allows.

## 9. Final checklist

- [ ] Palette uses 6 tokens, passes AA contrast, and has at most two accents
- [ ] Load sequence plays once and finishes in about 1.2s
- [ ] Scroll reveals use `IntersectionObserver`, plus a progress bar and one signature effect
- [ ] Hover feedback on every link, button, and card, wrapped in `(hover: hover)`
- [ ] Only `transform` and `opacity` are animated for movement
- [ ] `prefers-reduced-motion` fully respected; content visible without JS
- [ ] Keyboard focus visible; touch targets at least 44px
- [ ] Responsive at 360px; no layout shift on load
- [ ] 3 to 5 real or clearly marked placeholder projects with role and outcome
- [ ] A "replace these" list delivered with the site

## Example prompts this skill handles

- "Make me a stylish portfolio with animations on load, scroll, and hover."
- "Pick a good color palette for my web developer website."
- "Add scroll animations and card hover effects to my existing portfolio."
- "Portfolio for a full-stack dev who uses React and Node, dark and modern."
