#!/usr/bin/env python3
"""Blog poster GIFs: hub (agents → wormhole) or flow (client → wormhole → tool)."""

from __future__ import annotations

import io
import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

try:
    import cairosvg

    HAS_CAIRO = True
except ImportError:
    HAS_CAIRO = False

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site" / "public" / "demo" / "posters"
WORMHOLE_LOGO = ROOT / "site" / "public" / "logo.svg"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630
FRAMES = 40
DURATION_MS = 90

BG = (250, 250, 252)
CARD = (255, 255, 255)
TEXT = (15, 15, 20)
MUTED = (110, 110, 120)
LINE = (220, 222, 228)
ACCENT = (255, 120, 64)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/SFNSDisplay-Bold.otf" if bold else "/System/Library/Fonts/SFNSDisplay-Regular.otf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


FONT_HERO = load_font(46, bold=True)
FONT_SUB = load_font(20)
FONT_CARD_TITLE = load_font(22, bold=True)
FONT_CARD_BODY = load_font(15)
FONT_BADGE = load_font(11, bold=True)
FONT_STAT = load_font(12, bold=True)
FONT_STAT_L = load_font(11)
FONT_EYEBROW = load_font(12, bold=True)
FONT_AGENT = load_font(11, bold=True)


def load_logo(path: Path, size: int) -> Image.Image:
    if path.exists() and HAS_CAIRO and path.suffix == ".svg":
        png = cairosvg.svg2png(url=str(path), output_width=size * 2, output_height=size * 2)
        img = Image.open(io.BytesIO(png)).convert("RGBA")
    elif path.exists() and path.suffix != ".svg":
        img = Image.open(path).convert("RGBA")
    else:
        img = Image.new("RGBA", (size * 2, size * 2), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([8, 8, size * 2 - 8, size * 2 - 8], radius=24, fill=ACCENT)
        letter = path.stem[0].upper() if path.stem else "?"
        bbox = d.textbbox((0, 0), letter, font=load_font(size, bold=True))
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        d.text((size - tw // 2, size - th // 2 - 4), letter, fill=(255, 255, 255), font=load_font(size, bold=True))
    return img.resize((size, size), Image.Resampling.LANCZOS)


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int, int, int],
    radius: int,
    fill: tuple,
    outline: tuple | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_shadow_card(base: Image.Image, box: tuple[int, int, int, int], radius: int, lift: float = 0) -> None:
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sy = int(6 + lift * 4)
    sd.rounded_rectangle(
        [x1 + 2, y1 + sy, x2 + 2, y2 + sy],
        radius=radius,
        fill=(0, 0, 0, 28 + int(lift * 12)),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    base.alpha_composite(shadow)
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle(box, radius=radius, fill=CARD + (255,), outline=LINE + (255,), width=1)
    base.alpha_composite(layer)


def draw_icon_tile(base: Image.Image, x: int, y: int, logo: Image.Image, size: int = 72, glow: bool = False) -> None:
    box = (x, y, x + size, y + size)
    draw_shadow_card(base, box, 18, lift=0.3 if glow else 0.2)
    if glow:
        glow_layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow_layer)
        gd.rounded_rectangle(
            (x - 2, y - 2, x + size + 2, y + size + 2),
            radius=20,
            outline=(*ACCENT, 80),
            width=2,
        )
        base.alpha_composite(glow_layer)
    px = x + (size - logo.width) // 2
    py = y + (size - logo.height) // 2
    base.alpha_composite(logo, (px, py))


def draw_connector(
    draw: ImageDraw.ImageDraw,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
    progress: float,
) -> None:
    draw.line([(x1, y1), (x2, y2)], fill=LINE, width=2)
    t = progress % 1.0
    px = x1 + (x2 - x1) * t
    py = y1 + (y2 - y1) * t
    draw.ellipse([px - 5, py - 5, px + 5, py + 5], fill=ACCENT)
    draw.ellipse([px - 8, py - 8, px + 8, py + 8], outline=(*ACCENT, 120), width=2)


def draw_text_width(text: str, font: ImageFont.ImageFont) -> int:
    bbox = ImageDraw.Draw(Image.new("RGB", (1, 1))).textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]


def wrap_text(text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw_text_width(trial, font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines[:3]


def draw_copy_block(base: Image.Image, spec: dict) -> None:
    draw = ImageDraw.Draw(base)
    draw.text((64, 56), spec["eyebrow"], fill=MUTED, font=FONT_EYEBROW)

    y = 96
    for line in spec["headline"].split("\n"):
        draw.text((64, y), line, fill=TEXT, font=FONT_HERO)
        y += 54

    ty = y + 8
    for line in wrap_text(spec["tagline"], FONT_SUB, 520):
        draw.text((64, ty), line, fill=MUTED, font=FONT_SUB)
        ty += 28

    badge = spec["badge"]
    bw = draw_text_width(badge, FONT_BADGE) + 24
    rounded_rect(draw, (64, ty + 20, 64 + bw, ty + 48), 14, fill=(255, 244, 236), outline=(255, 210, 180))
    draw.text((76, ty + 26), badge, fill=ACCENT, font=FONT_BADGE)


def draw_grid(base: Image.Image) -> None:
    draw = ImageDraw.Draw(base)
    for gx in range(0, W, 40):
        for gy in range(0, H, 40):
            draw.ellipse([gx, gy, gx + 2, gy + 2], fill=(230, 232, 238))


def render_flow_poster(spec: dict) -> None:
    client_logo = load_logo(ROOT / spec["client_logo"], 44)
    wormhole_logo = load_logo(WORMHOLE_LOGO, 44)
    tool_logo = load_logo(ROOT / spec["tool_logo"], 36)

    card_x, card_y = 760, 130
    card_w, card_h = 380, 370
    client_x, client_y = 560, 280
    wormhole_x, wormhole_y = 660, 280
    tile = 72

    frames: list[Image.Image] = []

    for f in range(FRAMES):
        base = Image.new("RGBA", (W, H), BG + (255,))
        draw_grid(base)
        draw_copy_block(base, spec)

        pulse = 0.5 + 0.5 * math.sin(f / FRAMES * math.pi * 2)
        progress = (f / FRAMES) % 1.0

        draw = ImageDraw.Draw(base)
        draw_icon_tile(base, client_x, client_y, client_logo, tile)
        draw_icon_tile(base, wormhole_x, wormhole_y, wormhole_logo, tile, glow=True)

        cx1 = client_x + tile
        cy = client_y + tile // 2
        cx2 = wormhole_x
        draw_connector(draw, cx1, cy, cx2, cy, progress)

        wx2 = wormhole_x + tile
        card_mid_y = card_y + card_h // 2
        draw_connector(draw, wx2, wormhole_y + tile // 2, card_x, card_mid_y, (progress + 0.35) % 1.0)

        draw_shadow_card(base, (card_x, card_y, card_x + card_w, card_y + card_h), 24, lift=pulse * 0.5)
        cd = ImageDraw.Draw(base)

        cd.text((card_x + 68, card_y + 26), spec["tool_name"], fill=TEXT, font=FONT_CARD_TITLE)
        base.alpha_composite(tool_logo, (card_x + 24, card_y + 22))

        bx = card_x + 68
        for label, color in spec["auth_badges"]:
            lw = draw_text_width(label, FONT_BADGE) + 16
            rounded_rect(cd, (bx, card_y + 28, bx + lw, card_y + 48), 8, fill=color)
            cd.text((bx + 8, card_y + 32), label, fill=(255, 255, 255), font=FONT_BADGE)
            bx += lw + 8

        desc_y = card_y + 78
        for line in wrap_text(spec["tool_desc"], FONT_CARD_BODY, card_w - 48):
            cd.text((card_x + 24, desc_y), line, fill=MUTED, font=FONT_CARD_BODY)
            desc_y += 22

        stat_y = card_y + card_h - 64
        cd.line([(card_x + 24, stat_y - 12), (card_x + card_w - 24, stat_y - 12)], fill=LINE, width=1)
        sx = card_x + 24
        for val, label in spec["card_stats"]:
            cd.text((sx, stat_y), val, fill=TEXT, font=FONT_STAT)
            vw = draw_text_width(val, FONT_STAT)
            cd.text((sx + vw + 6, stat_y + 2), label, fill=MUTED, font=FONT_STAT_L)
            sx += vw + draw_text_width(label, FONT_STAT_L) + 36

        if pulse > 0.85:
            glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
            gd = ImageDraw.Draw(glow)
            gd.rounded_rectangle(
                (card_x - 2, card_y - 2, card_x + card_w + 2, card_y + card_h + 2),
                radius=26,
                outline=(*ACCENT, 60),
                width=3,
            )
            base = Image.alpha_composite(base, glow)

        frames.append(base.convert("RGB"))

    out = OUT / spec["filename"]
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=DURATION_MS, loop=0, optimize=True)
    print(f"Wrote {out}")


def render_hub_poster(spec: dict) -> None:
    wormhole_logo = load_logo(WORMHOLE_LOGO, 44)
    tile = 64
    cx, cy = 820, 315  # wormhole center

    agent_specs = spec["agents"]
    positions: dict[str, tuple[int, int]] = {
        "left": (cx - 200, cy - tile // 2),
        "right": (cx + 136, cy - tile // 2),
        "top": (cx - tile // 2, cy - 170),
        "bottom": (cx - tile // 2, cy + 106),
    }

    agents = []
    for entry in agent_specs:
        pos = entry["position"]
        x, y = positions[pos]
        logo = load_logo(ROOT / entry["logo"], 40)
        agents.append({"x": x, "y": y, "logo": logo, "label": entry.get("label", ""), "position": pos})

    frames: list[Image.Image] = []

    for f in range(FRAMES):
        base = Image.new("RGBA", (W, H), BG + (255,))
        draw_grid(base)
        draw_copy_block(base, spec)

        progress = (f / FRAMES) % 1.0
        draw = ImageDraw.Draw(base)

        # dashed ring
        ring_r = 88
        for angle in range(0, 360, 8):
            if (angle // 8) % 2 == 0:
                rad = math.radians(angle)
                x1 = cx + ring_r * math.cos(rad)
                y1 = cy + ring_r * math.sin(rad)
                x2 = cx + (ring_r + 4) * math.cos(rad)
                y2 = cy + (ring_r + 4) * math.sin(rad)
                draw.line([(x1, y1), (x2, y2)], fill=(255, 180, 140), width=1)

        # connectors agent → wormhole
        wormhole_cx = cx
        wormhole_cy = cy
        for i, agent in enumerate(agents):
            ax = agent["x"] + tile // 2
            ay = agent["y"] + tile // 2
            draw_connector(draw, ax, ay, wormhole_cx, wormhole_cy, (progress + i * 0.2) % 1.0)

        draw_icon_tile(base, cx - tile // 2, cy - tile // 2, wormhole_logo, tile, glow=True)

        label_w = draw_text_width("mcp-wormhole", FONT_AGENT)
        draw.text((cx - label_w // 2, cy + tile // 2 + 10), "mcp-wormhole", fill=MUTED, font=FONT_AGENT)

        for agent in agents:
            draw_icon_tile(base, agent["x"], agent["y"], agent["logo"], tile)
            if agent["label"]:
                lw = draw_text_width(agent["label"], FONT_AGENT)
                draw.text(
                    (agent["x"] + tile // 2 - lw // 2, agent["y"] + tile + 8),
                    agent["label"],
                    fill=MUTED,
                    font=FONT_AGENT,
                )

        frames.append(base.convert("RGB"))

    out = OUT / spec["filename"]
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=DURATION_MS, loop=0, optimize=True)
    print(f"Wrote {out}")


POSTERS = [
    {
        "layout": "hub",
        "filename": "poster-introducing-mcp-wormhole.gif",
        "eyebrow": "BLOG / ANNOUNCEMENT",
        "headline": "MCP Wormhole\nfor AI Agents",
        "tagline": "Connect Cursor, Claude, ChatGPT and 20+ clients to Slack, Sentry, Asana and more via stdio MCP.",
        "badge": "OPEN SOURCE",
        "agents": [
            {"logo": "site/public/logos/cursor.svg", "label": "Cursor", "position": "left"},
            {"logo": "site/public/logos/anthropic.svg", "label": "Claude", "position": "top"},
            {"logo": "site/public/logos/openai.svg", "label": "ChatGPT", "position": "right"},
            {"logo": "site/public/logos/vscode.svg", "label": "VS Code", "position": "bottom"},
        ],
    },
    {
        "layout": "flow",
        "filename": "poster-connect-asana-cursor.gif",
        "eyebrow": "BLOG / TUTORIAL",
        "headline": "Asana MCP\nfor Cursor",
        "tagline": "Paste one JSON block into mcp.json and ask Cursor to list tasks, create work, and search projects.",
        "badge": "5 MIN SETUP",
        "client_logo": "site/public/logos/cursor.svg",
        "tool_name": "Asana",
        "tool_logo": "site/public/logos/asana.svg",
        "tool_desc": "Connect Cursor to @mcp-wormhole/asana — 66 tools, zero proxy, runs locally.",
        "auth_badges": [("PAT", (34, 197, 94)), ("NPX", (255, 120, 64))],
        "card_stats": [("66", "TOOLS"), ("5 min", "SETUP")],
    },
    {
        "layout": "flow",
        "filename": "poster-connect-vercel-cursor.gif",
        "eyebrow": "BLOG / TUTORIAL",
        "headline": "Vercel MCP\nfor Cursor",
        "tagline": "Paste one JSON block into mcp.json and ask Cursor to list deployments, read build logs, and roll back production.",
        "badge": "5 MIN SETUP",
        "client_logo": "site/public/logos/cursor.svg",
        "tool_name": "Vercel",
        "tool_logo": "site/public/logos/vercel.png",
        "tool_desc": "Connect Cursor to @mcp-wormhole/vercel — 11 tools for deployments, logs, promote, and rollback.",
        "auth_badges": [("API", (34, 197, 94)), ("NPX", (255, 120, 64))],
        "card_stats": [("11", "TOOLS"), ("5 min", "SETUP")],
    },
    {
        "layout": "hub",
        "filename": "poster-building-mcp-server.gif",
        "eyebrow": "BLOG / CONTRIBUTOR",
        "headline": "Build MCP\nServers",
        "tagline": "Copy the template, wrap a vendor REST API, verify against live endpoints, and ship to npm.",
        "badge": "CONTRIBUTING",
        "agents": [
            {"logo": "site/public/logos/cli.svg", "label": "CLI", "position": "left"},
            {"logo": "site/public/logos/modelcontextprotocol.svg", "label": "MCP SDK", "position": "top"},
            {"logo": "site/public/logos/vscode.svg", "label": "TypeScript", "position": "right"},
            {"logo": "site/public/logos/vercel.png", "label": "npm", "position": "bottom"},
        ],
    },
    {
        "layout": "flow",
        "filename": "poster-inside-asana-mcp.gif",
        "eyebrow": "BLOG / DEEP DIVE",
        "headline": "Inside Asana\nMCP Server",
        "tagline": "66 tools, 18 prompt workflows, and browsable asana:// resources — full API coverage.",
        "badge": "v0.2.0 LIVE",
        "client_logo": "site/public/logos/anthropic.svg",
        "tool_name": "Asana MCP",
        "tool_logo": "site/public/logos/asana.svg",
        "tool_desc": "Tasks, projects, portfolios, goals, dependencies, tags, time tracking — all exposed as MCP tools.",
        "auth_badges": [("PAT", (34, 197, 94)), ("LIVE", (34, 197, 94))],
        "card_stats": [("66", "TOOLS"), ("18", "PROMPTS")],
    },
]


if __name__ == "__main__":
    if not HAS_CAIRO:
        print("Warning: cairosvg not installed — using fallback icons. pip install cairosvg")
    for spec in POSTERS:
        if spec["layout"] == "hub":
            render_hub_poster(spec)
        else:
            render_flow_poster(spec)
