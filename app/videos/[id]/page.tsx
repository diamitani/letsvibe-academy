"use client"

import { Input } from "@/components/ui/input"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Bookmark } from "lucide-react"
import Link from "next/link"
import { getVideoById, formatDate, getVideosByChannel, type Video } from "@/lib/video-data"
import VideoPlayer from "@/components/video-player"
import RelatedVideos from "@/components/related-videos"

interface VideoPageProps {
  params: {
    id: string
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  const [video, setVideo] = useState<Video | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideo = () => {
      const foundVideo = getVideoById(params.id)

      if (foundVideo) {
        setVideo(foundVideo)

        // Get related videos from the same channel
        const channelVideos = getVideosByChannel(foundVideo.channelId)
          .filter((v) => v.id !== foundVideo.id)
          .slice(0, 3)

        setRelatedVideos(channelVideos)
      }

      setLoading(false)
    }

    fetchVideo()
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Video not found</h2>
          <Button asChild>
            <Link href="/videos">Back to Videos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/videos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Videos
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden mb-6">
            <VideoPlayer videoId={video.id} />
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{video.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary">{video.category || "Automation"}</Badge>
                <span className="text-sm text-muted-foreground">
                  {video.publishingDate ? formatDate(video.publishingDate) : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">{video.channelTitle.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{video.channelTitle}</p>
                    <p className="text-sm text-muted-foreground">{video.channelHandle || ""}</p>
                  </div>
                </div>
                <p className="whitespace-pre-line">{video.description}</p>
              </CardContent>
            </Card>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold mb-4">Comments</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <Input placeholder="Add a comment..." className="flex-1" />
                <Button>Comment</Button>
              </div>
              <div className="space-y-4 mt-6">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">John Doe</p>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="mt-1">
                      Great video! I've been looking for ways to automate my workflow with Make.com.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        <span className="text-xs">12</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        <span className="text-xs">Reply</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Jane Smith</p>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="mt-1">This automation saved me so much time! Thanks for sharing these insights.</p>
                    <div className="flex gap-4 mt-2">
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        <span className="text-xs">8</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        <span className="text-xs">Reply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Related Videos</h2>
          <RelatedVideos videos={relatedVideos} currentVideoId={video.id} />
        </div>
      </div>
    </div>
  )
}
