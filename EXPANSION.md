# PICO PANIC expansion candidate

Base: `fe02e4cd07b38df9d5f1f5451b210eb7fde0dddf` (remote main verified by fresh clone, 2026-10-08). Independent checkout and branch `feat/multisubject-microgames`. No deployment or main update.

## Scope and learning model

Eight subjects, 352 question records. English 64, flags 36, geography 36, history 24, kanji 48, Japanese 24, mathematics 96, science 24. These counts include different activities applied to shared facts; they are not 352 unrelated facts. Flag activities cover 12 countries, geography covers 18 prefecture/capital pairs, and history covers 12 dated events. Science focuses on the eight planets; history focuses on Japan from the late Edo period through the early postwar Showa period. This is a compact expandable learning bank, not a complete school curriculum.

Subject and difficulty filters apply to ordinary rounds AND boss rounds. Mixed mode samples mechanics to prevent the larger mathematics bank from completely dominating. All existing English IDs are retained. A 60-second challenge leads into three boss stages while keeping the original three-life structure. Intro/practice has three untimed questions; the action encyclopedia lets users practice any mechanic individually. Retry is untimed and persists across reloads.

## 23 mechanics (no color variants counted)

| Mechanic | Operation | Learning application |
|---|---|---|
| move (existing) | Move a robot through sequential directions | English directions |
| pack (existing) | Collect and remove a set of items | English nouns/conjunctions |
| order (existing) | Build a sequence of word tokens | English syntax |
| clock (existing) | Adjust hour and minute hands | Time expressions |
| cafe (existing) | Independently adjust two quantities | English quantities |
| reply (existing) | Choose one response | Conversation and factual recall |
| place (existing) | Place an item relative to an anchor | Prepositions |
| switch (existing) | Toggle multiple independent states | English action instructions |
| line | Move a continuous slider with integer steps | Number line and addition |
| keypad | Construct a numeric answer digit by digit | Arithmetic and historical years |
| balance | Combine removable weighted pieces | Additive composition |
| paint | Paint equal-area segments | Fractions |
| timing | Stop a cycling display on the computed answer | Multiplication; manual equivalent for reduced motion |
| sort | Route a stream of cards into category bins | Parity classification |
| match | Select endpoints to connect all pairs | Flag/country, prefecture/city, planet/order |
| search | Find all target glyphs in a matrix | Character discrimination |
| memory | Reveal hidden cards two at a time | Flag recognition and spatial memory |
| echo | Observe, hide, and reproduce a sequence | Planet order and working memory |
| trace | Construct a path through adjacent valid cells | Even numbers and spatial planning |
| rotate | Rotate an object in 90-degree increments | Angles |
| swap | Exchange two positions in a jumbled string | Japanese word formation |
| erase | Remove redundant tokens while preserving a sentence | Japanese particles |
| type | Enter an unrestricted reading with IME support | Kanji reading |

All operations have tap or native keyboard controls. No drag gesture is mandatory. Reduced-motion timing has explicit advance/stop buttons and the same answer logic. Rotation still updates position without an animation. Portrait and landscape scroll vertically when needed rather than clipping controls.

## Data provenance and limitations

- Historical event years and eras: National Diet Library, [Modern Japan, chapter 1](https://www.ndl.go.jp/modern/cha1/index.html) and [Birth of the Constitution, chronology](https://www.ndl.go.jp/constitution/etc/history.html). Each historical question links its source in results and the saved notebook. The date of promulgation is distinguished from enforcement. No disputed ancient foundation date is used.
- Geography: [J-LIS prefectural offices](https://www.j-lis.go.jp/spd/code-address/todouhuken/cms_16914188.html). Questions use office municipalities. Tokyo and disputed territorial/border classifications are excluded.
- Flags: 12 real SVG designs from [flag-icons](https://flagicons.lipis.dev/) under MIT; included locally with the original notice in `assets/flags/LICENSE.txt`. No emoji substitutes, runtime CDN, or custom approximations. Images are the library's standardized 4:3 display variants, not lessons about official aspect ratios.
- Planet order: [NASA](https://science.nasa.gov/solar-system/planets/). Static order of eight planets; no mutable moon counts.
- Arithmetic examples are computed from integer operations. Japanese, kanji and English practice items are original authored exercises. Regional or alternate readings are avoided by wording the selected reading context.

## Audio and storage

`audio.js` composes original 16-step normal and boss patterns with Web Audio oscillators; no samples, third-party music, subscriptions or purchased material. Separate tap, correct, wrong, boss and victory sounds. A master volume controls both music and effects; speech uses the same saved volume. Speech ducks music, and cancellation/end/error restores it. Pause, home, tab hiding and page exit stop music and cancel speech. Initialization occurs on interaction. Browsers without AudioContext or speech continue with text.

`pico-panic-v1` remains in use without deletion or a format migration. Additional preferences, course best scores and up to 500 validated missed IDs use `pico-panic-academy-v2`. JSON parse failures, wrong field types, unknown IDs, blocked storage and invalid volumes fall back safely. Correct retry removes that item from the persistent notebook.

## Verification

Run `npm ci`, then `npm test`. Tests launch a dedicated headless Chromium/Edge process and a loopback-only server on 4181. No ordinary browser profile is touched. Set `PICO_BROWSER` to another Chromium executable when needed. `verification/results.json` records actual results; screenshots are in the ignored `verification/screenshots/` directory. This suite verifies all question controls, timeout behavior, pools/bosses, legacy/corrupt/blocked storage, retry, navigation, lifecycle, accessibility fallbacks and responsive widths.

No runtime npm dependencies or build step. Serve the repository root with `npm start` or any static server. Relative asset URLs retain GitHub Pages subdirectory compatibility.
