import { Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import BlogGrid from "@/components/blog-grid"
import BlogLoading from "@/components/blog-loading"

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Articles</h1>
          <p className="text-muted-foreground text-lg">
            Stay updated with the latest news, insights, and developments in the world of AI.
          </p>
        </div>

        <div className="flex w-full max-w-lg items-center space-x-2">
          <Input placeholder="Search articles..." className="h-10" />
          <Button type="submit" size="icon" className="h-10 w-10">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Suspense fallback={<BlogLoading />}>
          <BlogGrid />
        </Suspense>
      </div>
    </div>
  )
}
