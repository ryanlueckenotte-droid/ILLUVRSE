/**
 * ILLUVRSE Studio - Shared Type Definitions v1
 * Central source of truth for all creative module data models.
 */

// --- Project Bundle ---

export interface ProjectModuleReferences {
  characterId: string;
  sceneId: string;
  scriptId: string;
  storyboardId: string;
  timelineId: string;
  assetLibraryId: string;
  exportPlanId: string;
}

export interface PipelineStep {
  step: string;
  route: string;
  status: "ready" | "planning" | "blocked" | "future";
  summary: string;
}

export interface ProjectBundle {
  version: number;
  id: string;
  title: string;
  series: string;
  episodeTitle: string;
  status: "planning" | "ready" | "blocked" | "archived";
  localFirst: boolean;
  modules: ProjectModuleReferences;
  pipeline: PipelineStep[];
  nextActions: string[];
  productionNotes: string[];
}

// --- Character ---

export interface CharacterVisual {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  style: string;
  silhouette: string;
}

export interface CharacterVoice {
  tone: string;
  catchphrase: string;
}

export interface Character {
  version: number;
  id: string;
  name: string;
  role: string;
  species: string;
  personality: string[];
  visual: CharacterVisual;
  expressions: string[];
  poses: string[];
  voice: CharacterVoice;
  storyFunction: string;
  notes: string[];
}

// --- Scene ---

export interface SceneBackground {
  type: string;
  from: string;
  to: string;
  mood: string;
}

export interface SceneCamera {
  shot: string;
  angle: string;
  movement: string;
}

export interface SceneCharacter {
  id: string;
  name: string;
  x: number;
  y: number;
  pose: string;
  expression: string;
}

export interface SceneProp {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
}

export interface Scene {
  version: number;
  id: string;
  title: string;
  description: string;
  background: SceneBackground;
  camera: SceneCamera;
  characters: SceneCharacter[];
  props: SceneProp[];
  notes: string[];
}

// --- Script ---

export interface ScriptScene {
  id: string;
  title: string;
  summary: string;
  beats: string[];
}

export interface ScriptDialogue {
  speaker: string;
  line: string;
  emotion: string;
}

export interface Script {
  version: number;
  id: string;
  title: string;
  series: string;
  format: string;
  logline: string;
  theme: string;
  characters: string[];
  scenes: ScriptScene[];
  dialogue: ScriptDialogue[];
  productionNotes: string[];
}

// --- Storyboard ---

export interface StoryboardPanel {
  id: string;
  sceneId: string;
  title: string;
  description: string;
  shot: string;
  camera: string;
  characters: string[];
  dialogue: string;
  action: string;
  mood: string;
  durationSeconds: number;
}

export interface Storyboard {
  version: number;
  id: string;
  scriptId: string;
  title: string;
  series: string;
  format: string;
  panels: StoryboardPanel[];
  productionNotes: string[];
}

// --- Timeline ---

export interface TimelineItem {
  id: string;
  panelId: string;
  start: number;
  duration: number;
  label: string;
  action: string;
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: "camera" | "character" | "dialogue" | "effects";
  items: TimelineItem[];
}

export interface Timeline {
  version: number;
  id: string;
  storyboardId: string;
  title: string;
  fps: number;
  durationSeconds: number;
  tracks: TimelineTrack[];
  productionNotes: string[];
}

// --- Assets ---

export type AssetType = "character" | "background" | "prop" | "effect" | "audio" | "ui" | "reference";
export type AssetStatus = "planned" | "draft" | "ready" | "archived";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  description: string;
  tags: string[];
  style: string;
  path: string;
  linkedTo: string[];
}

export interface AssetLibrary {
  version: number;
  id: string;
  title: string;
  project: string;
  assets: Asset[];
  productionNotes: string[];
}

// --- Exports ---

export type ExportFormat = "mp4" | "gif" | "webm" | "png-sequence" | "json-bundle";
export type ExportStatus = "planned" | "draft" | "ready" | "exported" | "archived";

export interface ExportTarget {
  id: string;
  platform: string;
  format: ExportFormat;
  aspectRatio: string;
  resolution: string;
  durationSeconds: number;
  status: ExportStatus;
  description: string;
}

export interface ExportPlan {
  version: number;
  id: string;
  project: string;
  episodeTitle: string;
  sourceRefs: {
    scriptId: string;
    storyboardId: string;
    timelineId: string;
    assetLibraryId: string;
  };
  targets: ExportTarget[];
  package: {
    folder: string;
    includeJson: boolean;
    includeAssets: boolean;
    includeCaptions: boolean;
    includeThumbnail: boolean;
  };
  publishingNotes: string[];
  productionNotes: string[];
}
