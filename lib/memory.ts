import fs from "node:fs/promises";
import { memoryFiles, promptPath, type MemoryFileName } from "./paths";

export type MemoryFile = {
  name: MemoryFileName;
  label: string;
  content: string;
};

const labels: Record<MemoryFileName, string> = {
  profile: "Profile",
  goals: "Goals",
  tasks: "Tasks",
  projects: "Projects",
  timeline: "Timeline"
};

export async function readMemoryFiles(): Promise<MemoryFile[]> {
  const entries = await Promise.all(
    Object.entries(memoryFiles).map(async ([name, filePath]) => ({
      name: name as MemoryFileName,
      label: labels[name as MemoryFileName],
      content: await fs.readFile(filePath, "utf8")
    }))
  );

  return entries;
}

export async function buildSystemPrompt(): Promise<string> {
  const [prompt, memories] = await Promise.all([
    fs.readFile(promptPath, "utf8"),
    readMemoryFiles()
  ]);

  const memoryContext = memories
    .map((file) => `## ${file.label}\n${file.content.trim()}`)
    .join("\n\n");

  return `${prompt.trim()}\n\nLocal memory context follows. Use it as private context and do not claim to have external access.\n\n${memoryContext}`;
}

export async function addTimelineEntry(entry: string) {
  const cleanEntry = entry.trim();
  if (!cleanEntry) {
    throw new Error("Timeline entry is required.");
  }

  const date = new Date().toISOString().slice(0, 10);
  await fs.appendFile(memoryFiles.timeline, `- ${date}: ${cleanEntry}\n`, "utf8");
}
