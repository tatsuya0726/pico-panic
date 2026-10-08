# PICO PANIC

An original, mobile-friendly learning microgame arcade: **8 subjects, 23 mechanics, 352 question records**. This branch is a candidate expansion; it has not been deployed.

English, real national flags, Japanese history, geography, mathematics, Japanese language, kanji and science. Pick a subject and difficulty, or mix everything. The 60-second challenge leads into a three-stage boss with three lives. Practice and saved missed-question retry are untimed.

## Run

No build or runtime dependency is required. Serve the repository root with any static server, or run `npm start`, then open `http://127.0.0.1:4178/`. All assets are local and relative; the app also supports the `/pico-panic/` GitHub Pages subpath.

## Verify

Run `npm ci` followed by `npm test`. The tests use a separate headless Edge process on Windows. Set `PICO_BROWSER` to an installed Chromium executable on another system. Tests start their own loopback server on port 4181, solve every question through UI controls and exercise lifecycle, storage and responsive layouts. Results: `verification/results.json`. Screenshots: `verification/screenshots/` (not committed).

## Accessibility, privacy and audio

- Tap and native keyboard controls, visible focus, optional slow mode and reduced motion.
- Full written questions; English speech is optional. No sound is required to answer.
- Original Web Audio normal/boss music and five effect cues. Saved mute and volume; speech ducks music. Pause/background/page exit stop playback.
- Existing `pico-panic-v1` preferences and scores are preserved. New course preferences and the persistent mistake notebook use a separate validated storage key.
- No trackers, API keys, cloud saves, remote fonts or runtime asset requests.

See [EXPANSION.md](EXPANSION.md) for every mechanic, question counts, scope, source links, storage behavior and test details. History currently covers Japan from late Edo through early postwar Showa; science focuses on the planets. Question counts include repeated facts explored through different operations, not a complete school curriculum.

## Assets

Hero artwork was generated for the original app. All music/effects in `audio.js` are originally composed oscillator synthesis, with no external samples. Twelve flag SVGs are redistributed from **flag-icons** under MIT; the original copyright and license are preserved in [assets/flags/LICENSE.txt](assets/flags/LICENSE.txt). The app links the flag source and authoritative factual sources in relevant review entries.

Publishing is separate from this candidate. No `main` update, push or deployment has been performed.
