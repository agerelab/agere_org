import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "./server";

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

let handler: Handler | undefined;

export default async function vercel(req: IncomingMessage, res: ServerResponse) {
  const current = handler ?? (await createServer()).expressApp;
  handler = current;
  current(req, res);
}
