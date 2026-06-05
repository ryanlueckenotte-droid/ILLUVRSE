import {
  ProjectBundle,
  Character,
  Scene,
  Script,
  Storyboard,
  Timeline,
  AssetLibrary,
  ExportPlan
} from "./studioTypes";

/**
 * ILLUVRSE Studio - Shared Default Models v1
 * Central source of truth for initial module states.
 */

export const DEFAULT_PROJECT_BUNDLE: ProjectBundle = {
  version: 1,
  id: "project-illuvrse-core-episode-001",
  title: "ILLUVRSE Core Episode 001",
  series: "ILLUVRSE Core",
  episodeTitle: "Otter Core Awakens",
  status: "planning",
  localFirst: true,
  modules: {
    characterId: "otter-ai",
    sceneId: "scene-001",
    scriptId: "episode-001",
    storyboardId: "storyboard-episode-001",
    timelineId: "timeline-episode-001",
    assetLibraryId: "assets-illuvrse-core",
    exportPlanId: "export-episode-001"
  },
  pipeline: [
    {
      step: "Character",
      route: "/studio/characters",
      status: "ready",
      summary: "Reusable otter AI guide character card."
    },
    {
      step: "Scene",
      route: "/studio/scenes",
      status: "ready",
      summary: "First saveable scene JSON for Otter Core Awakens."
    },
    {
      step: "Script",
      route: "/studio/scripts",
      status: "ready",
      summary: "Episode script with scenes, beats, and dialogue."
    },
    {
      step: "Storyboard",
      route: "/studio/storyboards",
      status: "ready",
      summary: "Panel-by-panel visual plan."
    },
    {
      step: "Timeline",
      route: "/studio/timeline",
      status: "ready",
      summary: "Timing plan with camera, character, dialogue, and effects tracks."
    },
    {
      step: "Assets",
      route: "/studio/assets",
      status: "ready",
      summary: "Reusable asset reference library."
    },
    {
      step: "Export",
      route: "/studio/exports",
      status: "ready",
      summary: "Local-first export and package metadata."
    }
  ],
  nextActions: [
    "Connect Script Builder output to Storyboard Builder defaults.",
    "Connect Storyboard panels to Timeline Planner defaults.",
    "Connect Asset Library references to Scene and Timeline data.",
    "Later: save this bundle as a local JSON file."
  ],
  productionNotes: [
    "This bundle is a manifest only in v1.",
    "No files are written yet.",
    "Future versions should load/save project bundles locally."
  ]
};

export const DEFAULT_CHARACTER: Character = {
  version: 1,
  id: "otter-ai",
  name: "The Otter",
  role: "ILLUVRSE guide / Chief of Staff",
  species: "futuristic otter AI",
  personality: [
    "smart",
    "loyal",
    "playful",
    "futuristic",
    "direct"
  ],
  visual: {
    primaryColor: "#a78bfa",
    secondaryColor: "#38bdf8",
    accentColor: "#42f58d",
    style: "purple cosmic tech otter",
    silhouette: "small otter body, expressive eyes, rounded ears, sleek tech markings"
  },
  expressions: [
    "curious",
    "focused",
    "excited",
    "concerned",
    "determined"
  ],
  poses: [
    "idle",
    "pointing",
    "thinking",
    "celebrating",
    "awakening"
  ],
  voice: {
    tone: "warm, clever, direct",
    catchphrase: "Let's build the universe."
  },
  storyFunction: "Assistant, narrator, creative partner, and first animated character for ILLUVRSE Core.",
  notes: [
    "This is the first reusable character card for ILLUVRSE.",
    "Designed to be referenced by Scene Builder, Story Engine, and future Animation Timeline."
  ]
};

