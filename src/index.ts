import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { connectDB } from "./config/database.config";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { DiscordLogger } from "./middlewares/discord.middleware";
import { informationRoutes } from "./routes/information.route";
import { loggerRoutes } from "./routes/logger.route";

// Validate environment variables
if (!process.env.DISCORD_WEBHOOK_URL) {
  console.error("DISCORD_WEBHOOK_URL is required!");
  process.exit(1);
}

export const logger = new DiscordLogger(process.env.DISCORD_WEBHOOK_URL || "");

// Connect to MongoDB
connectDB();

// Initialize Elysia app
const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Elysia CRUD API",
          version: "1.0.0",
        },
        tags: [{ name: "users", description: "User operations" }],
      },
    })
  )
  .use(requestLogger)
  .use(errorHandler)
  .use(loggerRoutes)
  .use(informationRoutes)
  .use(
    new Elysia({ prefix: "/api" }).get("/", async () => {
      return {
        success: true,
        message: "Welcome to Elysia API",
      };
    })
  )
  .listen(3000);
// Log startup
logger.logInfo("Server started", {
  port: 3000,
  environment: process.env.NODE_ENV,
});

console.log(
  `🦊 Elysia server is running at ${app.server?.hostname}:${app.server?.port}`
);
