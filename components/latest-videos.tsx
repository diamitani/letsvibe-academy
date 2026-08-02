import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play } from "lucide-react"
import { videos } from "@/lib/video-data"

export default function LatestVideos() {
  // Get the 3 most recent videos based on publishing date
  const latestVideos = [...videos]
    .filter((video) => video.publishingDate) // Filter out videos without publishing date
    .sort((a, b) => {
      const dateA = a.publishingDate ? new Date(a.publishingDate).getTime() : 0
      const dateB = b.publishingDate ? new Date(b.publishingDate).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 3)

  return (
    <section className="container py-8 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Latest Videos</h2>
          <p className="text-muted-foreground text-lg">Watch our latest tutorials, interviews, and demonstrations.</p>
        </div>
        <Button variant="ghost" className="mt-4 md:mt-0" asChild>
          <Link href="/videos">
            View All Videos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {latestVideos.map((video) => (
          <Link href={`/videos/${video.id}`} key={video.id}>
            <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={video.thumbnailUrl || "/placeholder.svg"}
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
                <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{video.channelTitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
