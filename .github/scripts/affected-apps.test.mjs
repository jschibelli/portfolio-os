import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  GLOBAL_GRAPH_FILES,
  detectScripts,
  discoverDeployableApps,
  parseTurboLsJson,
  repoRoot,
  resolveAffectedApps,
  resolveScmBase,
  toMatrixApp,
  turboFilter,
  ZERO_SHA,
} from "./affected-apps.mjs";

const root = repoRoot();
const apps = discoverDeployableApps(root);
const byId = Object.fromEntries(apps.map((app) => [app.id, app]));

describe("discoverDeployableApps", () => {
  it("reads actual apps/* package names and does not include packages/*", () => {
    assert.deepEqual(
      apps.map((app) => app.id).sort(),
      ["dashboard", "docs", "site"],
    );
    assert.equal(byId.site.package, "@mindware-blog/site");
    assert.equal(byId.dashboard.package, "@mindware-blog/dashboard");
    assert.equal(byId.docs.package, "@portfolio/docs");
    assert.ok(apps.every((app) => app.dir.startsWith("apps/")));
  });

  it("detects per-app scripts without inventing placeholders", () => {
    assert.equal(byId.site.scripts.build, true);
    assert.equal(byId.site.scripts.lint, true);
    assert.equal(byId.site.scripts.typecheck, true);
    assert.equal(byId.site.scripts.test, true);
    assert.equal(byId.site.scripts.storybook, true);
    assert.equal(byId.site.scripts.playwright, true);
    assert.equal(byId.site.scripts.prisma, true);

    assert.equal(byId.dashboard.scripts.build, true);
    assert.equal(byId.dashboard.scripts.lint, true);
    assert.equal(byId.dashboard.scripts.typecheck, true);
    assert.equal(byId.dashboard.scripts.test, true);
    assert.equal(byId.dashboard.scripts.storybook, false);
    assert.equal(byId.dashboard.scripts.playwright, false);
    assert.equal(byId.dashboard.scripts.prisma, true);

    assert.equal(byId.docs.scripts.build, true);
    assert.equal(byId.docs.scripts.lint, true);
    assert.equal(byId.docs.scripts.typecheck, false);
    assert.equal(byId.docs.scripts.test, false);
    assert.equal(byId.docs.scripts.storybook, false);
    assert.equal(byId.docs.scripts.playwright, false);
    assert.equal(byId.docs.scripts.prisma, false);
  });

  it("ignores placeholder npm test scripts", () => {
    const scripts = detectScripts({
      scripts: { test: 'echo "Error: no test specified" && exit 1' },
    });
    assert.equal(scripts.test, false);
  });
});

describe("resolveAffectedApps scenarios", () => {
  it("A: site package only → site matrix job", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: ["@mindware-blog/site"],
      changedFiles: ["apps/site/app/page.tsx"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["site"],
    );
  });

  it("B: docs package only → docs matrix job", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: ["@portfolio/docs"],
      changedFiles: ["apps/docs/README.md"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["docs"],
    );
  });

  it("C: dashboard package only → dashboard matrix job", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: ["@mindware-blog/dashboard"],
      changedFiles: ["apps/dashboard/app/page.tsx"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["dashboard"],
    );
  });

  it("D: shared package consumed only by site → site", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      // turbo ls --affected walks dependents: utils → site
      affectedPackages: ["@starter-kit/utils", "@mindware-blog/site"],
      changedFiles: ["packages/utils/index.ts"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["site"],
    );
  });

  it("E: shared package consumed by site + dashboard → two jobs", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: [
        "@mindware-blog/ui",
        "@mindware-blog/site",
        "@mindware-blog/dashboard",
      ],
      changedFiles: ["packages/ui/index.ts"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["dashboard", "site"],
    );
    assert.ok(result.matrix.every((app) => app.filter.endsWith("...")));
  });

  it("F: global build configuration → every deployable app, still independent entries", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: [],
      changedFiles: ["turbo.json"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["dashboard", "docs", "site"],
    );
    assert.deepEqual(result.matchedGlobalFiles, ["turbo.json"]);
  });

  it("F: lockfile / workspace / root package.json are global", () => {
    for (const file of GLOBAL_GRAPH_FILES) {
      const result = resolveAffectedApps({
        deployableApps: apps,
        affectedPackages: [],
        changedFiles: [file],
        root,
      });
      assert.equal(result.matrix.length, 3, file);
    }
  });

  it("G: documentation / workflow-only change → no app builds", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: [],
      changedFiles: [
        "README.md",
        "docs/architecture.md",
        ".github/workflows/ci.yml",
      ],
      root,
    });
    assert.deepEqual(result.matrix, []);
    assert.equal(result.reason, "no-app-affected");
  });

  it("root tsconfig.json affects only apps that extend it (site + dashboard, not docs)", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      affectedPackages: [],
      changedFiles: ["tsconfig.json"],
      root,
    });
    assert.deepEqual(
      result.matrix.map((app) => app.id),
      ["dashboard", "site"],
    );
  });

  it("full repo mode includes every deployable app", () => {
    const result = resolveAffectedApps({
      deployableApps: apps,
      full: true,
      root,
    });
    assert.equal(result.reason, "full-repo");
    assert.equal(result.matrix.length, 3);
  });
});

