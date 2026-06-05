/**
 * Local Studio Storage Helper v1
 * Simple browser localStorage persistence for Studio modules.
 * Safe for Next.js client components (SSR-friendly).
 */

export const STORAGE_KEYS = {
  PROJECT: "illuvrse.projectBundle.v1",
  CHARACTER: "illuvrse.character.v1",
  SCENE: "illuvrse.scene.v1",
  SCRIPT: "illuvrse.script.v1",
  STORYBOARD: "illuvrse.storyboard.v1",
  TIMELINE: "illuvrse.timeline.v1",
  ASSETS: "illuvrse.assets.v1",
  EXPORT_PLAN: "illuvrse.exportPlan.v1",
} as const;

export function loadStudioJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
}

export function saveStudioJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export function clearStudioJson(key: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing ${key} from localStorage:`, error);
  }
}
