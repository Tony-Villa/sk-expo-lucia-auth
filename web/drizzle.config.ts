import type { Config } from "drizzle-kit";

export default {
  schema: './src/lib/server/db/schema',
  out: "./drizzle/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.VITE_TURSO_DB_URL!,
    authToken: process.env.VITE_TURSO_DB_AUTH_TOKEN,
  },
} satisfies Config;