describe("turbo helpers", () => {
  it("builds the Turbo 2.x package+deps filter", () => {
    assert.equal(turboFilter("@mindware-blog/site"), "@mindware-blog/site...");
    assert.equal(toMatrixApp(byId.site).filter, "@mindware-blog/site...");
  });

  it("parses turbo ls --output json", () => {
    const names = parseTurboLsJson({
      packages: {
        items: [
          { name: "@mindware-blog/site", path: "apps/site" },
          { name: "@mindware-blog/ui", path: "packages/ui" },
        ],
      },
    });
    assert.deepEqual(names, ["@mindware-blog/site", "@mindware-blog/ui"]);
  });
});

describe("resolveScmBase", () => {
  it("uses PR base SHA for pull_request events", () => {
    assert.equal(
      resolveScmBase({
        eventName: "pull_request",
        prBaseSha: "abc123",
        beforeSha: "def456",
        refExists: () => false,
      }),
      "abc123",
    );
  });

  it("uses the previous commit on push", () => {
    assert.equal(
      resolveScmBase({
        eventName: "push",
        beforeSha: "def456",
        refExists: () => false,
      }),
      "def456",
    );
  });

  it("ignores the zero SHA and falls back", () => {
    assert.equal(
      resolveScmBase({
        eventName: "push",
        beforeSha: ZERO_SHA,
        fallbacks: ["origin/develop"],
        refExists: (ref) => ref === "origin/develop",
      }),
      "origin/develop",
    );
  });
});

describe("installed Turbo 2.5.x filters", () => {
  function turboJson(args) {
    const result = spawnSync("pnpm", ["exec", "turbo", ...args], {
      cwd: root,
      encoding: "utf8",
      env: process.env,
    });
    return result;
  }

  function dryPackages(filter) {
    const result = turboJson([
      "run",
      "build",
      `--filter=${filter}`,
      "--dry-run=json",
    ]);
    assert.equal(result.status, 0, result.stderr);
    const jsonStart = result.stdout.indexOf("{");
    const data = JSON.parse(result.stdout.slice(jsonStart));
    return data.packages;
  }

  it("rejects combining --filter and --affected", () => {
    const result = turboJson([
      "run",
      "build",
      "--filter=@mindware-blog/site",
      "--affected",
      "--dry-run=json",
    ]);
    assert.notEqual(result.status, 0);
    assert.match(
      `${result.stderr}\n${result.stdout}`,
      /cannot be used with '--affected'/,
    );
  });

  it("site... includes site workspace deps but not dashboard or docs", () => {
    const packages = dryPackages("@mindware-blog/site...");
    assert.ok(packages.includes("@mindware-blog/site"));
    assert.ok(packages.includes("@mindware-blog/ui"));
    assert.ok(packages.includes("@starter-kit/utils"));
    assert.ok(!packages.includes("@mindware-blog/dashboard"));
    assert.ok(!packages.includes("@portfolio/docs"));
  });

  it("docs... is isolated from site and dashboard", () => {
    const packages = dryPackages("@portfolio/docs...");
    assert.deepEqual(packages, ["@portfolio/docs"]);
  });

  it("dashboard... includes shared UI but not site or docs", () => {
    const packages = dryPackages("@mindware-blog/dashboard...");
    assert.ok(packages.includes("@mindware-blog/dashboard"));
    assert.ok(packages.includes("@mindware-blog/ui"));
    assert.ok(!packages.includes("@mindware-blog/site"));
    assert.ok(!packages.includes("@portfolio/docs"));
  });
});

describe("script CLI", () => {
  it("prints JSON for a mocked no-app change via --full=false default", () => {
    const script = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "affected-apps.mjs",
    );
    const result = spawnSync(process.execPath, [script, "--help"], {
      encoding: "utf8",
    });
    assert.equal(result.status, 0);
    assert.match(result.stdout, /TURBO_SCM_BASE/);
  });
});
