import fs from "node:fs/promises";
import { memoryFiles } from "./paths";

export async function readProjectsMarkdown() {
  return fs.readFile(memoryFiles.projects, "utf8");
}

export async function addProject(name: string, goal: string) {
  const cleanName = name.trim();
  const cleanGoal = goal.trim() || "Define next action.";

  if (!cleanName) {
    throw new Error("Project name is required.");
  }

  const block = `\n## ${cleanName}\n\nStatus: Active\n\nGoal: ${cleanGoal}\n`;
  await fs.appendFile(memoryFiles.projects, block, "utf8");
}
