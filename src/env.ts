import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const nodeEnv = z.enum(["development", "production", "test"]);

function requiredOnEnv(env: z.infer<typeof nodeEnv>) {
  return (value: any) => {
    if (env === process.env.NODE_ENV && !value) {
      return false;
    }

    return true;
  };
}

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    OPENAI_KEY: z.string().min(1),
  },
  client: {},
  shared: {
    NODE_ENV: nodeEnv,
    VERCEL_ENV: z
      .enum(["production", "preview", "development"])
      .default("development"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    OPENAI_KEY: process.env.OPENAI_KEY,
  },
});
