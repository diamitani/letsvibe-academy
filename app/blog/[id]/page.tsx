import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import SectionRenderer from "@/components/section-renderer"
import { getBlogPostById, formatBlogDate } from "@/lib/blog-data"

interface BlogPostPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = getBlogPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All articles
        </Link>
      </Button>

      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <Badge>{post.category}</Badge>
          <span className="text-sm text-muted-foreground">{formatBlogDate(post.date)}</span>
          <span className="text-sm text-muted-foreground">by {post.author}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
      </div>

      {post.sections && post.sections.length > 0 ? (
        <SectionRenderer sections={post.sections} />
      ) : (
        <p className="text-muted-foreground">{post.content}</p>
      )}
    </div>
  )
}
