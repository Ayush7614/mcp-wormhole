const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

export interface CloudflareApiErrorItem {
  code: number;
  message: string;
}

export interface CloudflareUser {
  id: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string;
}

export interface CloudflareTokenVerify {
  id: string;
  status: string;
}

export interface CloudflareAccountSummary {
  id: string;
  name: string;
  type?: string;
}

export interface CloudflareZoneSummary {
  id: string;
  name: string;
  status?: string;
  paused?: boolean;
  type?: string;
  plan?: { name?: string };
}

export interface CloudflareDnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
  priority?: number | null;
  comment?: string | null;
}

export interface CloudflareWorkerScript {
  id: string;
  created_on?: string;
  modified_on?: string;
}

export interface CloudflareFirewallRule {
  id: string;
  paused: boolean;
  description?: string;
  action: string;
  priority?: number;
  filter?: { id?: string; expression?: string };
}

type CloudflareResponse<T> = {
  success: boolean;
  errors: CloudflareApiErrorItem[];
  messages: unknown[];
  result: T;
  result_info?: {
    page?: number;
    per_page?: number;
    total_pages?: number;
    count?: number;
    total_count?: number;
  };
};

type QueryValue = string | number | boolean | undefined;

export class CloudflareError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: CloudflareApiErrorItem[] = [],
  ) {
    super(message);
    this.name = "CloudflareError";
  }
}

export class CloudflareClient {
  private accountIdResolved = false;

  constructor(
    private readonly apiToken: string,
    private accountId?: string,
    private zoneId?: string,
  ) {
    if (!apiToken.trim()) {
      throw new Error("CLOUDFLARE_API_TOKEN is required");
    }
  }

