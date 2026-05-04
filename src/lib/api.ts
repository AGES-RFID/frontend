import ky from "ky";
import { env } from "@/config/env";

export type ApiClient = typeof ky;

export const api = ky.extend({
  baseUrl: env.API_URL,
  prefix: "api",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = localStorage.getItem("rfid-auth-token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});
