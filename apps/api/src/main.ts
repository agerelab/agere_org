import { createServer } from "./server";

async function main() {
  const { app } = await createServer();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void main();
