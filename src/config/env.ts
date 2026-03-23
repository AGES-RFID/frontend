import { z } from "zod";

export const env = z
  .object({
    API_URL: z
      .string()
      .url("URL inválida")
      .default("http://localhost:5000/api"),
  })
  .parse({ API_URL: import.meta.env?.API_URL });
