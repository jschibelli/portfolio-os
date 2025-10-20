# Temporary Scripts Directory

This directory is for temporary automation scripts that are needed during development but should not be committed to version control.

## Purpose

- Store temporary helper scripts during development
- Keep temporary automation separate from permanent scripts
- Gitignored to prevent accidental commits

## Guidelines

1. **Use existing scripts first** - Check `scripts/` subdirectories before creating new temp scripts
2. **Name descriptively** - Use clear names that explain the script's purpose
3. **Clean up** - Delete scripts when no longer needed
4. **Document if needed** - Add comments if the script will be used by others

## When to Use

✅ **Use this directory for:**
- One-off migration scripts
- Temporary test/debug scripts
- Quick automation helpers during development
- Scripts you're prototyping before moving to permanent location

❌ **Do NOT use for:**
- Reusable scripts (use appropriate `scripts/` subdirectory)
- Build or deployment scripts (use `scripts/build-tools/`)
- Permanent automation (use appropriate `scripts/` subdirectory)

## Alternative to Creating Temp Scripts

Before creating a temp script, consider if there's already a script that does what you need in:
- `scripts/core-utilities/`
- `scripts/automation/`
- `scripts/housekeeping/`
- Other organized subdirectories in `scripts/`

## See Also

- `WORKSPACE.md` - Overall workspace organization guidelines
- `scripts/README.md` - Scripts directory organization (if exists)
- `docs/CONTRIBUTING.md` - General contribution guidelines

