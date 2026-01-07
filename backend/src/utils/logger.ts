import pino from "pino";

// Use pino-pretty only in development, plain pino in production/serverless
const isDevelopment = process.env.NODE_ENV === "development";

export const logger = isDevelopment
  ? pino({
      level: "info",
      transport: {
        target: "pino-pretty"
      },
    })
  : pino({
      level: "info"
    });