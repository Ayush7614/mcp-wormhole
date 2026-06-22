#!/usr/bin/env python3
"""Generate animated blog poster GIFs — pure posters with text + connected tools."""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "site" / "public" / "demo" / "posters"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 960, 540
FRAMES = 36
DURATION_MS = 80


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


FONT_XL = load_font(52, bold=True)
FONT_LG = load_font(28, bold=True)
FONT_MD = load_font(18)
FONT_SM = load_font(14)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def draw_gradient_bg(draw: ImageDraw.ImageDraw, frame: int) -> None:
    pulse = 0.5 + 0.5 * math.sin(frame / FRAMES * math.pi * 2)
    for y in range(H):
        t = y / H
        r = int(lerp(8, 18, t) + pulse * 6)
        g = int(lerp(6, 10, t) + pulse * 3)
        b = int(lerp(14, 22, t) + pulse * 8)
        draw.line([(0, y), (W, y)], fill=(r, g, b))


def draw_orb(draw: ImageDraw.ImageDraw, cx: int, cy: int, r: int, color: tuple, alpha: float) -> None:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    c = (*color, int(255 * alpha))
    od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
    return overlay


def draw_wormhole(draw: ImageDraw.ImageDraw, cx: int, cy: int, frame: int) -> None:
    angle = frame / FRAMES * math.pi * 2
    for i in range(3):
        a = angle + i * (math.pi * 2 / 3)
        rx = 70 + i * 8
        ry = 22 + i * 4
        points = []
        for step in range(64):
            t = step / 64 * math.pi * 2
            x = cx + math.cos(t + a) * rx
            y = cy + math.sin(t + a) * ry
            points.append((x, y))
        color = [(255, 120, 64), (240, 106, 106), (129, 140, 248)][i]
        draw.line(points + [points[0]], fill=color, width=2)
    draw.ellipse([cx - 28, cy - 28, cx + 28, cy + 28], outline=(255, 120, 64), width=3)
    draw.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=(255, 120, 64))


def draw_tool_node(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    label: str,
    color: tuple,
    pulse: float,
) -> None:
    r = int(28 + pulse * 6)
    draw.ellipse([x - r, y - r, x + r, y + r], fill=(color[0] // 4, color[1] // 4, color[2] // 4))
    draw.ellipse([x - 22, y - 22, x + 22, y + 22], fill=color, outline=(255, 255, 255), width=2)
    bbox = draw.textbbox((0, 0), label, font=FONT_SM)
    tw = bbox[2] - bbox[0]
    draw.text((x - tw // 2, y - 8), label, fill=(255, 255, 255), font=FONT_SM)


def draw_connection(
    draw: ImageDraw.ImageDraw,
    x1: int,
    y1: int,
    x2: int,
    y2: int,
    progress: float,
    color: tuple,
) -> None:
    mx = (x1 + x2) // 2
    my = (y1 + y2) // 2 - 40
    steps = 24
    points = []
    for i in range(steps + 1):
        t = i / steps
        px = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t**2 * x2
        py = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t**2 * y2
        points.append((px, py))
    draw.line(points, fill=(color[0] // 2, color[1] // 2, color[2] // 2), width=2)
    idx = int(progress * steps)
    if idx > 0:
        draw.line(points[: idx + 1], fill=color, width=3)
    dot = points[min(idx, steps)]
    draw.ellipse([dot[0] - 5, dot[1] - 5, dot[0] + 5, dot[1] + 5], fill=(255, 255, 255))


def render_poster(
    filename: str,
    headline: str,
    tagline: str,
    badge: str,
    tools: list[tuple[str, tuple[int, int], tuple[int, int, int]]],
    hub: tuple[int, int] = (720, 270),
) -> None:
    frames: list[Image.Image] = []

    for f in range(FRAMES):
        base = Image.new("RGB", (W, H))
        draw = ImageDraw.Draw(base)
        draw_gradient_bg(draw, f)

        for orb in [(120, 80, 90, (255, 120, 64)), (840, 420, 110, (129, 140, 248)), (480, 480, 70, (240, 106, 106))]:
            overlay = draw_orb(draw, orb[0], orb[1], orb[2], orb[3], 0.12 + 0.06 * math.sin(f / 8))
            base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
            draw = ImageDraw.Draw(base)

        progress = (f / FRAMES) % 1.0
        pulse = 0.5 + 0.5 * math.sin(f / FRAMES * math.pi * 2)

        draw_wormhole(draw, hub[0], hub[1], f)

        for label, pos, color in tools:
            draw_connection(draw, hub[0], hub[1], pos[0], pos[1], progress, color)
            draw_tool_node(draw, pos[0], pos[1], label, color, pulse)

        draw.rounded_rectangle([36, 36, 36 + len(badge) * 11 + 28, 68], radius=14, fill=(255, 120, 64))
        draw.text((50, 44), badge.upper(), fill=(255, 255, 255), font=FONT_SM)

        draw.text((48, 100), headline, fill=(255, 255, 255), font=FONT_XL)
        draw.text((48, 168), tagline, fill=(180, 180, 195), font=FONT_LG)

        draw.text((48, H - 48), "mcp-wormhole · tools connected via MCP", fill=(120, 120, 140), font=FONT_MD)

        frames.append(base)

    out_path = OUT / filename
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        optimize=True,
    )
    print(f"Wrote {out_path} ({len(frames)} frames)")


POSTERS = [
    {
        "filename": "poster-introducing-mcp-wormhole.gif",
        "headline": "MCP Wormhole",
        "tagline": "Every tool. One protocol.",
        "badge": "Announcement",
        "tools": [
            ("Cursor", (560, 120), (255, 120, 64)),
            ("Claude", (560, 420), (240, 106, 106)),
            ("Asana", (880, 270), (129, 140, 248)),
        ],
    },
    {
        "filename": "poster-connect-asana-cursor.gif",
        "headline": "Asana × Cursor",
        "tagline": "Connected in 5 minutes",
        "badge": "Tutorial",
        "tools": [
            ("Cursor", (560, 150), (255, 120, 64)),
            ("MCP", (560, 390), (240, 106, 106)),
            ("Asana", (880, 270), (129, 140, 248)),
        ],
    },
    {
        "filename": "poster-building-mcp-server.gif",
        "headline": "Build MCP Servers",
        "tagline": "Template → npm → PR",
        "badge": "Contributor",
        "tools": [
            ("TypeScript", (540, 130), (255, 120, 64)),
            ("Zod", (540, 410), (129, 140, 248)),
            ("npm", (880, 270), (240, 106, 106)),
        ],
    },
    {
        "filename": "poster-inside-asana-mcp.gif",
        "headline": "66 Tools Live",
        "tagline": "18 prompts · 7 resources",
        "badge": "Deep dive",
        "tools": [
            ("Tasks", (540, 120), (255, 120, 64)),
            ("Projects", (540, 420), (240, 106, 106)),
            ("Goals", (880, 270), (129, 140, 248)),
        ],
    },
]


if __name__ == "__main__":
    for spec in POSTERS:
        render_poster(**spec)