  private buildQuery(params?: Record<string, QueryValue>): string {
    const search = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) search.set(key, String(value));
      }
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${CLOUDFLARE_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const text = await response.text();
    let payload: CloudflareResponse<T> | null = null;
    if (text) {
      payload = JSON.parse(text) as CloudflareResponse<T>;
    }

    if (!response.ok || payload?.success === false) {
      const errors = payload?.errors ?? [];
      const message =
        errors.map((entry) => entry.message).join("; ") ||
        `Cloudflare API error (${response.status})`;
      throw new CloudflareError(message, response.status, errors);
    }

    return (payload?.result ?? ({} as T)) as T;
  }

  isAccountOwnedToken(): boolean {
    return this.apiToken.startsWith("cfat_");
  }

  /** User tokens verify at /user/tokens/verify; account-owned (cfat_) tokens probe zones instead. */
  async verifyToken(): Promise<CloudflareTokenVerify & { token_type?: "user" | "account" }> {
    if (this.isAccountOwnedToken()) {
      await this.listZones({ perPage: 1 });
      return { id: "account-owned", status: "active", token_type: "account" };
    }

    try {
      const result = await this.request<CloudflareTokenVerify>("/user/tokens/verify");
      return { ...result, token_type: "user" };
    } catch (error) {
      if (error instanceof CloudflareError && error.status === 401) {
        await this.listZones({ perPage: 1 });
        return { id: "unknown", status: "active", token_type: "account" };
      }
      throw error;
    }
  }

  async getUser(): Promise<CloudflareUser> {
    return this.request<CloudflareUser>("/user");
  }

  async listAccounts(page = 1, perPage = 20): Promise<CloudflareAccountSummary[]> {
    const result = await this.request<CloudflareAccountSummary[]>(
      `/accounts${this.buildQuery({ page, per_page: perPage })}`,
    );
    return result ?? [];
  }

  async resolveAccountId(accountId?: string): Promise<string> {
    if (accountId?.trim()) return accountId.trim();
    if (this.accountId) return this.accountId;

    const accounts = await this.listAccounts(1, 5);
    if (accounts.length === 0) {
      throw new CloudflareError(
        "No Cloudflare accounts found for this token. Set CLOUDFLARE_ACCOUNT_ID.",
        404,
      );
    }

    this.accountId = accounts[0]!.id;
    return this.accountId;
  }

  async listZones(options?: {
    name?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }): Promise<CloudflareZoneSummary[]> {
    const result = await this.request<CloudflareZoneSummary[]>(
      `/zones${this.buildQuery({
        name: options?.name,
        status: options?.status,
        page: options?.page ?? 1,
        per_page: options?.perPage ?? 25,
      })}`,
    );
    return result ?? [];
  }

  async resolveZoneId(zoneId?: string): Promise<string> {
    if (zoneId?.trim()) return zoneId.trim();
    if (this.zoneId) return this.zoneId;

    const zones = await this.listZones({ perPage: 5 });
    if (zones.length === 0) {
      throw new CloudflareError(
        "No Cloudflare zones found for this token. Set CLOUDFLARE_ZONE_ID.",
        404,
      );
    }

    this.zoneId = zones[0]!.id;
    return this.zoneId;
  }

  async getZone(zoneId: string): Promise<CloudflareZoneSummary & Record<string, unknown>> {
    return this.request(`/zones/${encodeURIComponent(zoneId)}`);
  }

  async listDnsRecords(
    zoneId: string,
    options?: { type?: string; name?: string; page?: number; perPage?: number },
  ): Promise<CloudflareDnsRecord[]> {
    const result = await this.request<CloudflareDnsRecord[]>(
      `/zones/${encodeURIComponent(zoneId)}/dns_records${this.buildQuery({
        type: options?.type,
        name: options?.name,
        page: options?.page ?? 1,
        per_page: options?.perPage ?? 50,
      })}`,
    );
    return result ?? [];
  }

  async getDnsRecord(zoneId: string, recordId: string): Promise<CloudflareDnsRecord> {
    return this.request(
      `/zones/${encodeURIComponent(zoneId)}/dns_records/${encodeURIComponent(recordId)}`,
    );
  }

  async createDnsRecord(
    zoneId: string,
    input: {
      type: string;
      name: string;
      content: string;
      ttl?: number;
      proxied?: boolean;
      priority?: number;
      comment?: string;
    },
  ): Promise<CloudflareDnsRecord> {
    return this.request(`/zones/${encodeURIComponent(zoneId)}/dns_records`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateDnsRecord(
    zoneId: string,
    recordId: string,
    input: {
      type?: string;
      name?: string;
      content?: string;
      ttl?: number;
      proxied?: boolean;
      priority?: number;
      comment?: string;
    },
  ): Promise<CloudflareDnsRecord> {
    return this.request(
      `/zones/${encodeURIComponent(zoneId)}/dns_records/${encodeURIComponent(recordId)}`,
      { method: "PATCH", body: JSON.stringify(input) },
    );
  }

  async deleteDnsRecord(zoneId: string, recordId: string): Promise<{ id: string }> {
    return this.request(
      `/zones/${encodeURIComponent(zoneId)}/dns_records/${encodeURIComponent(recordId)}`,
      { method: "DELETE" },
    );
  }

  async purgeCache(
    zoneId: string,
    input: {
      purge_everything?: boolean;
      files?: string[];
      tags?: string[];
      hosts?: string[];
    },
  ): Promise<{ id?: string }> {
    return this.request(`/zones/${encodeURIComponent(zoneId)}/purge_cache`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async listWorkers(accountId?: string): Promise<CloudflareWorkerScript[]> {
    const resolved = await this.resolveAccountId(accountId);
    const result = await this.request<CloudflareWorkerScript[]>(
      `/accounts/${encodeURIComponent(resolved)}/workers/scripts`,
    );
    return result ?? [];
  }

  async getWorker(accountId: string | undefined, scriptName: string): Promise<Record<string, unknown>> {
    const resolved = await this.resolveAccountId(accountId);
    return this.request(
      `/accounts/${encodeURIComponent(resolved)}/workers/scripts/${encodeURIComponent(scriptName)}`,
    );
  }

  async listFirewallRules(zoneId: string, page = 1, perPage = 25): Promise<CloudflareFirewallRule[]> {
    const result = await this.request<CloudflareFirewallRule[]>(
      `/zones/${encodeURIComponent(zoneId)}/firewall/rules${this.buildQuery({
        page,
        per_page: perPage,
      })}`,
    );
    return result ?? [];
  }
}

export function createClientFromEnv(): CloudflareClient {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!apiToken) {
    throw new Error("Missing CLOUDFLARE_API_TOKEN environment variable");
  }
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || undefined;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim() || undefined;
  return new CloudflareClient(apiToken, accountId, zoneId);
}
