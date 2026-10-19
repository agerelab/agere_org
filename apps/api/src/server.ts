import "reflect-metadata";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { EnvelopeFilter } from "./envelope.filter";

function loadEnv() {
  const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.env");
  try {
    process.loadEnvFile(envFile);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export async function createServer() {
  loadEnv();
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new EnvelopeFilter());
  await app.init();
  return { app, expressApp };
}
