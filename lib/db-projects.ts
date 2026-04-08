import fs from "node:fs";
import path from "node:path";

export type DbProject = {
  slug: string;
  name: string;
  sourceDir: string;
};

const APP_DIR = path.join(process.cwd(), "app");
const EXCLUDED_DIRECTORIES = new Set(["api", "db"]);

function titleCaseFromSlug(slug: string): string {
  return slug
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isSafeSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug);
}

export function getDbProjects(): DbProject[] {
  if (!fs.existsSync(APP_DIR)) {
    return [];
  }

  const discovered = fs
    .readdirSync(APP_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("("))
    .filter((entry) => !EXCLUDED_DIRECTORIES.has(entry.name))
    .filter((entry) => {
      const indexPath = path.join(APP_DIR, entry.name, "index.html");
      return fs.existsSync(indexPath) && fs.statSync(indexPath).isFile();
    })
    .map((entry) => {
      return {
        slug: entry.name,
        name: titleCaseFromSlug(entry.name),
        sourceDir: path.join(APP_DIR, entry.name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return discovered;
}

export function getDbProjectBySlug(slug: string): DbProject | null {
  if (!isSafeSlug(slug)) {
    return null;
  }

  return getDbProjects().find((project) => project.slug === slug) ?? null;
}

export function resolveDbProjectFile(slug: string, requestedSegments: string[]): string | null {
  const project = getDbProjectBySlug(slug);
  if (!project) {
    return null;
  }

  const normalizedSegments = requestedSegments.filter(Boolean);
  const requestedPath =
    normalizedSegments.length === 0
      ? "index.html"
      : path.join(...normalizedSegments);

  const absolutePath = path.resolve(project.sourceDir, requestedPath);
  const relativeToProject = path.relative(project.sourceDir, absolutePath);

  if (relativeToProject.startsWith("..") || path.isAbsolute(relativeToProject)) {
    return null;
  }

  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    return null;
  }

  return absolutePath;
}