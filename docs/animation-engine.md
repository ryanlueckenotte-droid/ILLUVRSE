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

## Studio Dashboard

The Studio Dashboard (`/studio`) serves as the central creative hub for ILLUVRSE. It provides a visual overview of the entire creative pipeline and connects various specialized modules:

- **Chief of Staff:** Directing the creative process through prompt-driven workflows.
- **Canvas Lab:** Testing and interacting with the Drawing Command System.
- **Future Modules:** Integrated access to Scene Builder, Character Builder, Timeline Animation, Asset Management, and Export workflows.
- **Business Engine:** Linking creative output to digital business operations.

Studio is where the transition from a "chatbot" to a "creative operating system" becomes visible, mapping out the journey from a single prompt to a fully realized animated world.

## Current Next Step: Drawing Command System

ILLUVRSE now supports a command-driven drawing system. This is the bridge between AI prompts and animation.

- **Command-driven:** Every action on the canvas (drawing, clear, animation) is represented as a structured JSON command.
- **Scene State:** The canvas maintains a local scene object model, allowing objects to be tracked by ID.
- **Animation Tracks:** Animations are no longer hardcoded but are tracks that interpolate object properties over time.
- **Local-first & Portable:** Commands and scene states can be exported as JSON, making them saveable and reusable.
- **AI Foundation:** This provides a concrete "language" for the future AI Chief of Staff to control the creative studio.

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

**Status: v1 Implemented**
- Location: `/studio/scenes`
- Features: Editable scene properties, background mood, camera framing, character/prop metadata, and JSON export.
- JSON Format: Defines `background` (gradient + mood), `camera` (shot, angle, movement), `characters` array, `props` array, and production `notes`.

### Phase 4: Character Builder

Define character cards, model sheets, poses, expressions, and reusable rig parts.

**Status: v1 Implemented**
- Location: `/studio/characters`
- Features: Defines the first reusable character card format with identity, personality, visual style, expressions, poses, voice, and story function.
- JSON Format: Includes `version`, `id`, `name`, `role`, `species`, `personality` array, `visual` properties (colors, style, silhouette), `expressions` array, `poses` array, `voice` (tone, catchphrase), `storyFunction`, and `notes`.

### Phase 5: Script Builder

Define episode scripts, story beats, dialogue, and production notes.

**Status: v1 Implemented**
- Location: `/studio/scripts`
- Features: Editable script properties, characters list, multi-scene beats, structured dialogue, and JSON export.
- JSON Format: Includes `version`, `id`, `title`, `series`, `format`, `logline`, `theme`, `characters` array, `scenes` array (with `beats`), `dialogue` array (speaker, emotion, line), and `productionNotes` array.

### Phase 6: Storyboard Builder

Define panel-by-panel visual planning with shots, camera movement, action, dialogue, and timing.

**Status: v1 Implemented**
- Location: `/studio/storyboards`
- Features: Visual panel cards, selected panel editor, storyboard preview, and live JSON export.
- JSON Format: Includes `version`, `id`, `scriptId`, `title`, `series`, `format`, `panels` array (with `id`, `sceneId`, `title`, `description`, `shot`, `camera`, `characters` array, `dialogue`, `action`, `mood`, `durationSeconds`), and `productionNotes` array.

### Phase 7: Timeline Animation

Add keyframes, easing, timing, layers, playback, and frame inspection.

**Status: v1 Implemented**
- Location: `/studio/timeline`
- Features: Visual timeline tracks, percentage-based item blocks, temporal planning, selected item editor, and live JSON export.
- JSON Format: Includes `version`, `id`, `storyboardId`, `title`, `fps`, `durationSeconds`, `tracks` array (camera, character, dialogue, effects) with `items` (start, duration, label, action, panelId), and `productionNotes` array.

### Phase 8: Assets Library

Define reusable creative assets, paths, and relationships.

**Status: v1 Implemented**
- Location: `/studio/assets`
- Features: Reusable asset reference format with names, types, statuses, tags, styles, paths, linked objects, and production notes.
- JSON Format: Includes `version`, `id`, `title`, `project`, `assets` array (with `name`, `type`, `status`, `description`, `tags`, `style`, `path`, `linkedTo`), and `productionNotes` array.

### Phase 9: Export Planner

Package and publishing plan for multi-platform distribution.

**Status: v1 Implemented**
- Location: `/studio/exports`
- Features: Export target grid, multi-platform metadata, package options, and production/publishing notes.
- JSON Format: Includes `version`, `id`, `project`, `episodeTitle`, `sourceRefs`, `targets` array (platform, format, resolution, etc.), `package` options, and notes arrays.

### Phase 10: Project Bundle

Connect existing creative modules into a single episode manifest.

**Status: v1 Implemented**
- Location: `/studio/project`
- Features: Episode manifest that connects character, scene, script, storyboard, timeline, asset, and export IDs into one portable project bundle. Includes a visual pipeline view and manifest editor.
- JSON Format: Includes `version`, `id`, `title`, `series`, `episodeTitle`, `status`, `modules` (map of module IDs), `pipeline` array (step, route, status, summary), `nextActions`, and `productionNotes`.

### Local Save/Load v1

ILLUVRSE now supports browser-local persistence for all Studio modules.

**Status: v1 Implemented**
- Features: Save Locally, Load Saved, and Clear buttons added to all 8 core builders.
- Implementation: Uses a safe browser `localStorage` helper (`lib/localStudioStorage.ts`) with Next.js client-side only loading to prevent hydration issues.
- Dashboards:
  - Studio Dashboard (`/studio`): Displays "Saved" or "Not saved" badges for each module to show persistence status.
  - Project Bundle (`/studio/project`): Informs users that their manifest is stored in browser-local storage.
- Note: This is not filesystem persistence yet. Future versions will support local project folder save/load.

### Studio Quick Launch + Module Linking v1

The Studio dashboard now acts as the command center for the full local-first episode pipeline. The Project Bundle links all module routes together, providing a unified creative experience.

- **Quick Launch:** Direct access to all active modules from the Studio dashboard.
- **Current Episode:** A dedicated panel on the dashboard showing the status and metadata of the active project bundle.
- **Integrated Navigation:** Enhanced module linking within the Project Bundle manifest, allowing creators to jump between specialized builders while maintaining project context.

### Phase 11: Prompt-to-Storyboard

Convert a prompt into story beats, panels, scenes, and shot lists.

### Phase 12: Prompt-to-Animated-Short

Generate a short sequence from prompt to storyboard to animated canvas playback.

### Phase 13: Prompt-to-TV-Show Episode Engine

Assemble scripts, recurring characters, scenes, animation timelines, voice planning, export workflow, and review loops into a full local episode engine.

## Safety Rules

- Keep Playwright limited to localhost training pages for now.
- Do not automate account login.
- Do not automate posting, uploading, purchases, or messages.
- Do not add destructive file actions.
- Ask Ryan before any workflow crosses into external services or irreversible changes.
