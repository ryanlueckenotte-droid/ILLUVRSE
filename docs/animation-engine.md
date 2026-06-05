# ILLUVRSE Animation Engine Roadmap

ILLUVRSE is moving from local chief-of-staff chatbot toward a local AI-controlled creative studio.

## Product Direction

```text
Prompt
  -> ILLUVRSE Chief of Staff
  -> Story / script / characters / scenes
  -> Drawing engine
  -> Animation engine
  -> Browser automation via Playwright
  -> Export animated episode
```

## Roadmap

### Phase 1: Browser Automation Lab

Teach ILLUVRSE safe browser control on localhost pages:

- Open a local browser.
- Inspect page structure.
- Click buttons.
- Fill safe local forms.
- Take screenshots.
- Save observations.

### Phase 2: Canvas Drawing Tools

Build drawing controls for primitives, paths, layers, colors, and reusable assets.

### Phase 3: Scene Builder

Create a structured scene format with backgrounds, props, characters, camera framing, and shot metadata.

### Phase 4: Character Builder

Define character cards, model sheets, poses, expressions, and reusable rig parts.

### Phase 5: Timeline Animation

Add keyframes, easing, timing, layers, playback, and frame inspection.

### Phase 6: Prompt-to-Storyboard

Convert a prompt into story beats, panels, scenes, and shot lists.

### Phase 7: Prompt-to-Animated-Short

Generate a short sequence from prompt to storyboard to animated canvas playback.

### Phase 8: Prompt-to-TV-Show Episode Engine

Assemble scripts, recurring characters, scenes, animation timelines, voice planning, export workflow, and review loops into a full local episode engine.

## Safety Rules

- Keep Playwright limited to localhost training pages for now.
- Do not automate account login.
- Do not automate posting, uploading, purchases, or messages.
- Do not add destructive file actions.
- Ask Ryan before any workflow crosses into external services or irreversible changes.
