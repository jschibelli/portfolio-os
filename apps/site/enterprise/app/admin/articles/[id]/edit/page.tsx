// /app/admin/articles/[id]/edit/page.tsx
// Edit article page - fetches existing article and renders ArticleEditor

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ArticleEditor } from '../../_components/ArticleEditor'

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditArticlePage(props: EditArticlePageProps) {
  const params = await props.params;
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    }
  })

  if (!article) {
    notFound()
  }

  // Transform the article data for the editor
  const editorData = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    tags: article.tags.map(t => t.tag.name),
    coverUrl: article.cover?.url || '',
    content: article.contentJson || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ],
    }
  }

  return <ArticleEditor initialData={editorData} />
}
