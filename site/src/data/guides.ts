import type { Integration } from "./integrations";
import type { McpServer } from "./servers";
import type { GuideStep } from "./serverGuides";
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

  if (server.demoAsset) {
    steps.push({
      id: "demo",
      number: 8,
      title: "See it working",
      description: `Live verification of the ${server.name} MCP server against the real API.`,
      demo: {
        title: `${server.name} MCP verification`,
        asset: server.demoAsset,
      },
    });
  }

  return steps;
}

export function buildProviderGuide(integration: Integration, server: McpServer): ProviderGuide {
  const disabled = server.status === "planned";

  return {
    title: disabled
      ? `How to integrate ${server.name} MCP with ${integration.name} (preview)`
      : `How to integrate ${server.name} MCP with ${integration.name}`,
    subtitle: disabled
      ? `${server.name} is coming soon — preview the ${integration.name} setup below`
      : `Step-by-step setup to connect ${server.name} to ${integration.name} using ${server.npmPackage}`,
    integration,
    server,
    steps: disabled ? buildPlannedSteps(integration, server) : buildActiveSteps(integration, server),
    references: buildReferences(integration, server),
  };
}
