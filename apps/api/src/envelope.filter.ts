import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Response } from "express";

@Catch(HttpException)
export class EnvelopeFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const body = exception.getResponse();
    const raw = typeof body === "string" ? body : (body as { message?: string | string[] }).message ?? exception.message;
    const message = Array.isArray(raw) ? raw.join(", ") : String(raw);
    response.status(status).json({
      error: {
        code: status === 404 ? "NOT_FOUND" : "HTTP_ERROR",
        message,
      },
    });
  }
}
