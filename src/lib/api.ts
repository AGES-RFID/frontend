import ky from "ky";
import { env } from "@/config/env";

export type ApiClient = typeof ky;

export const api = ky.extend({
  prefixUrl: `${env.API_URL}/api`,
  hooks: {
    beforeRequest: [],
  },
});