export const DEFAULT_SCENE: Scene = {
  version: 1,
  id: "scene-001",
  title: "Otter Core Awakens",
  description: "The otter AI wakes up inside a forgotten digital universe.",
  background: {
    type: "gradient",
    from: "#0b1020",
    to: "#3b0764",
    mood: "cosmic"
  },
  camera: {
    shot: "wide",
    angle: "front",
    movement: "slow-push-in"
  },
  characters: [
    {
      id: "otter-ai",
      name: "The Otter",
      x: 480,
      y: 280,
      pose: "awakening",
      expression: "curious"
    }
  ],
  props: [
    {
      id: "world-spark",
      name: "World Spark",
      x: 620,
      y: 220,
      type: "glowing-orb"
    }
  ],
  notes: [
    "First test scene for ILLUVRSE Core.",
    "Designed to later convert into Drawing Command System commands."
  ]
};

export const DEFAULT_SCRIPT: Script = {
  version: 1,
  id: "episode-001",
  title: "Otter Core Awakens",
  series: "ILLUVRSE Core",
  format: "1-3 minute animated short",
  logline: "A futuristic otter AI wakes up inside a forgotten digital universe and helps Ryan turn a spark of imagination into the first world.",
  theme: "Imagination becomes real when you start building.",
  characters: [
    "The Otter",
    "Ryan",
    "World Spark",
    "Glitches",
    "The Void"
  ],
  scenes: [
    {
      id: "scene-001",
      title: "Forgotten Digital Universe",
      summary: "The Otter wakes up in a dark cosmic grid surrounded by broken project fragments.",
      beats: [
        "A purple core flickers awake.",
        "The Otter opens its eyes.",
        "Glitches scatter across the grid."
      ]
    },
    {
      id: "scene-002",
      title: "Ryan Finds the Spark",
      summary: "Ryan notices a small World Spark and decides to build instead of overthinking.",
      beats: [
        "Ryan hesitates at the edge of the void.",
        "The Otter points at the World Spark.",
        "The spark expands into a tiny world."
      ]
    }
  ],
  dialogue: [
    {
      speaker: "The Otter",
      line: "System awake. Imagination detected.",
      emotion: "curious"
    },
    {
      speaker: "Ryan",
      line: "Can we actually build this?",
      emotion: "uncertain"
    },
    {
      speaker: "The Otter",
      line: "Yes. One world spark at a time.",
      emotion: "confident"
    }
  ],
  productionNotes: [
    "Keep the tone funny, motivational, weird, and futuristic.",
    "This script should later connect to Scene Builder and Storyboard Builder."
  ]
};

export const DEFAULT_STORYBOARD: Storyboard = {
  version: 1,
  id: "storyboard-episode-001",
  scriptId: "episode-001",
  title: "Otter Core Awakens",
  series: "ILLUVRSE Core",
  format: "1-3 minute animated short",
  panels: [
    {
      id: "panel-001",
      sceneId: "scene-001",
      title: "Core Flickers Awake",
      description: "A dark cosmic grid fills the frame. A purple core begins to glow.",
      shot: "wide",
      camera: "slow push in",
      characters: ["The Otter"],
      dialogue: "System awake. Imagination detected.",
      action: "The purple core pulses, then the otter's eyes open.",
      mood: "mysterious",
      durationSeconds: 4
    },
    {
      id: "panel-002",
      sceneId: "scene-001",
      title: "Glitches Scatter",
      description: "Tiny chaotic glitch bugs crawl across broken project fragments.",
      shot: "medium",
      camera: "quick pan",
      characters: ["The Otter", "Glitches"],
      dialogue: "Uh oh. The chaos bugs are awake too.",
      action: "Glitches scatter as the otter points toward the darkness.",
      mood: "funny tension",
      durationSeconds: 5
    },
    {
      id: "panel-003",
      sceneId: "scene-002",
      title: "Ryan Finds the Spark",
      description: "Ryan stands at the edge of the void and notices a small green World Spark.",
      shot: "wide",
      camera: "hold",
      characters: ["Ryan", "The Otter", "World Spark"],
      dialogue: "Can we actually build this?",
      action: "The spark floats between Ryan and the otter.",
      mood: "hopeful",
      durationSeconds: 6
    },
    {
      id: "panel-004",
      sceneId: "scene-002",
      title: "One Spark at a Time",
      description: "The World Spark expands into a tiny glowing world.",
      shot: "close-up",
      camera: "slow zoom",
      characters: ["The Otter", "World Spark"],
      dialogue: "Yes. One world spark at a time.",
      action: "The tiny world forms with a soft glow.",
      mood: "motivational",
      durationSeconds: 5
    }
  ],
  productionNotes: [
    "Storyboard panels should later compile into scene plans and animation timing.",
    "Keep visual direction simple and readable."
  ]
};

