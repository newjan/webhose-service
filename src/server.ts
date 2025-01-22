import cors from "cors";
import express, { Express } from "express";
import appRouter from "@/routes";
import logger from "@/logger";
import { DB, getDB } from "@/configs/db";
import { RequestContext } from "@mikro-orm/core";
import errorHandler from "@/middlewares/error-handler";
import requestLogger from "@/middlewares/request-logger";

const app = express();

async function migrateDatabase(db: DB) {
  logger.info("Running migrations");
  const migrator = db.orm.getMigrator();
  await migrator.up(); // Runs pending migrations
}

async function initializeServer(app: Express) {
  app.use(cors());
  app.use(express.json());

  logger.info("Initializing database");

  const db = await getDB();
  await migrateDatabase(db);
  app.use((_req, _res, next) => {
    RequestContext.create(db.em, next);
  });

  app.use(requestLogger);

  
  app.use("/api", appRouter);
  app.use(errorHandler);

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
  });
}

initializeServer(app).catch((error) => {
  logger.error("Server initialization failed");
  throw error;
});
