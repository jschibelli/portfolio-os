Archived workflows

These workflows are archived to avoid duplicate triggers and to standardize on
optimized, develop-based pipelines under `.github/workflows/`.

## Active replacements (2026)

| Concern | Active file |
|--------|-------------|
| Lint / typecheck / test / build | `ci.yml` — `turbo --affected` (full repo on weekly schedule / manual) |
| Playwright E2E | `e2e-optimized.yml` — `--filter=@mindware-blog/site...` |
| PR / issue orchestration | `orchestrate-issues-prs.yml` (no monorepo build) |
| Issue auto-configure | `auto-configure-issues.yml` |
| PR base retarget | `pr-base-guard.yml` |
| Releases | `release.yml` (tag → GitHub Release; no turbo build) |

## Historical notes

- Older names like `ci-optimized.yml` / `e2e-optimized.yml` were renamed or
  replaced; prefer the table above.
- Nested `apps/site/.github/workflows/*` are inactive leftovers from
  `blog-starter-kit` and are disabled stubs — see `apps/site/.github/README.md`.

Do not modify files here; add or edit workflows in `.github/workflows/`.