export const DEFAULT_TIMELINE: Timeline = {
  "version": 1,
  "id": "timeline-episode-001",
  "storyboardId": "storyboard-episode-001",
  "title": "Otter Core Awakens Timeline",
  "fps": 24,
  "durationSeconds": 20,
  "tracks": [
    {
      "id": "track-camera",
      "name": "Camera",
      "type": "camera",
      "items": [
        {
          "id": "cam-001",
          "panelId": "panel-001",
          "start": 0,
          "duration": 4,
          "label": "Slow push in",
          "action": "camera slow push toward purple core"
        },
        {
          "id": "cam-002",
          "panelId": "panel-002",
          "start": 4,
          "duration": 5,
          "label": "Quick pan",
          "action": "camera pans across glitch bugs"
        }
      ]
    },
    {
      "id": "track-character",
      "name": "Character Motion",
      "type": "character",
      "items": [
        {
          "id": "char-001",
          "panelId": "panel-001",
          "start": 1,
          "duration": 3,
          "label": "Otter awakens",
          "action": "otter eyes open and body rises"
        },
        {
          "id": "char-002",
          "panelId": "panel-004",
          "start": 15,
          "duration": 5,
          "label": "Otter points to spark",
          "action": "otter points toward forming world"
        }
      ]
    },
    {
      "id": "track-dialogue",
      "name": "Dialogue",
      "type": "dialogue",
      "items": [
        {
          "id": "dialogue-001",
          "panelId": "panel-001",
          "start": 1,
          "duration": 2.5,
          "label": "System awake",
          "action": "The Otter: System awake. Imagination detected."
        },
        {
          "id": "dialogue-002",
          "panelId": "panel-003",
          "start": 11,
          "duration": 2.5,
          "label": "Can we build this?",
          "action": "Ryan: Can we actually build this?"
        },
        {
          "id": "dialogue-003",
          "panelId": "panel-004",
          "start": 16,
          "duration": 3,
          "label": "One spark at a time",
          "action": "The Otter: Yes. One world spark at a time."
        }
      ]
    },
    {
      "id": "track-effects",
      "name": "Effects",
      "type": "effects",
      "items": [
        {
          "id": "fx-001",
          "panelId": "panel-001",
          "start": 0,
          "duration": 4,
          "label": "Core glow",
          "action": "purple core pulses brighter"
        },
        {
          "id": "fx-002",
          "panelId": "panel-004",
          "start": 15,
          "duration": 5,
          "label": "World Spark expands",
          "action": "green spark expands into tiny glowing world"
        }
      ]
    }
  ],
  "productionNotes": [
    "Timeline items should later compile into animation keyframes.",
    "Keep v1 focused on timing, tracks, and readable export JSON."
  ]
};

