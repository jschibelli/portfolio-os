#!/usr/bin/env node
/**
 * Central affected-app detector for Portfolio OS GitHub Actions.
 *
 * Turbo 2.5.8 rejects combining `--filter` and `--affected`. Those are two
 * different selectors, not a "narrow affected to this package" pair:
 *   --affected  packages changed vs TURBO_SCM_BASE, including dependents
 *   --filter    explicit package selector (pnpm-compatible)
 *
 * This script is Phase A only: produce the deployable-app matrix.
 * Phase B (each CI job) must use `--filter="<package>..."` without `--affected`.
 * The trailing `...` is Turbo's "package + dependencies" selector.
 *
 * Global graph files (invalidate every deployable app, still one job each):
 *   pnpm-lock.yaml, pnpm-workspace.yaml, package.json, turbo.json
 *
 * Root tsconfig.json is NOT global: only apps that extend it are added.
 * README / docs / workflow-only edits do not force application builds.
 */

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ZERO_SHA = "0000000000000000000000000000000000000000";

/** Files that genuinely invalidate the whole workspace graph. */
export const GLOBAL_GRAPH_FILES = [
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "package.json",
  "turbo.json",
];

export const ROOT_TSCONFIG = "tsconfig.json";

export function repoRoot(startDir = __dirname) {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml")) &&
      fs.existsSync(path.join(dir, "turbo.json"))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return path.resolve(__dirname, "../..");
}

export function detectScripts(pkgJson) {
  const scripts = pkgJson.scripts || {};
  const testScript = scripts.test;
  const testReal =
    typeof testScript === "string" &&
    testScript.trim().length > 0 &&
    !/no test specified/i.test(testScript);

  const playwright =
    Boolean(scripts.playwright) ||
    Object.keys(scripts).some(
      (key) =>
        key === "test:accessibility" ||
        key === "test:all" ||
        key.includes("playwright"),
    ) ||
    Boolean(pkgJson.devDependencies?.["@playwright/test"]) ||
    Boolean(pkgJson.dependencies?.["@playwright/test"]);

  return {
    build: typeof scripts.build === "string",
    lint: typeof scripts.lint === "string",
    typecheck: typeof scripts.typecheck === "string",
    test: testReal,
    storybook: typeof scripts["build-storybook"] === "string",
    playwright: Boolean(playwright),
  };
}

export function turboFilter(packageName) {
  return `${packageName}...`;
}

/**
 * Deployable apps = packages under apps/ with a build script.
 * Shared libraries live under packages/ and are never matrix entries;
 * they are pulled in by `--filter="<app>..."`.
 */
export function discoverDeployableApps(root = repoRoot()) {
  const appsDir = path.join(root, "apps");
  if (!fs.existsSync(appsDir)) {
    return [];
  }

  const apps = [];
  for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(appsDir, entry.name, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    if (typeof pkgJson.scripts?.build !== "string") continue;
    const scripts = detectScripts(pkgJson);
    apps.push({
      id: entry.name,
      package: pkgJson.name,
      dir: path.posix.join("apps", entry.name),
      scripts,
    });
  }

  return apps.sort((a, b) => a.id.localeCompare(b.id));
}

export function parseTurboLsJson(raw) {
  if (raw == null) return [];
  const data = typeof raw === "string" ? JSON.parse(extractJson(raw)) : raw;
  const items = data?.packages?.items;
  if (!Array.isArray(items)) return [];
  return items.map((item) => item?.name).filter(Boolean);
}

export function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`Expected JSON object in turbo output:\n${text.slice(0, 500)}`);
  }
  return text.slice(start, end + 1);
}

