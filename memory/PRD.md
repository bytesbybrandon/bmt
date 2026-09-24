# PRD — Brandon D. Phillips: "The Weaver's Sanctum"

## Original Problem Statement
"I want to build a personal website. I want there to just be a realistic spider web with a beautifully majestic and realist looking orb weaver that almost looks like a real spider on my computer sitting atop a beautiful spider web at night. I want the navigation to just appear as glimmering water droplets on the web. Navigation for: about, projects, timeline, skills, contact."

User refinements: Joro-style orb weaver (photoreal, not cartoonish/deformed); full-page web homepage with no scrolling; page transitions; spider eerily tracks cursor but stays still until a droplet is clicked, then swift jump-scare-like (but elegant) pounce; subtle motion (breathing legs, web sway, droplet shimmer); timeline = spider descending a silk thread past 6 long-term employers; minimal, elegant, professional; contact = socials list only.

## User Personas
- Brandon (owner): full-stack software engineer, 6 tenures, wants a portfolio that feels like a living nocturnal artifact.
- Visitors/recruiters: explore work, timeline, skills, and reach out via social channels.

## Architecture
- Frontend-only experience: React 19 + framer-motion + lenis (smooth scroll) + Tailwind. No backend APIs in use (server.py left as template health endpoints).
- Procedural canvas orb web (`SpiderWebCanvas`) with wind sway, cursor-proximity vibration, and pounce jolt impulses; geometry shared via `utils/webGeometry.js` so dewdrop nav snaps onto real thread intersections.
- AI-generated assets (Gemini Nano Banana via emergentintegrations, scripted in /app/scripts): photoreal Joro spider (alpha-cut via numpy/PIL luminance keying → spider-cut.png), night bokeh background, editorial portrait.
- View state machine in App.js with AnimatePresence transitions; quick re-entry choreography on return visits.
- Design system: /app/design_guidelines.json (Nocturnal Silken Amber; Playfair Display/Cormorant + IBM Plex Sans + JetBrains Mono).

## Implemented (2026-09-23)
- Full-viewport night scene: procedural swaying web, moonlit bokeh bg with parallax, drifting dust motes, grain overlay, vignette.
- Photoreal Joro orb weaver at the hub: cursor gaze tracking (subtle head tilt + eye glints), breathing scale, swift 420ms pounce to clicked droplet with web jolt + droplet burst → page warp.
- Dewdrop navigation (About/Projects/Timeline/Skills/Contact) snapped to web threads, shimmer + aura pulse, labels bloom on hover.
- About: editorial split, generated portrait in clipped frame, 3 numbered pillars, stats band.
- Projects: 5 numbered editorial dossiers with hover-expanding details, metrics chips, stack tags.
- Timeline: scroll-driven spider descending a glowing silk dragline past 6 milestones; Dossier (resume) toggle view.
- Skills: 4 groups × 5 silk-gauge meters (scaleX animation).
- Contact: social link rows (GitHub/LinkedIn/X/Email), PGP identity block, location.
- Custom reticle cursor, masked line-by-line heading reveals, lenis momentum scrolling.
- Fixes: transparent spider alpha cutout (mix-blend approach removed); framer-motion mixed-unit unmount crash (width 0→% and y %→0 replaced with scaleX and "0%"); fast home re-entry so droplets are instantly clickable on return.

## Implemented (2026-09-23, iteration 2)
- Ambient soundscape (Web Audio, fully synthesized, no assets): low night drone (detuned sines + filtered brown-noise wind with slow swells), pentatonic droplet chimes on select, soft tick on droplet hover, bandpass whoosh on pounce. Droplet-styled sound toggle (bottom-right), preference persisted in localStorage, auto-arms on first gesture if previously enabled.
- Pounce finale: after the strike the spider spins 360° while an SVG silk spiral wraps the struck droplet (pathLength draw, ~0.6s), droplet dims, then burst → page warp (nav delayed to ~1s to fit the choreography).

## Implemented (2026-09-23, iteration 3)
- Real content from master_profile.md: 5 tenures (ByteQuilt, Strategic Data Systems, DocuSign, Philips Healthcare, Microsoft), 7 projects (Reactive Skills with docs/GitHub/registry links, LumineDB, Bergcache, Formicary, MLS streaming pipeline, tttui-axi, progressive-depth), real socials (github.com/bytesbybrandon, linkedin.com/in/bdphillips, bytesbybrandon.com, brandon@bytesbybrandon.com), education, real skill taxonomy. Phone number and street address excluded per user request. Copy scrubbed of em dashes and banned vocabulary per brandon-voice rules. Fabricated portrait replaced with the orb weaver cutout; fake PGP block replaced with availability note.
- Downloadable PDF dossier (jsPDF, client-side): dark-styled multi-page resume with amber accents, timeline, works, skill gauges, signals, education. Button in Timeline Dossier view (data-testid btn-download-dossier). Verified: brandon-phillips-dossier.pdf downloads.
- WebGL web renderer (SpiderWebGL): GPU line renderer with per-vertex sway/jolt/vibration in the vertex shader and specular moonlight highlights in the fragment shader (threads perpendicular to the light direction catch a sheen; cursor proximity adds a warm glint). Doubled-pass geometry for hairline weight at high DPR. Falls back to the Canvas2D renderer if WebGL is unavailable or context is lost. Fixed a StrictMode double-mount bug where loseContext() killed the context on remount.
- Theme system (utils/theme.js): Night / Day / Auto Sky toggle (droplet button, persisted). Auto Sky computes a continuous daylight phase from visitor local time (dawn 6-9, dusk 17-20 smoothsteps), blending a generated daytime garden-bokeh background and page lightness; day theme flips silk to dark strands, text to ink, amber accents to bronze. Verified in both modes.

