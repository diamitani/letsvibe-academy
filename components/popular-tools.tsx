import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink, Star } from "lucide-react"
import { getFeaturedTools } from "@/lib/tools-data"

export default function PopularTools() {
  // Get up to 8 featured tools for the homepage
  const featuredTools = getFeaturedTools().slice(0, 8)

  return (
    <section className="container py-8 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Popular AI Tools</h2>
          <p className="text-muted-foreground text-lg">
            Discover our featured custom GPTs — and explore 820+ tools in the full AI directory.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/tools">
              AI Tool Directory
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/tools">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredTools.map((tool) => (
          <Card key={tool.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
              <Badge variant="secondary" className="mt-1 w-fit">
                {tool.category}
              </Badge>
            </CardHeader>
            <CardContent className="py-4 flex-grow">
              <p className="text-muted-foreground text-sm">{tool.description}</p>
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
    </section>
  )
}
