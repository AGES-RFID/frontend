import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(import.meta.dirname, ".env"),
});

export default defineConfig({
  testDir: "./e2e/specs",

  globalSetup: "./e2e/global-setup.ts",

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report" }]]
    : "list",

  use: {
    baseURL: process.env.FRONTEND_URL || "http://localhost:3000",

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",
  },

  webServer: process.env.CI
    ? undefined
    : {
        command: "bun run dev",

        url: "http://localhost:3000",

        reuseExistingServer: true,

        stdout: "ignore",

        stderr: "pipe",
      },

  projects: [
    {
      name: "chromium-admin",

      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },

      testMatch: "**/admin/**/*.spec.ts",
    },

    {
      name: "chromium-customer",

      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/customer.json",
      },

      testMatch: "**/user/**/*.spec.ts",
    },

    {
      name: "chromium-auth",

      use: {
        ...devices["Desktop Chrome"],
      },

      testMatch: "**/auth/**/*.spec.ts",
    },

    {
      name: "chromium-dashboard",

      use: {
        ...devices["Desktop Chrome"],

        // Dashboard administrativo precisa iniciar autenticado como admin
        storageState: "e2e/.auth/admin.json",
      },

      testMatch: "**/dashboard/**/*.spec.ts",
    },
  ],
});
