import ky from "ky";

const BASE_URL = process.env.PUBLIC_API_URL ?? "http://localhost:5000";

export type ApiClient = typeof ky;

export const api = ky.extend({
  prefixUrl: `${BASE_URL}/api`,
  hooks: {
    beforeRequest: [],
  },
});
