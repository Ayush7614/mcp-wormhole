import { LinearError } from "../client.js";

export function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function toolError(error: unknown) {
  if (error instanceof LinearError) {
    return json({
      error: error.message,
      details: error.details,
    });
  }

  return json({
    error: error instanceof Error ? error.message : String(error),
  });
}

export function ok(message: string, data?: unknown) {
  return json(data ? { message, ...((typeof data === "object" && data) || { result: data }) } : { message });
}
