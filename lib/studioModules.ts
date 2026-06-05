export interface StudioModule {
  key: string;
  title: string;
  route: string;
  description: string;
  status: string;
  purpose: string;
  linkId?: string; // Key in the project manifest 'modules' object
  comingSoon?: boolean;
}

export const STUDIO_MODULES: StudioModule[] = [
  {
    key: "project",
    title: "Project Bundle",
    route: "/studio/project",
    description: "Manage the central episode manifest and module connections.",
    status: "Ready",
    purpose: "Connects all creative modules into one portable project.",
  },
  {
    key: "characters",
    title: "Character Builder",
    route: "/studio/characters",
    description: "Define reusable character cards, styles, and traits.",
    status: "Ready",
    purpose: "Reusable otter AI guide character card.",
    linkId: "characterId",
  },
  {
    key: "scripts",
    title: "Script Builder",
    route: "/studio/scripts",
    description: "Write episode scripts, dialogue, and story beats.",
    status: "Ready",
    purpose: "Episode script with scenes, beats, and dialogue.",
    linkId: "scriptId",
  },
  {
    key: "storyboards",
    title: "Storyboard Builder",
    route: "/studio/storyboards",
    description: "Plan panel-by-panel visual sequences and timing.",
    status: "Ready",
    purpose: "Panel-by-panel visual plan.",
    linkId: "storyboardId",
  },
  {
    key: "scenes",
    title: "Scene Builder",
    route: "/studio/scenes",
    description: "Construct backgrounds, camera framing, and shot metadata.",
    status: "Ready",
    purpose: "Saveable scene JSON for episode production.",
    linkId: "sceneId",
  },
  {
    key: "timeline",
    title: "Timeline Planner",
    route: "/studio/timeline",
    description: "Orchestrate tracks for camera, motion, and dialogue.",
    status: "Ready",
    purpose: "Timing plan with multi-track temporal orchestration.",
    linkId: "timelineId",
  },
  {
    key: "assets",
    title: "Assets Library",
    route: "/studio/assets",
    description: "Manage reusable references for media and components.",
    status: "Ready",
    purpose: "Reusable asset reference library.",
    linkId: "assetLibraryId",
  },
  {
    key: "exports",
    title: "Export Planner",
    route: "/studio/exports",
    description: "Plan multi-platform distribution and packaging.",
    status: "Ready",
    purpose: "Local-first export and package metadata.",
    linkId: "exportPlanId",
  },
  {
    key: "canvas",
    title: "Canvas Lab",
    route: "/lab/canvas",
    description: "Test drawing commands and real-time animations.",
    status: "Ready",
    purpose: "Drawing Command System testbed.",
  },
  {
    key: "worlds",
    title: "Worlds",
    route: "/studio/worlds",
    description: "Define environments and world-building rules.",
    status: "Planned",
    purpose: "Global environment and world-state definition.",
    comingSoon: true,
  }
];
