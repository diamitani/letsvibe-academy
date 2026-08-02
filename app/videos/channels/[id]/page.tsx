"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getVideosByChannel, getAllChannels, type Video } from "@/lib/video-data"
import VideoGrid from "@/components/video-grid"

interface ChannelPageProps {
  params: {
    id: string
  }
}

export default function ChannelPage({ params }: ChannelPageProps) {
  const [channel, setChannel] = useState<{ id: string; title: string; handle: string | null } | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChannelData = () => {
      const allChannels = getAllChannels()
      const foundChannel = allChannels.find((c) => c.id === params.id)

      if (foundChannel) {
        setChannel(foundChannel)
        setVideos(getVideosByChannel(params.id))
      }

      setLoading(false)
    }

    fetchChannelData()
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

  if (!channel) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Channel not found</h2>
          <Button asChild>
            <Link href="/videos/channels">Back to Channels</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/videos/channels">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Channels
        </Link>
      </Button>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{channel.title.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{channel.title}</h1>
            {channel.handle && <p className="text-muted-foreground">{channel.handle}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Videos ({videos.length})</h2>
          {videos.length > 0 ? (
            <VideoGrid category="all" />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos found for this channel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
