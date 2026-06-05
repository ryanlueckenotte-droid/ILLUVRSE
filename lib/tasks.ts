import fs from "node:fs/promises";
import { memoryFiles } from "./paths";

export type TaskItem = {
  text: string;
  completed: boolean;
};

const taskPattern = /^-\s+\[( |x|X)\]\s+(.+)$/;

export async function readTasksMarkdown() {
  return fs.readFile(memoryFiles.tasks, "utf8");
}

export function parseTasks(markdown: string): TaskItem[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(taskPattern);
      if (!match) {
        return null;
      }

      return {
        completed: match[1].toLowerCase() === "x",
        text: match[2].trim()
      };
    })
    .filter((task): task is TaskItem => Boolean(task));
}

export async function addTask(text: string) {
  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error("Task text is required.");
  }

  const markdown = await readTasksMarkdown();
  const lines = markdown.split(/\r?\n/);
  const openHeading = lines.findIndex((line) => /^##\s+Open\s*$/i.test(line));
  const insertAt =
    openHeading === -1
      ? lines.length
      : lines.findIndex((line, index) => index > openHeading && /^##\s+/.test(line));

  const targetIndex = insertAt === -1 ? lines.length : insertAt;
  const nextLines =
    openHeading === -1
      ? [...lines, "", "## Open", "", `- [ ] ${cleanText}`]
      : [...lines.slice(0, targetIndex), `- [ ] ${cleanText}`, ...lines.slice(targetIndex)];

  await fs.writeFile(memoryFiles.tasks, `${nextLines.join("\n").replace(/\n+$/, "")}\n`, "utf8");
}

export async function completeTask(text: string) {
  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error("Task text is required.");
  }

  const markdown = await readTasksMarkdown();
  const lines = markdown.split(/\r?\n/);
  const taskLineIndex = lines.findIndex((line) => {
    const match = line.match(taskPattern);
    return Boolean(match && match[1] === " " && match[2].trim() === cleanText);
  });

  if (taskLineIndex === -1) {
    throw new Error("Open task not found.");
  }

  const completedLine = `- [x] ${cleanText}`;
  lines.splice(taskLineIndex, 1);

  let completedHeading = lines.findIndex((line) => /^##\s+Completed\s*$/i.test(line));
  if (completedHeading === -1) {
    lines.push("", "## Completed");
    completedHeading = lines.length - 1;
  }

  const nextHeading = lines.findIndex((line, index) => index > completedHeading && /^##\s+/.test(line));
  const insertAt = nextHeading === -1 ? lines.length : nextHeading;
  lines.splice(insertAt, 0, completedLine);

  await fs.writeFile(memoryFiles.tasks, `${lines.join("\n").replace(/\n+$/, "")}\n`, "utf8");
}
