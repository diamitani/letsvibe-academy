"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import BlogGrid from "@/components/blog-grid"
import { blogPosts, getBlogCategories } from "@/lib/blog-data"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  const categories = ["all", ...getBlogCategories()]

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return blogPosts.filter((post) => {
      const catOk = category === "all" || post.category === category
      const searchOk =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q)
      return catOk && searchOk
    })
  }, [category, searchQuery])

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Articles</h1>
          <p className="text-muted-foreground text-lg">
            Tutorials, news briefings, and how-to guides from the LiveBuildAI content library.
          </p>
        </div>

        <div className="flex w-full max-w-lg items-center space-x-2">
          <Input
            placeholder="Search articles..."
            className="h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" className="h-10 w-10" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
              className="capitalize"
            >
              {c === "all" ? "All" : c}
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}
        </p>

        {filteredPosts.length > 0 ? (
          <BlogGrid posts={filteredPosts} />
        ) : (
          <p className="text-muted-foreground text-center py-12">No articles found.</p>
        )}
      </div>
    </div>
  )
}
