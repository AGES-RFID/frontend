import { z } from "zod";

declare global {
  interface Window {
    env?: {
      PUBLIC_API_URL?: string;
    };
  }
}

const rawEnv: Record<string, unknown> = {};

try {
  rawEnv.API_URL = window.env?.PUBLIC_API_URL ?? process.env.PUBLIC_API_URL;
} catch {}

export const env = z

  .object({
    API_URL: z.url("URL inválida").default("http://localhost:5000"),
  })

  .parse(rawEnv);
