import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatBlogDate } from "@/lib/blog-data"
import type { BlogPost } from "@/lib/blog-data"

interface BlogGridProps {
  posts: BlogPost[]
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/blog/${post.id}`} key={post.id}>
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-3">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="text-xs text-muted-foreground">{formatBlogDate(post.date)}</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="px-6 py-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
