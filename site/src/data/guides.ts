import type { Integration } from "./integrations";
import type { McpServer } from "./servers";
import type { GuideStep } from "./serverGuides";
import type { GuideIntro, GuidePoster } from "./guideTypes";
import { getConfigForIntegration } from "./config";

export interface GuideReference {
  label: string;
  href: string;
  external?: boolean;
}

export interface ProviderGuide {
  title: string;
  subtitle: string;
  integration: Integration;
  server: McpServer;
  intro: GuideIntro;
  poster: GuidePoster;
  steps: GuideStep[];
  references: GuideReference[];
}

function examplePrompts(serverName: string, clientName: string): string[] {
  return [
    `List my open ${serverName} tasks`,
    `Create a ${serverName} task called Ship from ${clientName}`,
    `Search ${serverName} for tasks containing mcp-wormhole`,
    `Add a comment to ${serverName} task {task_gid}`,
  ];
}

function buildReferences(integration: Integration, server: McpServer): GuideReference[] {
  const refs: GuideReference[] = [
    {
      label: `${integration.name} MCP documentation`,
      href: integration.docsUrl,
    },
    {
      label: `${server.name} MCP server guide`,
      href: `/servers/${server.id}/guide`,
      external: false,
    },
    {
      label: `${server.name} server overview`,
      href: `/servers/${server.id}`,
      external: false,
    },
    {
      label: `npm: ${server.npmPackage}`,
      href: `https://www.npmjs.com/package/${server.npmPackage}`,
    },
    {
      label: "mcp-wormhole on GitHub",
      href: "https://github.com/Ayush7614/mcp-wormhole",
    },
    {
      label: "Model Context Protocol docs",
      href: "https://modelcontextprotocol.io",
    },
  ];

  if (server.docsUrl) {
    refs.splice(1, 0, {
      label: `${server.name} API reference`,
      href: server.docsUrl,
    });
  }

  for (const env of server.env) {
    if (env.docsUrl) {
      refs.push({
        label: `Get ${env.key}`,
        href: env.docsUrl,
      });
    }
  }

  return refs;
}

const clientIntroNotes: Record<string, string> = {
  cursor:
    "Cursor loads MCP servers from mcp.json at startup — tools appear in Agent, Composer, and inline chat.",
  vscode:
    "GitHub Copilot in VS Code discovers MCP tools from .vscode/mcp.json in your workspace root.",
  "claude-desktop":
    "Claude Desktop reads mcpServers from its config file and exposes tools in every new conversation.",
  "claude-code":
    "Claude Code connects via CLI (claude mcp add) or project MCP config — verify with claude mcp list.",
  "claude-agents-sdk":
    "Wire stdio MCP servers into your agent initialization — tools are discovered via tools/list automatically.",
  chatgpt: "OpenAI's MCP connector runs remote or stdio servers depending on your deployment setup.",
  codex: "Codex CLI reads MCP config from your project and exposes tools during agent sessions.",
  "openai-agents-sdk": "Register stdio MCP servers in your Agents SDK setup before starting the agent loop.",
  windsurf: "Windsurf Cascade loads MCP tools from its settings panel — restart after saving config.",
  opencode: "OpenCode discovers MCP servers from its config and surfaces tools in the coding agent.",
  zed: "Zed's assistant connects to MCP servers configured in your settings or project context.",
  cli: "Use the MCP Inspector CLI to test stdio servers before wiring them into a full client.",
  langchain: "Attach stdio MCP tools to LangChain agents via the MCP adapter in your chain setup.",
  llamaindex: "Connect MCP tools to LlamaIndex agents through the MCP tool integration layer.",
  crewai: "CrewAI agents can call MCP tools when you register the server in your crew configuration.",
  mastra: "Mastra agents discover MCP tools from your server config during initialization.",
  "ai-sdk": "Vercel AI SDK supports MCP tool calling when you connect stdio servers in your route handler.",
  "google-adk": "Google's Agent Development Kit accepts MCP servers in your agent tool configuration.",
  kimi: "Moonshot Kimi loads MCP tools from its integration settings after you add the server block.",
  openclaw: "OpenClaw agents call MCP tools registered in your project's server configuration.",
};

function buildClientIntro(integration: Integration, server: McpServer): GuideIntro {
  const note =
    clientIntroNotes[integration.id] ??
    `${integration.name} connects to MCP servers through its standard config — tools become available once the server is running.`;

  return {
    title: "Overview",
    paragraphs: [
      `This guide connects ${server.name} to ${integration.name} so your AI assistant can manage tasks, search projects, and update work without switching apps. ${note}`,
      `Follow the steps below for credentials, the exact config path, restart instructions, example prompts, and the full ${server.name} tool reference.`,
    ],
    highlights: [
      `${server.tools.length} ${server.name} tools · ${server.promptCount ?? 0} MCP prompts · browsable resources`,
      `Config file: ${integration.configPath}`,
      integration.transport === "stdio" ? "Local stdio server via npx" : `${integration.transport} transport`,
      `npm: ${server.npmPackage}@0.2.0`,
    ],
  };
}

