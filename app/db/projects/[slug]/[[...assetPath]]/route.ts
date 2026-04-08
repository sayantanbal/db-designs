import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { resolveDbProjectFile } from "@/lib/db-projects";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".eot": "application/vnd.ms-fontobject",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const DATENSEN_OVERLAY_DIV_PATTERN =
  /<div[^>]*onclick="window\.open\('https:\/\/www\.datensen\.com'[^>]*>\s*<\/div>/gi;

function getContentType(filePath: string): string {
  return MIME_BY_EXTENSION[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function sanitizeServedHtml(html: string): string {
  return html.replace(DATENSEN_OVERLAY_DIV_PATTERN, "");
}

type RouteContext = {
  params: Promise<{ slug: string; assetPath?: string[] }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug, assetPath = [] } = await context.params;

  if (assetPath.length === 0) {
    const redirectUrl = new URL(`/db/projects/${slug}/index.html`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const filePath = resolveDbProjectFile(slug, assetPath);
  if (!filePath) {
    return NextResponse.json({ message: "Project file not found." }, { status: 404 });
  }

  const isHtml = path.extname(filePath).toLowerCase() === ".html";
  const rawBody = await fs.readFile(filePath);
  const body = isHtml ? sanitizeServedHtml(rawBody.toString("utf-8")) : rawBody;

  const response = new NextResponse(body, {
    headers: {
      "Content-Type": getContentType(filePath),
      "Cache-Control": filePath.endsWith(".html")
        ? "no-store"
        : "public, max-age=604800, immutable",
    },
  });

  return response;
}