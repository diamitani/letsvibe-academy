import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAllChannels, getVideosByChannel } from "@/lib/video-data"
import Link from "next/link"

export default function ChannelsPage() {
  const channels = getAllChannels()

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Video Channels</h1>
          <p className="text-muted-foreground text-lg">
            Explore content from our featured AI and automation content creators.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => {
            const channelVideos = getVideosByChannel(channel.id)

            return (
              <Card key={channel.id} className="overflow-hidden">
                <div className="bg-primary h-32 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{channel.title.charAt(0)}</span>
                </div>
                <CardHeader>
                  <CardTitle>{channel.title}</CardTitle>
                  {channel.handle && <p className="text-sm text-muted-foreground">{channel.handle}</p>}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline">{channelVideos.length} videos</Badge>
                    <Link href={`/videos?channel=${channel.id}`} className="text-sm text-primary hover:underline">
                      View all videos
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {channelVideos.slice(0, 3).map((video) => (
                      <Link href={`/videos/${video.id}`} key={video.id} className="block">
                        <div className="text-sm hover:text-primary truncate">{video.title}</div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
