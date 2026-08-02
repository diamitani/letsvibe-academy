import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { articles, formatDate } from "@/lib/article-data"

export default function FeaturedArticle() {
  // Get the first article as the featured one
  const featuredArticle = articles[0]

  return (
    <section className="container py-8 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Featured AI Article</h2>
          <p className="text-muted-foreground text-lg">Latest insights and developments in AI technology</p>
        </div>
        <Button variant="ghost" className="mt-4 md:mt-0" asChild>
          <Link href="/blog">
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={featuredArticle.image || "/placeholder.svg?height=400&width=600&query=AI technology"}
            alt={featuredArticle.title}
            className="w-full aspect-[16/9] object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">Featured</span>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <span className="text-sm font-medium text-primary">AI News</span>
            <h3 className="text-2xl font-bold mt-1">{featuredArticle.title}</h3>
          </div>
          <p className="text-muted-foreground">{featuredArticle.chatCompletionSummary || featuredArticle.summary}</p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium">
                {featuredArticle.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="font-medium">{featuredArticle.author}</p>
              <p className="text-sm text-muted-foreground">{formatDate(featuredArticle.datePublished)}</p>
            </div>
          </div>
          <Button className="w-fit" asChild>
            <Link href={featuredArticle.url} target="_blank" rel="noopener noreferrer">
              Read Full Article
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
