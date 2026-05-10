import ky from "ky";
import { env } from "@/config/env";
import { TOKEN_KEY } from "@/features/auth/AuthService";

export type ApiClient = typeof ky;

export const api = ky.extend({
  baseUrl: env.API_URL,
  prefix: "api",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});
