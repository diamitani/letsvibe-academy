import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Youtube, Rss, MonitorPlay, GraduationCap } from "lucide-react"
import {
  resourceCourses,
  youtubeChannels,
  rssFeeds,
  platforms,
} from "@/lib/resources-data"

function LinkList({ items, icon: Icon }: { items: { name: string; url: string; description?: string }[]; icon: React.ElementType }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.name + item.url}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-muted/60 transition-colors group"
          >
            <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">{item.name}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              )}
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function ResourcesPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Resources Hub</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          The best places to keep learning vibe coding — recommended courses, YouTube channels, platforms,
          and feeds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Recommended Courses ({resourceCourses.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resourceCourses.map((course) => (
              <a
                key={course.id}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold group-hover:text-primary transition-colors">{course.title}</p>
                    <p className="text-sm text-primary">{course.provider}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {course.level && <Badge variant="outline" className="text-xs">{course.level}</Badge>}
                  {course.price && <Badge variant="outline" className="text-xs">{course.price}</Badge>}
                  {course.duration && <Badge variant="outline" className="text-xs">{course.duration}</Badge>}
                </div>
              </a>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-primary" />
                <CardTitle>YouTube Channels ({youtubeChannels.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <LinkList items={youtubeChannels} icon={Youtube} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MonitorPlay className="h-5 w-5 text-primary" />
                <CardTitle>Platforms ({platforms.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <LinkList items={platforms} icon={MonitorPlay} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Rss className="h-5 w-5 text-primary" />
                <CardTitle>RSS Feeds ({rssFeeds.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <LinkList items={rssFeeds} icon={Rss} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
