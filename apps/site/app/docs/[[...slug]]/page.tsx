import path from "path"
import { promises as fs } from "fs"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"

type Frontmatter = {
  title?: string
  description?: string
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function resolveDocPath(slugSegments: string[]) {
  const docsRoot = path.join(process.cwd(), "docs")
  const rel = slugSegments.join(path.sep)

  // If the route points to a directory, prefer README.md / README.mdx
  const dirReadmeMd = path.join(docsRoot, rel, "README.md")
  const dirReadmeMdx = path.join(docsRoot, rel, "README.mdx")

  // If the route points to a file without extension, try .md then .mdx
  const fileMd = path.join(docsRoot, `${rel}.md`)
  const fileMdx = path.join(docsRoot, `${rel}.mdx`)

  // If user hits /docs, show root README
  const rootReadmeMd = path.join(docsRoot, "README.md")
  const rootReadmeMdx = path.join(docsRoot, "README.mdx")

  const candidates =
    slugSegments.length === 0
      ? [rootReadmeMd, rootReadmeMdx]
      : [dirReadmeMd, dirReadmeMdx, fileMd, fileMdx]

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate
  }

  return null
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const docPath = await resolveDocPath(slug)
  if (!docPath) notFound()

  const source = await fs.readFile(docPath, "utf-8")

  const { frontmatter, content } = await compileMDX<Frontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
  })

  const title = frontmatter?.title ?? slug.at(-1) ?? "Docs"
  const description = frontmatter?.description

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            {description}
          </p>
        ) : null}
      </header>

      <article className="prose prose-stone max-w-none dark:prose-invert">
        {content}
      </article>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const docPath = await resolveDocPath(slug)
  if (!docPath) return {}

  try {
    const source = await fs.readFile(docPath, "utf-8")
    const { frontmatter } = await compileMDX<Frontmatter>({
      source,
      options: { parseFrontmatter: true },
    })

    const title = frontmatter?.title ?? slug.at(-1) ?? "Docs"
    const description = frontmatter?.description

    return {
      title: `Docs — ${title}`,
      ...(description ? { description } : {}),
    }
  } catch {
    return {}
  }
}