export function normalizeChangedFile(file) {
  return String(file || "")
    .trim()
    .replace(/^\.\//, "");
}

export function matchedGlobalGraphFiles(
  changedFiles,
  globalFiles = GLOBAL_GRAPH_FILES,
) {
  const changed = new Set(changedFiles.map(normalizeChangedFile));
  return globalFiles.filter((file) => changed.has(file));
}

export function appExtendsRootTsconfig(root, app) {
  const tsconfigPath = path.join(root, app.dir, "tsconfig.json");
  if (!fs.existsSync(tsconfigPath)) return false;
  const raw = fs.readFileSync(tsconfigPath, "utf8");
  return /"extends"\s*:\s*"(\.\.\/){2}tsconfig\.json"/.test(raw);
}

export function toMatrixApp(app) {
  return {
    id: app.id,
    package: app.package,
    dir: app.dir,
    filter: turboFilter(app.package),
    lint: Boolean(app.scripts.lint),
    typecheck: Boolean(app.scripts.typecheck),
    test: Boolean(app.scripts.test),
    build: Boolean(app.scripts.build),
    storybook: Boolean(app.scripts.storybook),
    playwright: Boolean(app.scripts.playwright),
  };
}

export function resolveAffectedApps({
  deployableApps,
  affectedPackages = [],
  changedFiles = [],
  full = false,
  root = repoRoot(),
} = {}) {
  if (!Array.isArray(deployableApps) || deployableApps.length === 0) {
    return {
      apps: [],
      matrix: [],
      reason: "no-deployable-apps",
      matchedGlobalFiles: [],
      tsconfigApps: [],
    };
  }

  if (full) {
    const matrix = deployableApps.map(toMatrixApp);
    return {
      apps: deployableApps,
      matrix,
      reason: "full-repo",
      matchedGlobalFiles: [...GLOBAL_GRAPH_FILES],
      tsconfigApps: [],
    };
  }

  const selected = new Map();
  const reasons = [];

  for (const name of affectedPackages) {
    const app = deployableApps.find((candidate) => candidate.package === name);
    if (app) selected.set(app.package, app);
  }
  if (selected.size > 0) {
    reasons.push("turbo-affected");
  }

  const matchedGlobalFiles = matchedGlobalGraphFiles(changedFiles);
  if (matchedGlobalFiles.length > 0) {
    for (const app of deployableApps) selected.set(app.package, app);
    reasons.push(`global:${matchedGlobalFiles.join(",")}`);
  }

  const tsconfigChanged = changedFiles
    .map(normalizeChangedFile)
    .includes(ROOT_TSCONFIG);
  const tsconfigApps = [];
  if (tsconfigChanged) {
    for (const app of deployableApps) {
      if (appExtendsRootTsconfig(root, app)) {
        selected.set(app.package, app);
        tsconfigApps.push(app.id);
      }
    }
    if (tsconfigApps.length > 0) {
      reasons.push(`root-tsconfig:${tsconfigApps.join(",")}`);
    }
  }

  const apps = deployableApps.filter((app) => selected.has(app.package));
  return {
    apps,
    matrix: apps.map(toMatrixApp),
    reason: apps.length === 0 ? "no-app-affected" : reasons.join("+") || "turbo-affected",
    matchedGlobalFiles,
    tsconfigApps,
  };
}

export function resolveScmBase({
  eventName = process.env.GITHUB_EVENT_NAME,
  prBaseSha = process.env.PR_BASE_SHA,
  beforeSha = process.env.GITHUB_EVENT_BEFORE,
  explicitBase = process.env.TURBO_SCM_BASE,
  fallbacks = ["origin/develop", "origin/main", "develop", "main"],
  refExists = defaultRefExists,
} = {}) {
  if (explicitBase && explicitBase.trim()) return explicitBase.trim();

  if (eventName === "pull_request" && prBaseSha && prBaseSha !== ZERO_SHA) {
    return prBaseSha;
  }

  if (beforeSha && beforeSha !== ZERO_SHA) {
    return beforeSha;
  }

  for (const ref of fallbacks) {
    if (refExists(ref)) return ref;
  }

  return "HEAD~1";
}

function defaultRefExists(ref) {
  const result = spawnSync("git", ["rev-parse", "--verify", ref], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return result.status === 0;
}

export function gitMergeBase(base, cwd) {
  try {
    return execFileSync("git", ["merge-base", base, "HEAD"], {
      cwd,
      encoding: "utf8",
    }).trim();
  } catch {
    return base;
  }
}

export function gitChangedFiles(base, cwd) {
  const mergeBase = gitMergeBase(base, cwd);
  try {
    // Compare the working tree (equals HEAD in CI) so uncommitted local
    // edits to global graph files are still detected.
    const output = execFileSync("git", ["diff", "--name-only", mergeBase], {
      cwd,
      encoding: "utf8",
    });
    return output
      .split("\n")
      .map(normalizeChangedFile)
      .filter(Boolean);
  } catch (error) {
    console.warn(
      `Warning: git diff against ${mergeBase} failed (${error.message}). Global-file detection skipped.`,
    );
    return [];
  }
}

export function runTurboLsAffected({ base, cwd }) {
  const result = spawnSync(
    "pnpm",
    ["exec", "turbo", "ls", "--affected", "--output", "json"],
    {
      cwd,
      encoding: "utf8",
      env: { ...process.env, TURBO_SCM_BASE: base },
    },
  );

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(
      `turbo ls --affected failed (exit ${result.status}). ${detail}\n` +
        `TURBO_SCM_BASE=${base}`,
    );
  }

  return parseTurboLsJson(result.stdout);
}

function setGithubOutput(name, value) {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  const outFile = process.env.GITHUB_OUTPUT;
  if (!outFile) {
    console.log(`${name}=${serialized}`);
    return;
  }
  if (
    serialized.includes("\n") ||
    serialized.startsWith("[") ||
    serialized.startsWith("{")
  ) {
    fs.appendFileSync(outFile, `${name}<<AFFECTED_EOF\n${serialized}\nAFFECTED_EOF\n`);
  } else {
    fs.appendFileSync(outFile, `${name}=${serialized}\n`);
  }
}

function appendStepSummary(text) {
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (!summary) return;
  fs.appendFileSync(summary, `${text}\n`);
}

function parseArgs(argv) {
  const args = {
    github: false,
    full: false,
    has: null,
    base: null,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--github") args.github = true;
    else if (token === "--full") args.full = true;
    else if (token === "--help" || token === "-h") args.help = true;
    else if (token === "--has") args.has = argv[(i += 1)];
    else if (token === "--base") args.base = argv[(i += 1)];
    else if (token === "--json") {
      /* default */
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node .github/scripts/affected-apps.mjs [options]

Options:
  --github          Write GitHub Actions outputs
  --full            Include every deployable app (schedule / manual)
  --base <ref>      Git comparison base (default: TURBO_SCM_BASE / PR base / previous SHA)
  --has <id>        Exit 0 if that app id is affected, 1 otherwise
  --help            Show this help

Environment:
  TURBO_SCM_BASE, GITHUB_EVENT_NAME, PR_BASE_SHA, GITHUB_EVENT_BEFORE, FULL_REPO
`);
}

export async function main(argv = process.argv.slice(2), options = {}) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return { help: true };
  }

  const root = options.root || repoRoot();
  const full =
    args.full ||
    process.env.FULL_REPO === "true" ||
    process.env.FULL_REPO === "1";
  const deployableApps =
    options.deployableApps || discoverDeployableApps(root);
  const base =
    args.base ||
    resolveScmBase({
      explicitBase: options.base || process.env.TURBO_SCM_BASE,
    });

  const affectedPackages =
    options.affectedPackages ||
    (full ? [] : runTurboLsAffected({ base, cwd: root }));
  const changedFiles =
    options.changedFiles || (full ? [] : gitChangedFiles(base, root));

  const resolved = resolveAffectedApps({
    deployableApps,
    affectedPackages,
    changedFiles,
    full,
    root,
  });

  const hasPlaywright = resolved.matrix.some((app) => app.playwright);
  const payload = {
    mode: full ? "full" : "affected",
    base,
    reason: resolved.reason,
    affectedPackages,
    changedGlobalFiles: resolved.matchedGlobalFiles,
    tsconfigApps: resolved.tsconfigApps,
    apps: resolved.matrix,
    has_apps: resolved.matrix.length > 0,
    has_playwright: hasPlaywright,
  };

  if (args.github) {
    setGithubOutput("mode", payload.mode);
    setGithubOutput("base", base);
    setGithubOutput("reason", resolved.reason);
    setGithubOutput("has_apps", payload.has_apps ? "true" : "false");
    setGithubOutput("has_playwright", hasPlaywright ? "true" : "false");
    setGithubOutput("apps", resolved.matrix);
    const envFile = process.env.GITHUB_ENV;
    if (envFile) {
      fs.appendFileSync(envFile, `TURBO_SCM_BASE=${base}\n`);
    }
  }

  const summaryLines = [
    "## Affected deployable apps",
    "",
    `- Mode: \`${payload.mode}\``,
    `- Base: \`${base}\``,
    `- Reason: \`${resolved.reason}\``,
    `- Turbo affected packages: ${
      affectedPackages.length ? affectedPackages.map((name) => `\`${name}\``).join(", ") : "none"
    }`,
    `- Matrix: ${
      resolved.matrix.length
        ? resolved.matrix.map((app) => `\`${app.id}\` (${app.filter})`).join(", ")
        : "empty — no application builds"
    }`,
    `- Playwright: ${hasPlaywright ? "yes (site job / e2e workflow)" : "no"}`,
    "",
    "Each matrix job runs `turbo run <task> --filter=\"<package>...\"` (package + workspace dependencies).",
    "`--filter` is never combined with `--affected`.",
  ];
  console.log(JSON.stringify(payload, null, 2));
  appendStepSummary(summaryLines.join("\n"));

  if (args.has) {
    const hit = resolved.matrix.some((app) => app.id === args.has);
    if (!hit) {
      const error = new Error(`App '${args.has}' is not affected`);
      error.exitCode = 1;
      throw error;
    }
  }

  return payload;
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message || error);
    process.exit(error.exitCode || 1);
  });
}
