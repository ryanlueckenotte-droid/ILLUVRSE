import fs from "node:fs/promises";
import { configPath } from "./paths";

export type IlluvrseConfig = {
  model: string;
  ollamaUrl: string;
};

const defaultConfig: IlluvrseConfig = {
  model: "llama3.2:3b",
  ollamaUrl: "http://127.0.0.1:11434"
};

export async function readConfig(): Promise<IlluvrseConfig> {
  try {
    const raw = await fs.readFile(configPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<IlluvrseConfig>;

    return {
      model: parsed.model?.trim() || defaultConfig.model,
      ollamaUrl: parsed.ollamaUrl?.trim() || defaultConfig.ollamaUrl
    };
  } catch {
    await writeConfig(defaultConfig);
    return defaultConfig;
  }
}

export async function writeConfig(config: IlluvrseConfig) {
  const safeConfig = {
    model: config.model.trim() || defaultConfig.model,
    ollamaUrl: config.ollamaUrl.trim() || defaultConfig.ollamaUrl
  };

  await fs.writeFile(configPath, `${JSON.stringify(safeConfig, null, 2)}\n`, "utf8");
  return safeConfig;
}