function buildPlannedClientIntro(integration: Integration, server: McpServer): GuideIntro {
  return {
    title: "Preview",
    paragraphs: [
      `${server.name} is not published yet. This page shows the MCP configuration you'll use with ${integration.name} once the server ships.`,
      `When available, you'll add the config block below to ${integration.configPath}, set your credentials, and restart ${integration.name}.`,
    ],
    highlights: [
      `${server.tools.length} tools planned for ${server.name}`,
      `Target config: ${integration.configPath}`,
      `Package: ${server.npmPackage}`,
    ],
  };
}

function buildClientPoster(integration: Integration, server: McpServer): GuidePoster {
  const npmShort = server.npmPackage.replace("@mcp-wormhole/", "");
  const stats: GuidePoster["stats"] = [
    { value: String(server.tools.length), label: "Tools" },
    { value: String(server.promptCount ?? 0), label: "Prompts" },
    { value: integration.name, label: "Client" },
  ];
  if (!server.promptCount) {
    stats.splice(1, 1);
  }
  return {
    demoAsset: server.demoAsset ?? "demo/asana-verify.gif",
    demoCaption: `${integration.name} + ${server.name} — live demo`,
    stats,
  };
}

function buildPlannedSteps(integration: Integration, server: McpServer): GuideStep[] {
  const configs = getConfigForIntegration(integration.id, server);

  return [
    {
      id: "preview",
      number: 1,
      title: "Coming soon",
      description: `${server.name} is not published yet. This guide previews the config you'll use with ${integration.name}.`,
      notice: `Package: ${server.npmPackage}`,
    },
    {
      id: "config-path",
      number: 2,
      title: "Config file location",
      description: `When ${server.name} ships, add the server here:`,
      bullets: [integration.configPath],
    },
    {
      id: "configure",
      number: 3,
      title: "Config preview",
      description: `Expected MCP configuration for ${integration.name}:`,
      code: configs.map((block) => ({
        label: block.label,
        language: block.language,
        code: block.code,
      })),
    },
  ];
}

function buildActiveSteps(integration: Integration, server: McpServer): GuideStep[] {
  const configs = getConfigForIntegration(integration.id, server);
  const envKeys = server.env.map((e) => e.key).join(", ");

  const steps: GuideStep[] = [
    {
      id: "prerequisites",
      number: 1,
      title: "Prerequisites",
      description: `Before integrating ${server.name} with ${integration.name}, confirm you have everything ready.`,
      bullets: [
        `${integration.name} installed with MCP support enabled`,
        `A ${server.name} account`,
        "Node.js 18+ installed (`node -v` to check)",
        ...server.env.map((item) => `${item.key} — ${item.description}`),
      ],
    },
    {
      id: "token",
      number: 2,
      title: `Get your ${server.name} credentials`,
      description: server.env[0]?.docsUrl
        ? `Create a token from the ${server.name} developer console. You will paste it into your MCP config — never commit it to git.`
        : `Set up authentication for ${server.name} and keep credentials out of version control.`,
      bullets: server.env.map((item) => {
        const link = item.docsUrl ? ` (${item.docsUrl})` : "";
        return `${item.key} — ${item.description}${link}`;
      }),
      notice: "Never share or commit API tokens.",
    },
    {
      id: "config-path",
      number: 3,
      title: `Open ${integration.name} MCP settings`,
      description: `Locate the MCP configuration file or settings panel for ${integration.name}:`,
      bullets: [integration.configPath],
    },
    {
      id: "configure",
      number: 4,
      title: "Add the MCP server config",
      description: `Copy the configuration below into your ${integration.name} MCP settings. Replace token placeholders with your real ${envKeys} value.`,
      code: configs.map((block) => ({
        label: block.label,
        language: block.language,
        code: block.code,
      })),
    },
    {
      id: "connect",
      number: 5,
      title: `Connect & restart ${integration.name}`,
      description: `Follow these steps to activate the ${server.name} MCP server in ${integration.name}:`,
      bullets: integration.steps,
    },
    {
      id: "prompts",
      number: 6,
      title: "Try it out",
      description: `Ask ${integration.name} naturally — it will call ${server.name} tools on your behalf.`,
      prompts: examplePrompts(server.name, integration.name),
    },
    {
      id: "tools",
      number: 7,
      title: `Available ${server.name} tools`,
      description: `Your agent can use these ${server.tools.length} MCP tools:`,
      bullets: server.tools.map((tool) => `\`${tool}\``),
    },
  ];

  return steps;
}

export function buildProviderGuide(integration: Integration, server: McpServer): ProviderGuide {
  const disabled = server.status === "planned";

  return {
    title: disabled
      ? `How to integrate ${server.name} MCP with ${integration.name} (preview)`
      : `${integration.name} + ${server.name} MCP`,
    subtitle: disabled
      ? `${server.name} is coming soon — preview the ${integration.name} setup below`
      : `Give ${integration.name} direct access to ${server.name} — tasks, search, and updates from your agent`,
    integration,
    server,
    intro: disabled ? buildPlannedClientIntro(integration, server) : buildClientIntro(integration, server),
    poster: buildClientPoster(integration, server),
    steps: disabled ? buildPlannedSteps(integration, server) : buildActiveSteps(integration, server),
    references: buildReferences(integration, server),
  };
}
