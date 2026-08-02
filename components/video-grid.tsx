import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Link from "next/link"
import { videos, formatDate } from "@/lib/video-data"

interface VideoGridProps {
  category: string
  searchQuery?: string
}

export default function VideoGrid({ category, searchQuery = "" }: VideoGridProps) {
  // Filter videos based on category and search query
  const filteredVideos = videos.filter((video) => {
    // Filter by category
    const categoryMatch = category === "all" || video.category === category

    // Filter by search query if provided
    const searchMatch =
      searchQuery === "" ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No videos found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.map((video) => (
        <Link href={`/videos/${video.id}`} key={video.id}>
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={video.thumbnailUrl || "/placeholder.svg?height=200&width=350&query=video thumbnail"}
                alt={video.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-primary p-3">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              {video.category && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  {video.category}
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{video.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{video.channelTitle}</span>
                <Badge variant="outline">{video.publishingDate ? formatDate(video.publishingDate) : "N/A"}</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
