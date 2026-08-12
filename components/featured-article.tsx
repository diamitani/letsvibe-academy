import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import { blogPosts, formatBlogDate } from "@/lib/blog-data"

export default function FeaturedArticle() {
  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0]

  if (!featured) return null

  return (
    <section className="container py-8 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Featured Article</h2>
          <p className="text-muted-foreground text-lg">From the LiveBuildAI content library</p>
        </div>
        <Button variant="ghost" className="mt-4 md:mt-0" asChild>
          <Link href="/blog">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg bg-primary/5 flex items-center justify-center min-h-[240px]">
          <BookOpen className="h-16 w-16 text-primary/30" />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">Featured</span>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <span className="text-sm font-medium text-primary">{featured.category}</span>
            <h3 className="text-2xl font-bold mt-1">{featured.title}</h3>
          </div>
          <p className="text-muted-foreground">{featured.excerpt}</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-medium text-primary">
                {featured.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="font-medium">{featured.author}</p>
              <p className="text-sm text-muted-foreground">{formatBlogDate(featured.date)}</p>
            </div>
          </div>
          <Button className="w-fit" asChild>
            <Link href={`/blog/${featured.id}`}>
              Read Full Article
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
