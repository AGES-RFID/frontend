import { z } from "zod";

const rawEnv: Record<string, unknown> = {};

try {
  rawEnv.API_URL = process.env.PUBLIC_API_URL;
} catch {}

export const env = z
  .object({
    API_URL: z.url("URL inválida").default("http://localhost:5000"),
  })
  .parse(rawEnv);
