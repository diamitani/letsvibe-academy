import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, SearchX } from "lucide-react"
import Link from "next/link"
import type { Tool } from "@/lib/tools-data"

interface ToolsGridProps {
  tools: Tool[]
  buttonLabel?: string
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

export default function ToolsGrid({ tools, buttonLabel = "Visit" }: ToolsGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-16">
        <SearchX className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">No tools found matching your criteria.</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => {
        const domain = getDomain(tool.link)
        return (
          <Card key={tool.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {domain && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
                      alt=""
                      className="h-6 w-6 rounded shrink-0 bg-muted"
                      loading="lazy"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = "none"
                      }}
                    />
                  )}
                  <CardTitle className="text-lg leading-snug truncate" title={tool.name}>
                    {tool.name}
                  </CardTitle>
                </div>
                {tool.featured && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 shrink-0" />}
              </div>
              <Badge variant="secondary" className="mt-1.5 w-fit">
                {tool.category}
              </Badge>
            </CardHeader>
            <CardContent className="py-4 flex-grow">
              <p className="text-muted-foreground text-sm line-clamp-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {tool.useCase && (
                  <Badge variant="outline" className="text-xs">
                    {tool.useCase}
                  </Badge>
                )}
                {tool.industry && (
                  <Badge variant="outline" className="text-xs">
                    {tool.industry}
                  </Badge>
                )}
                {tool.setting && (
                  <Badge variant="outline" className="text-xs">
                    {tool.setting}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" asChild>
                <Link href={tool.link} target="_blank" rel="noopener noreferrer">
                  {buttonLabel}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
