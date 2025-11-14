import { refractor } from "refractor"
// Load the SQL grammar so we can safely alias Prisma to it.
// The language modules ship without TypeScript types, so we ignore the error.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error - refractor language modules have no types
import sql from "refractor/sql"

// Register SQL with refractor so `refractor.languages.sql` is defined.
refractor.register(sql)

// Alias `prisma` to `sql` so MDX code fences like ```prisma are highlighted
// instead of causing "Unknown language" errors at compile time.
const existing =
  refractor.languages.prisma || refractor.languages.sql || undefined

if (!refractor.languages.prisma && existing) {
  refractor.languages.prisma = existing
}