## Implemented (2026-09-23, iteration 4)
- WCAG 2.2 contrast pass: raised every sub-4.5:1 text token in both themes (droplet labels, HUD, eyebrows, year/category/company/tenure labels, stack tags, stat cells, contact identity), added day-mode ink palette + solid bronze ambers, day stat-cell background override, and global :focus-visible amber focus rings. Verified with an in-page computed-contrast audit (effective color x opacity vs effective background) across all 5 views in both themes: 0 failures.
- Timeline corrected per user: added missing first Philips stint (2008-2010, role/impact inferred, confirm with user), six tenures, EST. 2008, 18 years. Timeline spider now hangs head-down (180deg rotation with pendulum sway) like a real descending orb weaver.
- Fixed pounce choreography bug: onAnimationComplete waited for the slow entrance opacity animation, stalling navigation ~1.6s and leaving a blank screen in fast click sequences. Pounce, wrap, burst, and page warp now run on deterministic timers (nav at click+1.45s).
- Web subtlety tuned per user feedback: thread alphas reduced (radials 0.16, spirals 0.115-0.25 with cursor glint and moonlight specular intact) so the web reads like a real one you almost miss; day-mode multiplier lowered to match.

## Implemented (2026-09-23, iteration 5)
- Dawn grading: Auto Sky now grades through a warm amber mid-palette at dawn/dusk (three-stop background night -> amber dusk -> day, amber horizon glow overlay peaking mid-transition, silk threads tinted warm via uDusk shader uniform). Grading math verified (dawn 7:30 = phase 0.5, dusk 18:30 = 0.5, bg stops rgb(5,7,9) / rgb(64,42,34) / rgb(234,229,217)).
- Thread physics: landing jolt replaced with a true damped elastic oscillation (exp(-3t) * cos(12t)) triggered at the moment the spider touches down, so strands bounce and settle like a real web absorbing the strike; applied to both the WebGL shader and the Canvas2D fallback.

## Implemented (2026-09-23, iteration 6)
- Dusk chimes: droplet chime pitch warms (down to -16%) and decay stretches as the sky grades through dawn/dusk, driven by the same dusk factor as the visual grading.
- Morning dew: a time-based dew level (peaks 1.0 at ~7:30, evaporates to 0.35 by midday, reforms to 0.75 overnight; forced Night = 0.75, forced Day = 0.35) drives droplet size (13-24px range) and glow intensity via a --dew CSS variable. Aura pulse reworked to filter brightness so it composes with the dew-driven shadow.

## Implemented (2026-09-23, iteration 7)
- Seasonal color casts: hemisphere inferred from visitor timezone (southern-region hint list), season from month (winter ice-blue, spring green, summer gold-green, autumn rust), applied as a subtle full-scene tint overlay that scales with the day phase, plus the current season name in the home HUD ("The Weaver's Sanctum · Autumn"). Month mapping and hemisphere flip verified (Sydney July = Winter, Sydney Jan = Summer).
- Silk cocoons: each of the 6 timeline milestones now hangs a silk cocoon pod (SVG, theme-aware --silk-cocoon strokes) on the strand that shimmers and straightens as the descending spider reaches it.

## Implemented (2026-09-23, iteration 8)
- Seasonal particles: the sky canvas now drifts season-specific particles over the scene: winter snow motes, autumn tumbling leaves, spring rising pollen, summer blinking fireflies (fireflies dim in daylight, all particles soften in day mode).
- Cocoon hatch: once the descending spider inspects a cocoon it stays amber-lit for the rest of the session (module-level visited set survives page navigation), marking the milestones you have already read.

## Implemented (2026-09-23, iteration 9)
- Leaf landing: in autumn, occasional leaves (~25% of drifters, only when a web thread lies below their fall line) drift onto a thread of the web, catch, tremble in place for 1.6-3.4s, then slip free. The landing fires a leaf-land event that makes the WebGL web tremble locally around the catch point (damped oscillation in the vertex shader). Fixed a re-catch loop found in soak testing (leaves re-stuck every ~2s at the same spot; now one catch per fall).

## Verification
- All 5 droplet navigations + returns loop-tested with zero page errors; dossier toggle verified; contact links verified; timeline descent verified mid-scroll; 1920px screenshots for all views.

## Backlog
- P0: Replace placeholder content (real projects, employers, socials, portrait) with Brandon's real data. — DONE 2026-09-23 (master_profile.md imported; portrait intentionally shows the spider until a real photo is provided)
- P0: Confirm inferred descriptions for tttui-axi and progressive-depth (written from repo names).
- P1: Ambient sound design (night drone + droplet chime) with mute toggle. — DONE 2026-09-23 (synthesized Web Audio soundscape, toggle persisted)
- P1: Real resume PDF download in Dossier view. — DONE 2026-09-23 (client-side jsPDF, site-styled)
- P2: Optional WebGL web upgrade (thread specular highlights). — DONE 2026-09-23 (SpiderWebGL with moonlight specular + cursor glint)
- P2: A dawn/dusk mid-palette so Auto Sky transitions feel graded, not just light/dark.
