import { readFileSync } from "node:fs";
import { OAuth2Client } from "google-auth-library";
import { google, type calendar_v3 } from "googleapis";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

export interface CalendarSummary {
  id: string;
  summary: string;
  description?: string | null;
  timeZone?: string | null;
  primary?: boolean | null;
  accessRole?: string | null;
}

export interface EventSummary {
  id: string;
  summary?: string | null;
  description?: string | null;
  location?: string | null;
  htmlLink?: string | null;
  status?: string | null;
  start?: calendar_v3.Schema$EventDateTime;
  end?: calendar_v3.Schema$EventDateTime;
  attendees?: calendar_v3.Schema$EventAttendee[];
  organizer?: calendar_v3.Schema$Event["organizer"];
}

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly details?: string,
  ) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

function parseCredentials(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("GOOGLE_CALENDAR_CREDENTIALS is empty");
  }
  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed) as Record<string, unknown>;
  }
  return JSON.parse(readFileSync(trimmed, "utf8")) as Record<string, unknown>;
}

function createAuth(credentials: Record<string, unknown>) {
  if (credentials.type === "service_account") {
    return new google.auth.GoogleAuth({
      credentials,
      scopes: [CALENDAR_SCOPE],
    });
  }

  const clientId = String(credentials.client_id ?? "");
  const clientSecret = String(credentials.client_secret ?? "");
  const refreshToken = String(credentials.refresh_token ?? "");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "OAuth credentials require client_id, client_secret, and refresh_token (or a service_account JSON)",
    );
  }

  const oauth2 = new OAuth2Client(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return oauth2;
}

async function wrapApi<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const err = error as { message?: string; code?: number; response?: { data?: unknown } };
    const details =
      err.response?.data !== undefined ? JSON.stringify(err.response.data) : undefined;
    throw new GoogleCalendarError(err.message ?? "Google Calendar API error", err.code, details);
  }
}

export class GoogleCalendarClient {
  private readonly calendar: calendar_v3.Calendar;

  constructor(
    calendar: calendar_v3.Calendar,
    readonly defaultCalendarId: string,
  ) {
    this.calendar = calendar;
  }

  resolveCalendarId(calendarId?: string): string {
    return calendarId?.trim() || this.defaultCalendarId;
  }

  async listCalendars(maxResults = 50): Promise<CalendarSummary[]> {
    return wrapApi(async () => {
      const result = await this.calendar.calendarList.list({ maxResults });
      return (result.data.items ?? []).map(mapCalendar);
    });
  }

  async getCalendar(calendarId: string): Promise<CalendarSummary> {
    return wrapApi(async () => {
      const result = await this.calendar.calendarList.get({ calendarId });
      return mapCalendar(result.data);
    });
  }

  async listEvents(options: {
    calendarId?: string;
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    q?: string;
    singleEvents?: boolean;
    orderBy?: "startTime" | "updated";
  }): Promise<EventSummary[]> {
    const calendarId = this.resolveCalendarId(options.calendarId);
    return wrapApi(async () => {
      const result = await this.calendar.events.list({
        calendarId,
        timeMin: options.timeMin,
        timeMax: options.timeMax,
        maxResults: options.maxResults ?? 25,
        q: options.q,
        singleEvents: options.singleEvents ?? true,
        orderBy: options.orderBy ?? (options.singleEvents !== false ? "startTime" : undefined),
      });
      return (result.data.items ?? []).map(mapEvent);
    });
  }

  async getEvent(calendarId: string | undefined, eventId: string): Promise<EventSummary> {
    const calId = this.resolveCalendarId(calendarId);
    return wrapApi(async () => {
      const result = await this.calendar.events.get({ calendarId: calId, eventId });
      return mapEvent(result.data);
    });
  }

  async createEvent(
    calendarId: string | undefined,
    event: calendar_v3.Schema$Event,
  ): Promise<EventSummary> {
    const calId = this.resolveCalendarId(calendarId);
    return wrapApi(async () => {
      const result = await this.calendar.events.insert({
        calendarId: calId,
        requestBody: event,
      });
      return mapEvent(result.data);
    });
  }

