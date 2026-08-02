import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star } from "lucide-react"
import Link from "next/link"
import { tools } from "@/lib/tools-data"

interface ToolsGridProps {
  category: string
  searchQuery?: string
}

export default function ToolsGrid({ category, searchQuery = "" }: ToolsGridProps) {
  // Filter tools based on category and search query
  const filteredTools = tools.filter((tool) => {
    // Filter by category
    const categoryMatch = category === "all" || tool.category === category

    // Filter by search query if provided
    const searchMatch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.useCase && tool.useCase.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tool.industry && tool.industry.toLowerCase().includes(searchQuery.toLowerCase()))

    return categoryMatch && searchMatch
  })

  if (filteredTools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tools found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredTools.map((tool) => (
        <Card key={tool.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{tool.name}</CardTitle>
              {tool.featured && <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
            </div>
            <Badge variant="secondary" className="mt-1 w-fit">
              {tool.category}
            </Badge>
          </CardHeader>
          <CardContent className="py-4 flex-grow">
            <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
            <div className="flex flex-wrap gap-2">
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
                Open GPT
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
