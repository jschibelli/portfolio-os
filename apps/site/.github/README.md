# apps/site/.github — INACTIVE

GitHub Actions **only** discovers workflows from the repository root:

`.github/workflows/`

Workflows under `apps/site/.github/workflows/` are **never executed** by GitHub for this monorepo. They are leftovers from the old `packages/blog-starter-kit/themes/enterprise` layout.

## Active replacements (repo root)

| Concern | Active workflow |
|--------|------------------|
| Lint / typecheck / test / build | `.github/workflows/ci.yml` (`turbo --affected`) |
| Playwright E2E | `.github/workflows/e2e-optimized.yml` (`--filter=@mindware-blog/site...`) |
| Add to project | `.github/workflows/add-to-project.yml` |
| PR automation / orchestration | `.github/workflows/orchestrate-issues-prs.yml` |

## Files here

| File | Status |
|------|--------|
| `workflows/main.yml` | Disabled stub — referenced deleted `blog-starter-kit` path |
| `workflows/pr-automation.yml` | Disabled stub — used `npm` + missing scripts |
| `workflows/add-to-project.yml` | Disabled stub — duplicate of root workflow |
| `actions/setup-pnpm/` | Unused by root CI; root uses `.github/actions/setup-node-pnpm` |

Do not re-enable these without rewriting them for `@mindware-blog/site` and moving them to the repo-root `.github/workflows/` directory.
