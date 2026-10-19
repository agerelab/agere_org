import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvelopeFilter } from "./envelope.filter";

async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new EnvelopeFilter());
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void main();
