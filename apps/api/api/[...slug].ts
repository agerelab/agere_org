import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "../src/server";

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let handler: Handler | undefined;

export default async function vercel(req: IncomingMessage, res: ServerResponse) {
  if (!handler) {
    const server = await createServer();
    handler = server.expressApp;
  }
  handler(req, res);
}