  async updateEvent(
    calendarId: string | undefined,
    eventId: string,
    event: calendar_v3.Schema$Event,
  ): Promise<EventSummary> {
    const calId = this.resolveCalendarId(calendarId);
    return wrapApi(async () => {
      const result = await this.calendar.events.patch({
        calendarId: calId,
        eventId,
        requestBody: event,
      });
      return mapEvent(result.data);
    });
  }

  async deleteEvent(calendarId: string | undefined, eventId: string): Promise<void> {
    const calId = this.resolveCalendarId(calendarId);
    await wrapApi(async () => {
      await this.calendar.events.delete({ calendarId: calId, eventId });
    });
  }

  async searchEvents(calendarId: string | undefined, query: string, maxResults = 25): Promise<EventSummary[]> {
    return this.listEvents({
      calendarId,
      q: query,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });
  }

  async quickAddEvent(calendarId: string | undefined, text: string): Promise<EventSummary> {
    const calId = this.resolveCalendarId(calendarId);
    return wrapApi(async () => {
      const result = await this.calendar.events.quickAdd({
        calendarId: calId,
        text,
      });
      return mapEvent(result.data);
    });
  }

  async findFreeSlots(options: {
    calendarIds: string[];
    timeMin: string;
    timeMax: string;
    timeZone?: string;
  }): Promise<{ busy: Record<string, { start: string; end: string }[]>; timeMin: string; timeMax: string }> {
    return wrapApi(async () => {
      const result = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: options.timeMin,
          timeMax: options.timeMax,
          timeZone: options.timeZone,
          items: options.calendarIds.map((id) => ({ id })),
        },
      });

      const busy: Record<string, { start: string; end: string }[]> = {};
      for (const [calendarId, data] of Object.entries(result.data.calendars ?? {})) {
        busy[calendarId] = (data.busy ?? []).map((slot) => ({
          start: slot.start ?? "",
          end: slot.end ?? "",
        }));
      }

      return { busy, timeMin: options.timeMin, timeMax: options.timeMax };
    });
  }

  async listUpcomingEvents(calendarId: string | undefined, maxResults = 10): Promise<EventSummary[]> {
    return this.listEvents({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });
  }

  async rsvpEvent(
    calendarId: string | undefined,
    eventId: string,
    responseStatus: "accepted" | "declined" | "tentative",
    attendeeEmail?: string,
  ): Promise<EventSummary> {
    const calId = this.resolveCalendarId(calendarId);
    return wrapApi(async () => {
      const existing = await this.calendar.events.get({ calendarId: calId, eventId });
      const attendees = [...(existing.data.attendees ?? [])];
      const selfEmail = attendeeEmail ?? existing.data.organizer?.email;

      if (!selfEmail) {
        throw new GoogleCalendarError("Could not determine attendee email for RSVP");
      }

      const index = attendees.findIndex((a) => a.email === selfEmail);
      if (index >= 0) {
        attendees[index] = { ...attendees[index], responseStatus };
      } else {
        attendees.push({ email: selfEmail, responseStatus });
      }

      const result = await this.calendar.events.patch({
        calendarId: calId,
        eventId,
        requestBody: { attendees },
      });
      return mapEvent(result.data);
    });
  }
}

function mapCalendar(item: calendar_v3.Schema$CalendarListEntry): CalendarSummary {
  return {
    id: item.id ?? "",
    summary: item.summary ?? item.id ?? "Untitled",
    description: item.description,
    timeZone: item.timeZone,
    primary: item.primary,
    accessRole: item.accessRole,
  };
}

function mapEvent(item: calendar_v3.Schema$Event): EventSummary {
  return {
    id: item.id ?? "",
    summary: item.summary,
    description: item.description,
    location: item.location,
    htmlLink: item.htmlLink,
    status: item.status,
    start: item.start,
    end: item.end,
    attendees: item.attendees,
    organizer: item.organizer,
  };
}

export async function createClientFromEnv(): Promise<GoogleCalendarClient> {
  const raw = process.env.GOOGLE_CALENDAR_CREDENTIALS;
  if (!raw) {
    throw new Error("Missing GOOGLE_CALENDAR_CREDENTIALS environment variable");
  }

  const credentials = parseCredentials(raw);
  const auth = createAuth(credentials);
  const calendar = google.calendar({ version: "v3", auth });
  const defaultCalendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";

  return new GoogleCalendarClient(calendar, defaultCalendarId);
}
