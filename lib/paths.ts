import path from "node:path";

export const rootDir = process.cwd();
export const agentDir = path.join(rootDir, "agent");
export const memoryDir = path.join(agentDir, "memory");
export const promptPath = path.join(agentDir, "prompts", "chief_of_staff.md");
export const configPath = path.join(rootDir, "config", "illuvrse.json");

export const memoryFiles = {
  profile: path.join(memoryDir, "profile.md"),
  goals: path.join(memoryDir, "goals.md"),
  tasks: path.join(memoryDir, "tasks.md"),
  projects: path.join(memoryDir, "projects.md"),
  timeline: path.join(memoryDir, "timeline.md")
} as const;

export type MemoryFileName = keyof typeof memoryFiles;
