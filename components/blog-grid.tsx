import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { articles, formatDate } from "@/lib/article-data"

export default function BlogGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link href={article.url} key={article.id} target="_blank" rel="noopener noreferrer">
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <img
              src={article.image || "/placeholder.svg?height=250&width=500&query=AI technology"}
              alt={article.title}
              className="w-full aspect-[16/9] object-cover"
            />
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <Badge>AI News</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(article.datePublished)}</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {article.chatCompletionSummary || article.summary}
              </p>
            </CardContent>
            <CardFooter className="px-6 py-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {article.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{article.author}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
