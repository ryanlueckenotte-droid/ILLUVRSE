import { readConfig } from "./config";

export type OllamaStatus = {
  online: boolean;
  url: string;
  error?: string;
};

export async function getOllamaStatus(): Promise<OllamaStatus> {
  const config = await readConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${config.ollamaUrl}/api/tags`, {
      signal: controller.signal
    });

    return {
      online: response.ok,
      url: config.ollamaUrl,
      error: response.ok ? undefined : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      online: false,
      url: config.ollamaUrl,
      error: error instanceof Error ? error.message : "Unable to reach Ollama"
    };
  } finally {
    clearTimeout(timeout);
  }
}
