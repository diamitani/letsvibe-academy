import { Card, CardContent } from "@/components/ui/card"
import { type Video, formatDate } from "@/lib/video-data"
import Link from "next/link"

interface RelatedVideosProps {
  videos: Video[]
  currentVideoId: string
}

export default function RelatedVideos({ videos, currentVideoId }: RelatedVideosProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No related videos found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Link href={`/videos/${video.id}`} key={video.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row lg:flex-col">
              <div className="relative w-full sm:w-1/3 lg:w-full">
                <img
                  src={video.thumbnailUrl || "/placeholder.svg?height=90&width=160&query=video thumbnail"}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                {video.category && (
                  <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                    {video.category}
                  </div>
                )}
              </div>
              <CardContent className="p-3 flex-1">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h4>
                <div className="flex flex-col text-xs">
                  <span className="text-muted-foreground">{video.channelTitle}</span>
                  <span className="text-muted-foreground">
                    {video.publishingDate ? formatDate(video.publishingDate) : "N/A"}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
