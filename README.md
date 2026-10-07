# pico-panic

PICO PANIC — English microgame arcade.

An original browser game with eight English-learning mechanics and 64 questions, a timed arcade round, practice, and a retry mode for missed questions.

## Run locally

Serve this repository with any static web server, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/. No build step or package installation is required. The entry point is `index.html`.

## GitHub Pages

Publish the `main` branch from the repository root (`/`). All app asset references are relative, so the app supports the repository's GitHub Pages subpath. `.nojekyll` preserves the static files as-is.

## Features and privacy

- Robot directions, packing, word order, clocks, café quantities, conversations, spatial placement, and city switches
- Three untimed introductory practice questions, slow mode, pause/resume, and review explanations
- Keyboard controls for the robot and tap controls throughout
- Optional English speech with the complete written prompt always visible
- Preferences and high scores stored locally in the browser; no cloud synchronization
- No runtime dependencies, trackers, external fonts, API keys, or external data requests

Hero artwork was generated for this original app. Sound effects are synthesized. Speech and emoji availability depend on the browser and operating system.