export const DEFAULT_ASSET_LIBRARY: AssetLibrary = {
  version: 1,
  id: "assets-illuvrse-core",
  title: "ILLUVRSE Core Asset Library",
  project: "ILLUVRSE Core",
  assets: [
    {
      id: "asset-otter-core",
      name: "Otter Core Mascot",
      type: "character",
      status: "planned",
      description: "Reusable purple cosmic tech otter mascot asset.",
      tags: ["otter", "mascot", "character", "guide"],
      style: "purple cosmic tech otter with expressive eyes",
      path: "/assets/characters/otter-core.png",
      linkedTo: ["otter-ai", "scene-001", "timeline-episode-001"]
    },
    {
      id: "asset-cosmic-grid-bg",
      name: "Cosmic Grid Background",
      type: "background",
      status: "planned",
      description: "Dark digital universe grid background.",
      tags: ["background", "cosmic", "grid", "void"],
      style: "dark cosmic grid with violet glow",
      path: "/assets/backgrounds/cosmic-grid.png",
      linkedTo: ["scene-001", "panel-001"]
    },
    {
      id: "asset-world-spark",
      name: "World Spark",
      type: "prop",
      status: "planned",
      description: "Small green glowing idea orb that becomes a world.",
      tags: ["prop", "spark", "idea", "orb"],
      style: "mint green glowing orb",
      path: "/assets/props/world-spark.png",
      linkedTo: ["scene-002", "panel-004"]
    },
    {
      id: "asset-glitch-bug",
      name: "Glitch Bug",
      type: "effect",
      status: "planned",
      description: "Small chaotic bug-like glitch creature.",
      tags: ["glitch", "bug", "effect", "chaos"],
      style: "tiny neon corrupted bug",
      path: "/assets/effects/glitch-bug.png",
      linkedTo: ["panel-002"]
    },
    {
      id: "asset-awakening-sting",
      name: "Awakening Music Sting",
      type: "audio",
      status: "planned",
      description: "Short futuristic sound cue for the otter waking up.",
      tags: ["audio", "music", "sting", "awakening"],
      style: "futuristic soft synth rise",
      path: "/assets/audio/awakening-sting.mp3",
      linkedTo: ["timeline-episode-001"]
    }
  ],
  productionNotes: [
    "Assets are references only in v1. No file upload or file writing yet.",
    "Future versions should connect assets to scenes, storyboards, timelines, and exports."
  ]
};

export const DEFAULT_EXPORT_PLAN: ExportPlan = {
  version: 1,
  id: "export-episode-001",
  project: "ILLUVRSE Core",
  episodeTitle: "Otter Core Awakens",
  sourceRefs: {
    scriptId: "episode-001",
    storyboardId: "storyboard-episode-001",
    timelineId: "timeline-episode-001",
    assetLibraryId: "assets-illuvrse-core"
  },
  targets: [
    {
      id: "target-youtube-short",
      platform: "YouTube Shorts",
      format: "mp4",
      aspectRatio: "9:16",
      resolution: "1080x1920",
      durationSeconds: 60,
      status: "planned",
      description: "Vertical short-form version for YouTube Shorts."
    },
    {
      id: "target-tiktok",
      platform: "TikTok",
      format: "mp4",
      aspectRatio: "9:16",
      resolution: "1080x1920",
      durationSeconds: 60,
      status: "planned",
      description: "Vertical short-form version for TikTok."
    },
    {
      id: "target-web",
      platform: "Web Episode",
      format: "mp4",
      aspectRatio: "16:9",
      resolution: "1920x1080",
      durationSeconds: 180,
      status: "planned",
      description: "Full web episode export for the ILLUVRSE site."
    },
    {
      id: "target-gif-preview",
      platform: "GIF Preview",
      format: "gif",
      aspectRatio: "16:9",
      resolution: "960x540",
      durationSeconds: 10,
      status: "planned",
      description: "Short looping preview for testing motion."
    }
  ],
  package: {
    folder: "/exports/episode-001",
    includeJson: true,
    includeAssets: true,
    includeCaptions: true,
    includeThumbnail: true
  },
  publishingNotes: [
    "No real publishing automation in v1.",
    "This export plan defines intended outputs and packaging metadata only."
  ],
  productionNotes: [
    "Future versions should connect this to rendering, captions, thumbnails, and publishing workflows.",
    "Keep all exports local-first and user-approved."
  ]
};
